from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

from database.connection import db
from routers.auth import get_current_user

router = APIRouter(tags=["Dashboard"])


class DashboardCourseItem(BaseModel):
    course_code: str
    name: str
    credits: int
    status: str


class TimetableItem(BaseModel):
    start: str
    end: str
    name: str
    room: Optional[str] = None


class DashboardResponse(BaseModel):
    semester: str        # "2025-2" 이런 식
    gpa_current: float   # 이번 학기 평점 (성적 나온 것만)
    gpa_max: float = 4.5
    registered_credits: int
    in_progress_credits: int
    current_courses: List[DashboardCourseItem]
    timetable: Dict[str, List[TimetableItem]]  # {"MON": [...], "TUE": [...]}


def _current_year_semester() -> tuple[int, int]:
    now = datetime.now()
    year = now.year
    semester = 1 if now.month <= 7 else 2
    return year, semester


@router.get(
    "/dashboard",
    response_model=DashboardResponse,
    summary="대시보드용 이번 학기 요약 조회",
)
async def get_dashboard(user=Depends(get_current_user)):
    year, semester = _current_year_semester()

    # 이번 학기 수강내역 + 과목 join
    pipeline = [
        {
            "$match": {
                "student_id": user["student_id"],
                "year": year,
                "semester": semester,
            }
        },
        {
            "$lookup": {
                "from": "courses",
                "localField": "course_code",
                "foreignField": "course_code",
                "as": "course",
            }
        },
        {"$unwind": "$course"},
    ]
    docs = await db.enrollments.aggregate(pipeline).to_list(length=None)

    registered_credits = 0
    in_progress_credits = 0
    current_courses: List[DashboardCourseItem] = []
    timetable: Dict[str, List[TimetableItem]] = {
        "MON": [],
        "TUE": [],
        "WED": [],
        "THU": [],
        "FRI": [],
    }

    # 이번 학기 평점 계산용
    total_gp = 0.0
    total_credits_gpa = 0

    for e in docs:
        status = e.get("status", "IN_PROGRESS")
        credits = e.get("credits") or e["course"].get("credits", 0)
        course = e["course"]

        if status in ("IN_PROGRESS", "PLANNED"):
            registered_credits += credits
        if status == "IN_PROGRESS":
            in_progress_credits += credits

        current_courses.append(
            DashboardCourseItem(
                course_code=course["course_code"],
                name=course["name"],
                credits=credits,
                status=status,
            )
        )

        # 시간표
        for s in course.get("schedule", []) or []:
            day = s.get("day")
            if day not in timetable:
                continue
            timetable[day].append(
                TimetableItem(
                    start=s.get("start", ""),
                    end=s.get("end", ""),
                    name=course["name"],
                    room=s.get("room"),
                )
            )

        # 이번 학기 평점 (성적 나온 과목만)
        gp = e.get("grade_point")
        if status == "COMPLETED" and gp is not None:
            total_gp += gp * credits
            total_credits_gpa += credits

    gpa_current = float(total_gp / total_credits_gpa) if total_credits_gpa > 0 else 0.0

    return DashboardResponse(
        semester=f"{year}-{semester}",
        gpa_current=round(gpa_current, 2),
        registered_credits=registered_credits,
        in_progress_credits=in_progress_credits,
        current_courses=current_courses,
        timetable=timetable,
    )
