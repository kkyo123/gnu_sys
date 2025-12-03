# backend/routers/timetable.py

from typing import List, Optional, Literal

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel

from database.connection import get_db
from routers.auth import get_current_user

router = APIRouter(tags=["Timetable"])

# 프론트의 CourseTab과 맞춰서 사용 (custom/system/graduation)
CourseTab = Literal["custom", "system", "graduation"]

# 프론트의 TimetableCourseStandard와 최대한 맞춘 DTO
class TimetableItem(BaseModel):
    id: str               # enrollment 문서의 _id
    name: str             # course_name (또는 courses 컬렉션에서 가져온 이름)
    professor: Optional[str] = None
    credits: int

    day: int
    periodStart: int
    periodDuration: int
    colorClass: str

    classroom: Optional[str] = None
    sourceTab: Optional[CourseTab] = None


ACTIVE_STATUSES = ["PLANNED", "IN_PROGRESS", "COMPLETED"]  # 필요에 따라 조정 가능


@router.get(
    "/me/timetable",
    response_model=List[TimetableItem],
    summary="내 시간표 조회 (enrollments 기반)",
)
async def get_my_timetable(
    year: int = Query(..., description="학년도. 예: 2025"),
    semester: int = Query(..., description="학기. 1 또는 2"),
    tab: Optional[CourseTab] = Query(
        None,
        description="탭별 필터가 필요하면 custom/system/graduation 중 하나",
    ),
    include_completed: bool = Query(
        False,
        description="True이면 COMPLETED 상태도 포함",
    ),
    user=Depends(get_current_user),
):
    """
    enrollments 컬렉션을 기반으로, 프론트 시간표에서 바로 쓸 수 있는 형태로 변환해서 내려주는 API.
    - 필수 필터: student_id, year, semester
    - 선택 필터: tab(source_tab), include_completed(상태)
    """
    db = get_db()

    # 기본 조건: 로그인한 사용자 + 특정 학기
    q: dict = {
        "student_id": user["student_id"],
        "year": year,
        "semester": semester,
    }

    # 상태 필터 (기본: COMPLETED 제외, 필요하면 파라미터로 포함)
    if include_completed:
        q["status"] = {"$in": ACTIVE_STATUSES}
    else:
        q["status"] = {"$in": ["PLANNED", "IN_PROGRESS"]}

    # 탭 필터 (custom/system/graduation 등을 source_tab에 저장해둔 경우)
    if tab is not None:
        q["source_tab"] = tab

    # enrollments 가져오기
    enrollment_docs = await db.enrollments.find(q).to_list(length=None)

    # course_code → courses 문서 매핑 (N+1 방지용으로 미리 한 번에 조회)
    course_codes = {
        doc["course_code"]
        for doc in enrollment_docs
        if doc.get("course_code")
    }

    courses_map = {}
    if course_codes:
        cursor = db.courses.find({"course_code": {"$in": list(course_codes)}})
        course_docs = await cursor.to_list(length=None)
        courses_map = {c["course_code"]: c for c in course_docs}

    items: List[TimetableItem] = []

    for doc in enrollment_docs:
        # 시간표 필수 값이 없으면 스킵 (seed 안된 데이터 보호)
        if (
            doc.get("day") is None
            or doc.get("period_start") is None
            or doc.get("period_duration") is None
        ):
            continue

        course = courses_map.get(doc.get("course_code"), {})

        name = doc.get("course_name") or course.get("course_name") or ""
        professor = course.get("professor")
        credits = doc.get("credits") or course.get("credits") or 0

        items.append(
            TimetableItem(
                id=str(doc["_id"]),
                name=name,
                professor=professor,
                credits=int(credits),
                day=int(doc["day"]),
                periodStart=int(doc["period_start"]),
                periodDuration=int(doc["period_duration"]),
                colorClass=doc.get("color_class") or "bg-slate-300",
                classroom=doc.get("classroom"),
                sourceTab=doc.get("source_tab"),
            )
        )

    return items
