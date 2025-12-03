from fastapi import APIRouter, Query, HTTPException
from typing import Any, Dict, List, Optional, Tuple
import re
from database.connection import get_db, get_course_collections
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection

router = APIRouter(tags=["Courses"])

# ------------------------------------------------------------------------------
# Pydantic Model
# ------------------------------------------------------------------------------

class CourseOut(BaseModel):
    requirement_id: Optional[str] = None
    category: Optional[str] = None
    course_name: Optional[str] = None
    course_code: Optional[str] = None
    professor: Optional[str] = None

    # 추가 필드
    day: Optional[str] = None
    period: Optional[str] = None
    classroom: Optional[str] = None
    plan_keywords: Optional[List[str]] = None
    test_keywords: Optional[List[str]] = None
    assignment_keywords: Optional[List[str]] = None
    method_keywords: Optional[List[str]] = None
    etc_keywords: Optional[List[str]] = None
    note: Optional[str] = None

    timeslot: Optional[str] = None
    credits: Optional[int] = None
    cls: Optional[str] = Field(default=None, serialization_alias="class", validation_alias="class")

    group: Optional[str] = None
    year: Optional[int] = None
    major_track: Optional[str] = None
    general_type: Optional[str] = None
    source_collection: Optional[str] = None
    source_sheet: Optional[str] = None
    설명란: Optional[str] = None
    비고: Optional[str] = None


# ------------------------------------------------------------------------------
# 컬렉션명으로 기본값 추론
# ------------------------------------------------------------------------------

def _defaults_from_collection(name: str) -> Dict[str, Any]:
    d: Dict[str, Any] = {"source_collection": name}

    if name.startswith("courses_") and "_major" in name:
        m = re.search(r"courses_(\d{4})_major", name)
        if m:
            try:
                d["year"] = int(m.group(1))
            except Exception:
                pass
        d["group"] = "전공"

        if name.endswith("_sci"):
            d["major_track"] = "컴퓨터 과학"
        elif name.endswith("_sw"):
            d["major_track"] = "컴퓨터 소프트웨어"
        elif name.endswith("_bd"):
            d["major_track"] = "빅데이터"

    elif name == "courses_NormalStudy":
        d["group"] = "일반선택/교직"
        d["general_type"] = "일반선택"

    elif name == "core_general":
        d["group"] = "교양"
        d["general_type"] = "핵심 교양"

    elif name == "balance_general":
        d["group"] = "교양"
        d["general_type"] = "균형 교양"

    elif name == "basic_general":
        d["group"] = "교양"
        d["general_type"] = "기초 교양"

    return d


# ------------------------------------------------------------------------------
# 검색 조건 생성
# ------------------------------------------------------------------------------

def _build_match(
    q: Optional[str],
    year: Optional[int],
    group: Optional[str],
    category: Optional[str],
    major_track: Optional[str],
    general_type: Optional[str],
) -> Dict[str, Any]:

    cond: Dict[str, Any] = {}

    # year/group/general_type 필터 (주의: 실제 DB에 없으면 파이썬 후처리 필요)
    if year is not None:
        cond["year"] = year
    if group:
        cond["group"] = group
    if category:
        cond["category"] = category
    if major_track:
        cond["major_track"] = major_track
    if general_type:
        cond["general_type"] = general_type

    # 검색 q 확장
    if q:
        regex = {"$regex": q, "$options": "i"}
        cond["$or"] = [
            {"course_name": regex},
            {"professor": regex},
            {"course_code": regex},
            {"category": regex},
            {"requirement_id": regex},
            {"비고": regex},

            # 키워드 필드 검색 추가
            {"plan_keywords": regex},
            {"test_keywords": regex},
            {"assignment_keywords": regex},
            {"method_keywords": regex},
            {"etc_keywords": regex},
            {"note": regex},
        ]

    return cond


# ------------------------------------------------------------------------------
# 타입 변환 + 기본값 주입
# ------------------------------------------------------------------------------

_STRING_KEYS = (
    "course_code", "requirement_id", "category",
    "course_name", "professor"
)

def _coerce_and_fill(doc: Dict[str, Any], defaults: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return doc

    for k in _STRING_KEYS:
        if k in doc and doc[k] is not None and not isinstance(doc[k], str):
            doc[k] = str(doc[k])

    for key in ("plan_keywords", "test_keywords", "assignment_keywords", "method_keywords", "etc_keywords"):
        value = doc.get(key)
        if isinstance(value, str):
            parts = [p.strip() for p in value.split(',') if p and p.strip()]
            doc[key] = parts or None

    if "source_collection" not in doc:
        doc["source_collection"] = defaults.get("source_collection")

    for k in ("year", "group", "major_track", "general_type"):
        if doc.get(k) is None and defaults.get(k) is not None:
            doc[k] = defaults[k]

    doc.pop("_id", None)
    return doc


# ------------------------------------------------------------------------------
# 단일 컬렉션 조회
# ------------------------------------------------------------------------------

async def _fetch_from_collection(
    col: AsyncIOMotorCollection,
    defaults: Dict[str, Any],
    match: Dict[str, Any],
    skip: int,
    limit: int,
) -> List[Dict[str, Any]]:

    cur = col.find(match, {
        "_id": 0,
        "requirement_id": 1, "category": 1,
        "course_name": 1, "course_code": 1,
        "professor": 1,
        "group": 1, "year": 1,
        "major_track": 1, "general_type": 1,
        "source_collection": 1, "source_sheet": 1,
        "설명란": 1, "비고": 1,

        # 추가한 필드 projection
        "day": 1,
        "period": 1,
        "classroom": 1,
        "plan_keywords": 1,
        "test_keywords": 1,
        "assignment_keywords": 1,
        "method_keywords": 1,
        "etc_keywords": 1,
        "note": 1,
        "credits": 1,
    }).skip(skip).limit(limit)

    docs = await cur.to_list(length=limit)
    return [_coerce_and_fill(d, defaults) for d in docs]


# ------------------------------------------------------------------------------
# 여러 컬렉션 union
# ------------------------------------------------------------------------------

async def _fetch_union_collections(
    db: AsyncIOMotorDatabase,
    match: Dict[str, Any],
    skip: int,
    limit: int,
) -> List[Dict[str, Any]]:

    result: List[Dict[str, Any]] = []
    if limit <= 0:
        return result

    colls = await get_course_collections()
    if not colls:
        return result

    remaining_to_skip = skip
    remaining_to_take = limit

    for col in colls:
        defaults = _defaults_from_collection(col.name)

        try:
            count = await col.count_documents(match)
        except Exception:
            count = None

        local_skip = 0
        if count is not None:
            if remaining_to_skip >= count:
                remaining_to_skip -= count
                continue
            else:
                local_skip = remaining_to_skip
                remaining_to_skip = 0
        else:
            local_skip = remaining_to_skip
            remaining_to_skip = 0

        take_here = remaining_to_take
        chunk = await _fetch_from_collection(col, defaults, match, local_skip, take_here)
        result.extend(chunk)

        remaining_to_take -= len(chunk)
        if remaining_to_take <= 0:
            break

    return result


# ------------------------------------------------------------------------------
# 문서 정규화 (프론트용 timeslot/cls 등)
# ------------------------------------------------------------------------------

def _normalize_course_for_response(doc: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if not isinstance(doc, Dict):
        return None

    d = dict(doc)

    # course_name 보완
    if not d.get("course_name"):
        for k in ("name", "title", "courseTitle", "과목명"):
            v = d.get(k)
            if isinstance(v, str) and v.strip():
                d["course_name"] = v.strip()
                break
    if not d.get("course_name"):
        return None

    # timeslot: 기존 필드 → day+period 조합
    if not d.get("timeslot"):

        for k in ("time", "times", "schedule", "시간표"):
            v = d.get(k)
            if isinstance(v, str) and v.strip():
                d["timeslot"] = v.strip()
                break

        if not d.get("timeslot") and d.get("day") and d.get("period"):
            d["timeslot"] = f"{d['day']} {d['period']}교시"

    # 분반 정보 채우기
    if not d.get("class"):
        for k in ("class", "section", "분반", "classroom"):
            v = d.get(k)
            if isinstance(v, str) and v.strip():
                d["class"] = v.strip()
                break

    # credits
    if d.get("credits") is None:
        v = d.get("credit")
        try:
            d["credits"] = int(v) if v is not None else None
        except Exception:
            pass

    # course_code 숫자 → 문자열
    cc = d.get("course_code")
    if isinstance(cc, (int, float)):
        d["course_code"] = str(int(cc))

    return d


# ------------------------------------------------------------------------------
# GET /courses
# ------------------------------------------------------------------------------

@router.get("", response_model=List[CourseOut])
async def list_courses(
    q: Optional[str] = None,
    year: Optional[int] = None,
    group: Optional[str] = Query(None),
    category: Optional[str] = None,
    major_track: Optional[str] = None,
    general_type: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    collection: Optional[str] = None,
):

    db = get_db()
    match = _build_match(q, year, group, category, major_track, general_type)

    # 특정 컬렉션만
    if collection:
        if collection not in (await db.list_collection_names()):
            return []

        col = db[collection]
        defaults = _defaults_from_collection(collection)
        docs = await _fetch_from_collection(col, defaults, match, skip, limit)
        docs = [_normalize_course_for_response(d) for d in docs]
        return [d for d in docs if d]

    # union
    docs = await _fetch_union_collections(db, match, skip, limit)
    docs.sort(key=lambda d: ((d.get("requirement_id") or ""), (d.get("course_code") or "")))

    docs = [_normalize_course_for_response(d) for d in docs]
    return [d for d in docs if d]


# ------------------------------------------------------------------------------
# GET /courses/count
# ------------------------------------------------------------------------------

@router.get("/count", response_model=int)
async def count_courses(
    q: Optional[str] = None,
    year: Optional[int] = None,
    group: Optional[str] = None,
    category: Optional[str] = None,
    major_track: Optional[str] = None,
    general_type: Optional[str] = None,
    collection: Optional[str] = None,
):

    db = get_db()
    match = _build_match(q, year, group, category, major_track, general_type)

    if collection:
        if collection not in (await db.list_collection_names()):
            return 0
        try:
            n = await db[collection].count_documents(match)
            return int(n)
        except:
            return 0

    total = 0
    colls = await get_course_collections()

    for col in colls:
        try:
            total += int(await col.count_documents(match))
        except:
            continue

    return total
