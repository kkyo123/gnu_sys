from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Literal, Optional

from database.connection import db
from routers.auth import get_current_user

router = APIRouter(tags=["Graduation"])


# ---------------------------
# Pydantic Models
# ---------------------------

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


# 프론트에서 쓰는 RequirementKey (camelCase)
RequirementKey = Literal[
    "majorRequired",
    "majorElective",
    "coreGeneral",
    "balanceGeneral",
]


class GraduationStatusResponse(BaseModel):
    total: CategoryStatus                 # 전체 학점 요약
    categories: Dict[str, CategoryStatus] # "MAJOR", "GENERAL", "ELECTIVE" 등
    gpa: GPAStatus
    qualification: QualificationStatus
    # RequirementKey 단위 디테일
    requirement_details: Dict[RequirementKey, CategoryStatus]


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


# ---------------------------
# Helpers
# ---------------------------

async def _load_student_and_requirements(student_id: str):
    """
    학생 문서와 admission_year + major 에 해당하는 졸업요건 문서들을 불러온다.
    graduation_requirements 컬렉션의 requirement_key 를 기준으로 dict 구성.
    """
    student = await db.students.find_one({"student_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    admission_year = student.get("admission_year")
    major = student.get("major")  # 필드명 다르면 여기 수정

    if admission_year is None or major is None:
        raise HTTPException(
            status_code=400,
            detail="Student must have admission_year and major set",
        )

    requirements: Dict[str, dict] = {}

    cursor = db.graduation_requirements.find(
        {"admission_year": admission_year, "major": major}
    )
    async for r in cursor:
        key = r.get("requirement_key")
        if key:
            requirements[key] = r

    return student, requirements


def _get_required_credits(requirements: Dict[str, dict], key: str) -> int:
    """
    key 는 DB graduation_requirements.requirement_key 값
    (예: 'major_required', 'core_general')
    """
    doc = requirements.get(key)
    if not doc:
        return 0
    return int(doc.get("required_credits", 0) or 0)


def _get_required_gpa(requirements: Dict[str, dict]) -> float:
    """
    최소 평점 요건: requirement_key = 'min_gpa' 문서의 required_gpa 사용
    """
    doc = requirements.get("min_gpa")
    if not doc:
        return 0.0
    return float(doc.get("required_gpa", 0.0) or 0.0)


def _get_required_cert_counts(requirements: Dict[str, dict]):
    """
    자격인증 요건:
      - 필수:  requirement_key = 'qual_required'
      - 선택:  requirement_key = 'qual_optional'
    """
    req_doc = requirements.get("qual_required", {}) or {}
    opt_doc = requirements.get("qual_optional", {}) or {}

    req_required = int(req_doc.get("required_count", 0) or 0)
    opt_required = int(opt_doc.get("required_count", 0) or 0)
    return req_required, opt_required


def _map_course_to_requirement_key(course: dict) -> Optional[str]:
    """
    과목의 category + sub_category 를 graduation_requirements.requirement_key 로 매핑.
    DB의 sub_category 값을 기준으로 조건만 맞춰주면 됨.
    """
    cat = course.get("category")
    sub = course.get("sub_category")

    # 전공 필수/선택
    if cat == "MAJOR":
        if sub == "전공필수":
            return "major_required"
        elif sub == "전공선택":
            return "major_elective"
        # sub_category 없으면 전공선택으로 취급
        return "major_elective"

    # 교양(핵심/균형)
    if cat == "GENERAL":
        if sub in ("핵심교양", "핵심교양필수"):
            return "core_general"
        if sub in ("균형교양", "균형교양필수"):
            return "balance_general"

    return None


def _make_status(acquired: int, required: int) -> CategoryStatus:
    remaining = required - acquired
    if remaining < 0:
        remaining = 0
    passed = acquired >= required if required > 0 else True
    return CategoryStatus(
        acquired=acquired,
        required=required,
        remaining=remaining,
        is_passed=passed,
    )


# ---------------------------
# 졸업요건 현황
# ---------------------------

@router.get("/graduation/status", response_model=GraduationStatusResponse)
async def get_graduation_status(user=Depends(get_current_user)):
    # 학생 정보 + 졸업요건 문서 로드
    student, requirements = await _load_student_and_requirements(user["student_id"])

    # 이수한 과목들
    enrolls = await db.enrollments.find(
        {"student_id": user["student_id"], "status": "COMPLETED"}
    ).to_list(None)

    acquired_by_cat: Dict[str, int] = {}
    # 내부 집계용: DB requirement_key 기준
    acquired_by_key: Dict[str, int] = {
        "major_required": 0,
        "major_elective": 0,
        "core_general": 0,
        "balance_general": 0,
    }

    total_credits = 0
    total_gp = 0.0
    total_for_gpa = 0

    # 카테고리별 학점 + GPA + requirement_key별 학점 계산
    for e in enrolls:
        course = await db.courses.find_one({"course_code": e["course_code"]})
        if not course:
            continue

        cat = course.get("category", "OTHER")
        credits = int(course.get("credits", 0) or 0)

        # category 기준(전공/교양/자유선택) 집계
        if cat not in acquired_by_cat:
            acquired_by_cat[cat] = 0
        acquired_by_cat[cat] += credits

        total_credits += credits

        # GPA
        gp = e.get("grade_point")
        if gp is not None:
            total_gp += gp * credits
            total_for_gpa += credits

        # requirement_key 기준(전공필수/전선/핵심/균형) 집계
        req_key = _map_course_to_requirement_key(course)
        if req_key:
            acquired_by_key[req_key] = acquired_by_key.get(req_key, 0) + credits

    # GPA 계산
    if total_for_gpa > 0:
        current_gpa = round(total_gp / total_for_gpa, 2)
    else:
        current_gpa = 0.0

    required_gpa = _get_required_gpa(requirements)

    # 카테고리별(상위 개념: MAJOR / GENERAL / ELECTIVE) 상태
    categories: Dict[str, CategoryStatus] = {}

    # 전공: 전공필수 + 전공선택
    major_required_total = (
        _get_required_credits(requirements, "major_required")
        + _get_required_credits(requirements, "major_elective")
    )
    major_acquired_total = (
        acquired_by_key["major_required"] + acquired_by_key["major_elective"]
    )
    categories["MAJOR"] = _make_status(major_acquired_total, major_required_total)

    # 교양: 핵심 + 균형
    general_required_total = (
        _get_required_credits(requirements, "core_general")
        + _get_required_credits(requirements, "balance_general")
    )
    general_acquired_total = (
        acquired_by_key["core_general"] + acquired_by_key["balance_general"]
    )
    categories["GENERAL"] = _make_status(general_acquired_total, general_required_total)

    # 자유선택(ELECTIVE) – 필요하면 규칙 추가
    elective_required = _get_required_credits(requirements, "free_elective")
    elective_acquired = acquired_by_cat.get("ELECTIVE", 0)
    categories["ELECTIVE"] = _make_status(elective_acquired, elective_required)

    # 전체 학점
    total_required_doc = requirements.get("total_credits")
    if total_required_doc:
        total_required = int(total_required_doc.get("required_credits", 0) or 0)
    else:
        total_required = (
            major_required_total + general_required_total + elective_required
        )

    total_status = _make_status(total_credits, total_required)

    # GPA 상태
    gpa_status = GPAStatus(
        current=current_gpa,
        required=required_gpa,
        is_passed=current_gpa >= required_gpa,
    )

    # 자격인증제 현황
    cert = student.get("certifications", {}) or {}
    acquired_req = int(cert.get("required_count", 0) or 0)
    acquired_opt = int(cert.get("optional_count", 0) or 0)

    required_req, required_opt = _get_required_cert_counts(requirements)

    qualification_status = QualificationStatus(
        required_required=required_req,
        required_optional=required_opt,
        acquired_required=acquired_req,
        acquired_optional=acquired_opt,
        is_passed=(acquired_req >= required_req and acquired_opt >= required_opt),
    )

    # 프론트용 requirement_details (camelCase Key로 변환)
    requirement_details: Dict[RequirementKey, CategoryStatus] = {
        "majorRequired": _make_status(
            acquired_by_key["major_required"],
            _get_required_credits(requirements, "major_required"),
        ),
        "majorElective": _make_status(
            acquired_by_key["major_elective"],
            _get_required_credits(requirements, "major_elective"),
        ),
        "coreGeneral": _make_status(
            acquired_by_key["core_general"],
            _get_required_credits(requirements, "core_general"),
        ),
        "balanceGeneral": _make_status(
            acquired_by_key["balance_general"],
            _get_required_credits(requirements, "balance_general"),
        ),
    }

    return GraduationStatusResponse(
        total=total_status,
        categories=categories,
        gpa=gpa_status,
        qualification=qualification_status,
        requirement_details=requirement_details,
    )


# ---------------------------
# 졸업요건 기반 추천 강의
# ---------------------------

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

    # 전공/교양 부족분
    major_required_total = (
        _get_required_credits(requirements, "major_required")
        + _get_required_credits(requirements, "major_elective")
    )
    general_required_total = (
        _get_required_credits(requirements, "core_general")
        + _get_required_credits(requirements, "balance_general")
    )

    major_acquired = acquired_by_cat.get("MAJOR", 0)
    general_acquired = acquired_by_cat.get("GENERAL", 0)

    major_remaining = max(major_required_total - major_acquired, 0)
    general_remaining = max(general_required_total - general_acquired, 0)

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
        if sub_cat in ("핵심교양", "핵심교양필수") and general_remaining > 0:
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

    # 높은 점수 순 정렬 후 상위 50개
    results.sort(key=lambda x: x.score, reverse=True)
    return RecommendedCoursesResponse(courses=results[:50])
