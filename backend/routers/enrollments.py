# 수강/성적 관리
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Literal, List
from bson import ObjectId

from database.connection import get_db, now_iso
from routers.auth import get_current_user
from routers.mypage import SUMMARY_BUCKETS, bucket_category

router = APIRouter(tags=["Enrollments"])

EnrollmentStatus = Literal["PLANNED", "IN_PROGRESS", "COMPLETED"]

CATEGORY_LABEL_MAP = {key: label for key, label in SUMMARY_BUCKETS}


# ----- 모델 정의 -----

class EnrollmentBase(BaseModel):
    course_code: str
    year: int
    semester: int  # 1 or 2
    status: EnrollmentStatus = "IN_PROGRESS"
    grade: Optional[str] = None
    grade_point: Optional[float] = None
    credits: Optional[int] = None


class EnrollmentCreate(EnrollmentBase):
    pass


class EnrollmentUpdate(BaseModel):
    status: Optional[EnrollmentStatus] = None
    grade: Optional[str] = None
    grade_point: Optional[float] = None
    credits: Optional[int] = None


class EnrollmentPublic(EnrollmentBase):
    id: str
    student_id: str
    course_name: Optional[str] = None
    professor: Optional[str] = None
    timeslot: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    category: Optional[str] = None
    category_label: Optional[str] = None
    category_original: Optional[str] = None
    created_at: str
    updated_at: str

    # 🔽 시간표 관련 필드 (seed 스크립트에서 넣는 값들)
    day: Optional[int] = None
    period_start: Optional[int] = None
    period_duration: Optional[int] = None
    classroom: Optional[str] = None
    color_class: Optional[str] = None
    source_tab: Optional[str] = None


# ----- 내부 유틸 -----

def _normalize_status(raw: Optional[str]) -> EnrollmentStatus:
    if raw == "ENROLLED":
        return "IN_PROGRESS"
    if raw in ("PLANNED", "IN_PROGRESS", "COMPLETED"):
        return raw
    return "IN_PROGRESS"


def _to_public(doc: dict) -> EnrollmentPublic:
    return EnrollmentPublic(
        id=str(doc.get("_id", "")),
        student_id=str(doc.get("student_id", "")),
        course_code=str(doc.get("course_code", "")),
        year=int(doc.get("year", 0)),
        semester=int(doc.get("semester", 1)),
        status=_normalize_status(doc.get("status")),
        grade=doc.get("grade"),
        grade_point=doc.get("grade_point"),
        credits=doc.get("credits"),
        course_name=doc.get("course_name"),
        professor=doc.get("professor"),
        timeslot=doc.get("timeslot"),
        start_time=doc.get("start_time"),
        end_time=doc.get("end_time"),
        category=doc.get("category"),
        category_label=doc.get("category_label"),
        category_original=doc.get("category_original"),
        created_at=doc.get("created_at") or now_iso(),
        updated_at=doc.get("updated_at") or now_iso(),

        # 🔽 DB에 있으면 그대로 내보내고, 없으면 None
        day=doc.get("day"),
        period_start=doc.get("period_start"),
        period_duration=doc.get("period_duration"),
        classroom=doc.get("classroom"),
        color_class=doc.get("color_class"),
        source_tab=doc.get("source_tab"),
    )


async def _ensure_course_info(doc: dict, db):
    # course_name, category 보정
    course = None
    needs_course_lookup = any(
        not doc.get(field)
        for field in ("course_name", "category", "professor", "timeslot", "start_time", "end_time")
    )
    if needs_course_lookup and doc.get("course_code"):
        course = await db.courses.find_one({"course_code": doc["course_code"]})
        if course:
            if not doc.get("course_name"):
                doc["course_name"] = course.get("course_name")
            if not doc.get("category"):
                doc["category"] = course.get("category")
            if not doc.get("professor"):
                doc["professor"] = course.get("professor")
            if not doc.get("timeslot"):
                doc["timeslot"] = course.get("timeslot") or course.get("time")
            if not doc.get("start_time"):
                doc["start_time"] = course.get("start_time")
            if not doc.get("end_time"):
                doc["end_time"] = course.get("end_time")

    # 카테고리 매핑
    raw_category = doc.get("category_original") or doc.get("category")
    if raw_category:
        doc["category_original"] = raw_category

    bucket = bucket_category(doc.get("category"))
    if bucket:
        doc["category"] = bucket
        doc["category_label"] = CATEGORY_LABEL_MAP.get(bucket, bucket)
    elif doc.get("category"):
        doc["category_label"] = doc["category"]
    else:
        doc["category_label"] = None

    return doc


# ----- 내 수강/성적 목록 조회 -----

@router.get(
    "/me/enrollments",
    response_model=List[EnrollmentPublic],
    summary="내 수강/성적 목록 조회",
)
async def list_my_enrollments(
    status: Optional[EnrollmentStatus] = Query(None),
    year: Optional[int] = Query(None),
    semester: Optional[int] = Query(None),
    user=Depends(get_current_user),
):
    db = get_db()
    q: dict = {"student_id": user["student_id"]}
    if status:
        q["status"] = status
    if year:
        q["year"] = year
    if semester:
        q["semester"] = semester

    cursor = (
        db.enrollments
        .find(q)
        .sort([("year", 1), ("semester", 1), ("course_code", 1)])
    )
    docs = await cursor.to_list(length=None)
    enriched = []
    for doc in docs:
        enriched.append(_to_public(await _ensure_course_info(doc, db)))
    return enriched


# ----- 새 수강/성적 기록 추가 -----

@router.post(
    "/me/enrollments",
    response_model=EnrollmentPublic,
    summary="새 수강/성적 기록 추가",
)
async def create_enrollment(
    payload: EnrollmentCreate,
    user=Depends(get_current_user),
):
    db = get_db()
    course = await db.courses.find_one({"course_code": payload.course_code})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    credits = payload.credits if payload.credits is not None else course.get("credits", 0)
    raw_course_name = course.get("course_name")

    doc = payload.model_dump(exclude_unset=True)
    doc["student_id"] = user["student_id"]
    doc["credits"] = credits
    doc["course_name"] = raw_course_name
    doc["professor"] = course.get("professor")
    doc["timeslot"] = course.get("timeslot") or course.get("time")
    doc["start_time"] = course.get("start_time")
    doc["end_time"] = course.get("end_time")

    course_category = course.get("category")
    if course_category:
        doc["category_original"] = course_category
        bucket = bucket_category(course_category)
        doc["category"] = bucket or course_category
        if bucket:
            doc["category_label"] = CATEGORY_LABEL_MAP.get(bucket, bucket)

    now = now_iso()
    doc["created_at"] = now
    doc["updated_at"] = now

    res = await db.enrollments.insert_one(doc)
    inserted = await db.enrollments.find_one({"_id": res.inserted_id})
    return _to_public(await _ensure_course_info(inserted, db))


# ----- 수강/성적 기록 수정 -----

@router.patch(
    "/me/enrollments/{enrollment_id}",
    response_model=EnrollmentPublic,
    summary="수강/성적 기록 수정",
)
async def update_enrollment(
    enrollment_id: str,
    payload: EnrollmentUpdate,
    user=Depends(get_current_user),
):
    db = get_db()
    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No changes")

    updates["updated_at"] = now_iso()

    try:
        oid = ObjectId(enrollment_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid enrollment_id")

    res = await db.enrollments.update_one(
        {"_id": oid, "student_id": user["student_id"]},
        {"$set": updates},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    doc = await db.enrollments.find_one({"_id": oid})
    return _to_public(await _ensure_course_info(doc, db))


# ----- 수강/성적 기록 삭제 -----

@router.delete(
    "/me/enrollments/{enrollment_id}",
    response_model=dict,
    summary="수강/성적 기록 삭제",
)
async def delete_enrollment(
    enrollment_id: str,
    user=Depends(get_current_user),
):
    db = get_db()
    try:
        oid = ObjectId(enrollment_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid enrollment_id")

    res = await db.enrollments.delete_one(
        {"_id": oid, "student_id": user["student_id"]}
    )
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    return {"message": "deleted"}
