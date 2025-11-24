from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Literal, Optional

from database.connection import db
from routers.auth import get_current_user

router = APIRouter(tags=["Graduation"])


class CategoryStatus(BaseModel):
    acquired: int        # 이미 이수한 학점
    required: int        # 졸업요건 학점
    remaining: int       # 남은 학점 (0 이하로 내려가지 않게 처리)
    is_passed: bool      # 해당 카테고리 요건 충족 여부


class GPAStatus(BaseModel):
    current: float       # 현재 평점
    required: float      # 요구 평점
    is_passed: bool      # 평점 요건 충족 여부


class QualificationStatus(BaseModel):
    required_required: int    # 필수 인증 요건 (예: 2회)
    required_optional: int    # 선택 인증 요건 (예: 1회)
    acquired_required: int    # 내가 수행한 필수 인증 횟수
    acquired_optional: int    # 내가 수행한 선택 인증 횟수
    is_passed: bool           # 둘 다 기준 이상인지


class GraduationStatusResponse(BaseModel):
    total: CategoryStatus                 # 전체 학점 요약
    categories: Dict[str, CategoryStatus] # "MAJOR", "GENERAL", "ELECTIVE" 등
    gpa: GPAStatus
    qualification: QualificationStatus


class RecommendedCourse(BaseModel):
    course_code: str
    name: str
    professor: Optional[str] = None
    category: Optional[str] = None       # 전공/교양
    sub_category: Optional[str] = None   # 전공필수 / 핵심교양필수 등
    credits: int
    schedule: Optional[List[dict]] = None
    score: float                         # 졸업요건 기여 점수
    group: Literal["MUST", "HIGH", "EXPLORE"]


class RecommendedCoursesResponse(BaseModel):
    courses: List[RecommendedCourse]


async def _load_student_and_requirements(student_id: str):
    """학생 문서와 requirement_version에 해당하는 졸업요건 문서들을 불러온다."""
    student = await db.students.find_one({"student_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    version = student.get("requirement_version")
    if not version:
        raise HTTPException(status_code=400, detail="requirement_version not set")

    requirements: Dict[str, dict] = {}
    async for r in db.requirements.find({"requirement_version": version}):
        cat = r.get("category")
        if cat:
            requirements[cat] = r

    return student, requirements


def _get_required_credits(requirements: Dict[str, dict], category: str) -> int:
    doc = requirements.get(category)
    if not doc:
        return 0
    # 학점 요건이 없는 카테고리(MIN_GPA 등)는 0으로 처리
    return int(doc.get("required_credits", 0) or 0)


# 졸업요건 현황

@router.get("/graduation/status", response_model=GraduationStatusResponse)
async def get_graduation_status(user=Depends(get_current_user)):
    # 학생 정보 + 졸업요건 문서 로드
    student, requirements = await _load_student_and_requirements(user["student_id"])

    # 이수한 과목들
    enrolls = await db.enrollments.find(
        {"student_id": user["student_id"], "status": "COMPLETED"}
    ).to_list(None)

    acquired_by_cat: Dict[str, int] = {}
    total_credits = 0
    total_gp = 0.0
    total_for_gpa = 0

    # 카테고리별 학점 + GPA 계산
    for e in enrolls:
        course = await db.courses.find_one({"course_code": e["course_code"]})
        if not course:
            continue

        cat = course.get("category", "OTHER")
        credits = int(course.get("credits", 0))

        if cat not in acquired_by_cat:
            acquired_by_cat[cat] = 0
        acquired_by_cat[cat] += credits

        total_credits += credits

        gp = e.get("grade_point")
        if gp is not None:
            total_gp += gp * credits
            total_for_gpa += credits

    # GPA
    if total_for_gpa > 0:
        current_gpa = round(total_gp / total_for_gpa, 2)
    else:
        current_gpa = 0.0
    required_gpa = float(requirements.get("MIN_GPA", {}).get("required_gpa", 0.0) or 0.0)

    # 카테고리별 상태
    def make_status(cat: str) -> CategoryStatus:
        required = _get_required_credits(requirements, cat)
        acquired = acquired_by_cat.get(cat, 0)
        remaining = required - acquired
        if remaining < 0:
            remaining = 0
        if required > 0:
            passed = acquired >= required
        else:
            passed = True
        return CategoryStatus(
            acquired=acquired,
            required=required,
            remaining=remaining,
            is_passed=passed,
        )

    categories: Dict[str, CategoryStatus] = {
        "MAJOR": make_status("MAJOR"),
        "GENERAL": make_status("GENERAL"),
        "ELECTIVE": make_status("ELECTIVE"),
    }

    # 전체 학점 요건
    if "TOTAL" in requirements:
        total_required = _get_required_credits(requirements, "TOTAL")
    else:
        total_required = 0
        for c in categories.values():
            total_required += c.required

    total_remaining = total_required - total_credits
    if total_remaining < 0:
        total_remaining = 0

    total_status = CategoryStatus(
        acquired=total_credits,
        required=total_required,
        remaining=total_remaining,
        is_passed=(total_credits >= total_required) if total_required > 0 else True,
    )

    gpa_status = GPAStatus(
        current=current_gpa,
        required=required_gpa,
        is_passed=current_gpa >= required_gpa,
    )

    # 자격인증제 현황
    cert = student.get("certifications", {}) or {}
    acquired_req = int(cert.get("required_count", 0) or 0)
    acquired_opt = int(cert.get("optional_count", 0) or 0)

    qual_req_doc = requirements.get("QUAL_REQUIRED", {}) or {}
    qual_opt_doc = requirements.get("QUAL_OPTIONAL", {}) or {}

    required_req = int(qual_req_doc.get("required_credits", 0) or 0)   # 필수 인증 요건
    required_opt = int(qual_opt_doc.get("required_credits", 0) or 0)   # 선택 인증 요건

    qualification_status = QualificationStatus(
        required_required=required_req,
        required_optional=required_opt,
        acquired_required=acquired_req,
        acquired_optional=acquired_opt,
        is_passed=(acquired_req >= required_req and acquired_opt >= required_opt),
    )

    return GraduationStatusResponse(
        total=total_status,
        categories=categories,
        gpa=gpa_status,
        qualification=qualification_status,
    )


# 졸업요건 기반 추천 강의 로직

@router.get(
    "/graduation/recommended-courses",
    response_model=RecommendedCoursesResponse,
    summary="졸업요건 기반 수강신청 추천 과목 목록",
)
async def get_recommended_courses(user=Depends(get_current_user)):
    # 학생 + 졸업요건 정보
    student, requirements = await _load_student_and_requirements(user["student_id"])

    # 이미 수강 완료한 과목 목록 + 카테고리별 이수 학점
    enrolls = await db.enrollments.find(
        {"student_id": user["student_id"], "status": "COMPLETED"}
    ).to_list(None)

    acquired_by_cat: Dict[str, int] = {}
    taken_codes: set[str] = set()

    for e in enrolls:
        code = e.get("course_code")
        if code:
            taken_codes.add(code)

        course = await db.courses.find_one({"course_code": e.get("course_code")})
        if not course:
            continue

        cat = course.get("category", "OTHER")
        credits = int(course.get("credits", 0))

        if cat not in acquired_by_cat:
            acquired_by_cat[cat] = 0
        acquired_by_cat[cat] += credits

    major_required = _get_required_credits(requirements, "MAJOR")
    general_required = _get_required_credits(requirements, "GENERAL")

    major_acquired = acquired_by_cat.get("MAJOR", 0)
    general_acquired = acquired_by_cat.get("GENERAL", 0)

    major_remaining = max(major_required - major_acquired, 0)
    general_remaining = max(general_required - general_acquired, 0)

    # 전체 과목 중 아직 안 들은 과목들
    courses_cur = db.courses.find({})
    all_courses = await courses_cur.to_list(None)

    results: List[RecommendedCourse] = []

    for c in all_courses:
        code = c.get("course_code")
        if not code:
            continue

        # 이미 들은 과목은 추천에서 제외
        if code in taken_codes:
            continue

        cat = c.get("category", "")
        sub_cat = c.get("sub_category", "")
        credits = int(c.get("credits", 0))
        schedule = c.get("schedule")

        score = 0.0

        # 전공필수/핵심교양필수 등 "Must" 후보
        if sub_cat == "전공필수" and major_remaining > 0:
            score += 4.0
        if sub_cat == "핵심교양필수" and general_remaining > 0:
            score += 3.5

        # 전공/교양 부족분에 따른 가점
        if cat == "MAJOR" and major_remaining > 0:
            score += 2.0
        if cat == "GENERAL" and general_remaining > 0:
            score += 1.5

        # 이미 해당 영역을 충분히 채웠으면 감점
        if cat == "MAJOR" and major_remaining == 0:
            score -= 1.5
        if cat == "GENERAL" and general_remaining == 0:
            score -= 1.0

        # 점수가 너무 낮으면 추천에서 제외
        if score <= 0:
            continue

        # 점수에 따른 그룹 분류
        if score >= 5.0:
            group: Literal["MUST", "HIGH", "EXPLORE"] = "MUST"
        elif score >= 3.0:
            group = "HIGH"
        else:
            group = "EXPLORE"

        rec = RecommendedCourse(
            course_code=code,
            name=c.get("name", ""),
            professor=c.get("professor"),
            category=cat,
            sub_category=sub_cat,
            credits=credits,
            schedule=schedule,
            score=round(score, 2),
            group=group,
        )
        results.append(rec)

    # 높은 점수 순으로 정렬
    results.sort(key=lambda x: x.score, reverse=True)

    # 많으면 앞쪽 일부만
    return RecommendedCoursesResponse(courses=results[:50])
