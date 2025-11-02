from fastapi import APIRouter, Query
from typing import Any, Dict, List, Optional
import re
from database.connection import get_db, get_course_collections, ensure_indexes
from pydantic import BaseModel, Field

router = APIRouter(prefix="/courses", tags=["courses"])

class CourseOut(BaseModel):
    requirement_id: Optional[str] = None
    category: Optional[str] = None
    course_name: Optional[str] = None
    course_code: Optional[str] = None
    professor: Optional[str] = None
    group: Optional[str] = None              # 전공/교양/일반선택/교직
    year: Optional[int] = None
    major_track: Optional[str] = None        # 컴퓨터과학/컴퓨터소프트웨어/빅데이터
    general_type: Optional[str] = None       # 핵심/균형/기초/일반선택·교직
    source_collection: Optional[str] = None  # 어느 컬렉션에서 왔는지
    source_sheet: Optional[str] = None
    설명란: Optional[str] = None
    비고: Optional[str] = None

# @router.on_event("startup")
# async def _startup():
#     await ensure_indexes()

def _defaults_from_collection(name: str) -> Dict[str, Any]:
    # courses_2025_major, courses_2023_major_sci, core_general ...
    d: Dict[str, Any] = {"source_collection": name}
    if name.startswith("courses_") and "_major" in name:
        # year
        m = re.search(r"courses_(\d{4})_major", name)
        if m:
            d["year"] = int(m.group(1))
        d["group"] = "전공"
        # track
        if name.endswith("_sci"):
            d["major_track"] = "컴퓨터 과학"
        elif name.endswith("_sw"):
            d["major_track"] = "컴퓨터 소프트웨어"
        elif name.endswith("_bd"):
            d["major_track"] = "빅데이터"
    elif name == "courses_NormalStudy":
        d["group"] = "일반선택/교직"
        d["general_type"] = "일반선택/교직"
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

def _inject_defaults_stage(defaults: Dict[str, Any]) -> Dict[str, Any]:
    """
    필드가 없을 때만 컬렉션명에서 유도한 기본값을 주입한다.
    year/group/major_track/general_type/source_collection 만 처리.
    """
    sets: Dict[str, Any] = {}
    for k, v in defaults.items():
        if k == "source_collection":
            # 항상 기록
            sets[k] = v
        else:
            sets[k] = {"$ifNull": [f"${k}", v]}
    return {"$set": sets}

def _build_match(q: Optional[str], year: Optional[int], group: Optional[str],
                 category: Optional[str], major_track: Optional[str],
                 general_type: Optional[str]) -> Dict[str, Any]:
    cond: Dict[str, Any] = {}
    if year is not None: cond["year"] = year
    if group: cond["group"] = group
    if category: cond["category"] = category
    if major_track: cond["major_track"] = major_track
    if general_type: cond["general_type"] = general_type
    if q:
        regex = {"$regex": q, "$options": "i"}
        cond["$or"] = [
            {"course_name": regex},
            {"professor": regex},
            {"course_code": regex},
            {"category": regex},
        ]
    return cond

@router.get("", response_model=List[CourseOut])
async def list_courses(
    q: Optional[str] = None,
    year: Optional[int] = None,
    group: Optional[str] = Query(None, description='전공/교양/일반선택/교직'),
    category: Optional[str] = None,                   # 전공필수/전공선택/핵심/균형/기초 등
    major_track: Optional[str] = None,                # 컴퓨터과학/컴퓨터소프트웨어/빅데이터
    general_type: Optional[str] = None,               # 핵심교양/균형교양/기초교양/일반선택·교직
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    collection: Optional[str] = Query(None, description="특정 컬렉션만"),
):
    db = get_db()
    match = _build_match(q, year, group, category, major_track, general_type)

    if collection:
        defaults = _defaults_from_collection(collection)
        pipeline = [
            _inject_defaults_stage(defaults),
            {"$match": match},
            {"$skip": skip},
            {"$limit": limit},
            {"$project": {"_id": 0}},
        ]
        docs = await db[collection].aggregate(pipeline).to_list(length=limit)
        return docs

    colls = await get_course_collections()
    if not colls:
        return []

    # 첫 컬렉션 파이프라인
    first = colls[0]
    pipeline: List[Dict[str, Any]] = [
        _inject_defaults_stage(_defaults_from_collection(first.name)),
        {"$match": match},
    ]
    # unionWith
    for other in colls[1:]:
        pipeline.append({
            "$unionWith": {
                "coll": other.name,
                "pipeline": [
                    _inject_defaults_stage(_defaults_from_collection(other.name)),
                    {"$match": match},
                ],
            }
        })
    pipeline += [
        {"$skip": skip},
        {"$limit": limit},
        {"$project": {"_id": 0}},
    ]
    docs = await first.aggregate(pipeline).to_list(length=limit)
    return docs

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
        pipeline = [
            _inject_defaults_stage(_defaults_from_collection(collection)),
            {"$match": match},
            {"$count": "n"},
        ]
        res = await db[collection].aggregate(pipeline).to_list(length=1)
        return int(res[0]["n"]) if res else 0

    colls = await get_course_collections()
    if not colls:
        return 0

    first = colls[0]
    pipeline: List[Dict[str, Any]] = [
        _inject_defaults_stage(_defaults_from_collection(first.name)),
        {"$match": match},
    ]
    for other in colls[1:]:
        pipeline.append({
            "$unionWith": {
                "coll": other.name,
                "pipeline": [
                    _inject_defaults_stage(_defaults_from_collection(other.name)),
                    {"$match": match},
                ],
            }
        })
    pipeline.append({"$count": "n"})
    res = await first.aggregate(pipeline).to_list(length=1)
    return int(res[0]["n"]) if res else 0

