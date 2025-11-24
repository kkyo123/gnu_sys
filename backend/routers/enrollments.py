#수강/성적 관리
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Literal, List
from bson import ObjectId

from database.connection import db, now_iso
from routers.auth import get_current_user

router = APIRouter(tags=["Enrollments"])

EnrollmentStatus = Literal["PLANNED", "IN_PROGRESS", "COMPLETED"]


class EnrollmentBase(BaseModel):
    course_code: str
    year: int
    semester: int            # 1 or 2
    status: EnrollmentStatus = "IN_PROGRESS"
    grade: Optional[str] = None
    grade_point: Optional[float] = None
    credits: Optional[int] = None  # 안 주면 course에서 가져옴


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
    created_at: str
    updated_at: str


def _to_public(doc: dict) -> EnrollmentPublic:
    doc = doc.copy()
    doc["id"] = str(doc.pop("_id"))
    return EnrollmentPublic(**doc)


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
    return [_to_public(d) for d in docs]


@router.post(
    "/me/enrollments",
    response_model=EnrollmentPublic,
    summary="새 수강/성적 기록 추가",
)
async def create_enrollment(
    payload: EnrollmentCreate,
    user=Depends(get_current_user),
):
    # 과목 존재 여부 확인
    course = await db.courses.find_one({"course_code": payload.course_code})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    credits = payload.credits if payload.credits is not None else course.get("credits", 0)

    doc = payload.model_dump(exclude_unset=True)
    doc["student_id"] = user["student_id"]
    doc["credits"] = credits
    now = now_iso()
    doc["created_at"] = now
    doc["updated_at"] = now

    res = await db.enrollments.insert_one(doc)
    inserted = await db.enrollments.find_one({"_id": res.inserted_id})
    return _to_public(inserted)


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
    return _to_public(doc)


@router.delete(
    "/me/enrollments/{enrollment_id}",
    response_model=dict,
    summary="수강/성적 기록 삭제",
)
async def delete_enrollment(
    enrollment_id: str,
    user=Depends(get_current_user),
):
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
