from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from database.connection import get_db
from routers.auth import get_current_user

router = APIRouter(tags=["MyPage"])

SUMMARY_BUCKETS = [
    ("MAJOR_REQUIRED", "전공필수"),
    ("MAJOR_ELECTIVE", "전공선택"),
    ("CORE_GENERAL", "핵심교양"),
    ("BALANCE_GENERAL", "균형교양"),
]
SUMMARY_KEYS = [key for key, _ in SUMMARY_BUCKETS]
SUMMARY_KEY_SET = set(SUMMARY_KEYS)

CATEGORY_BUCKETS = {
    "MAJOR": "MAJOR_REQUIRED",
    "MAJOR_REQUIRED": "MAJOR_REQUIRED",
    "MAJOR MANDATORY": "MAJOR_REQUIRED",
    "전공필수": "MAJOR_REQUIRED",
    "전공-필수": "MAJOR_REQUIRED",
    "MAJOR_ELECTIVE": "MAJOR_ELECTIVE",
    "MAJOR ELECTIVE": "MAJOR_ELECTIVE",
    "전공선택": "MAJOR_ELECTIVE",
    "전공": "MAJOR_ELECTIVE",
    "GENERAL": "CORE_GENERAL",
    "CORE_GENERAL": "CORE_GENERAL",
    "LIBERAL": "CORE_GENERAL",
    "기초교양": "CORE_GENERAL",
    "핵심교양": "CORE_GENERAL",
    "글쓰기": "CORE_GENERAL",
    "글쓰기(필수)": "CORE_GENERAL",
    "영어": "CORE_GENERAL",
    "영어(필수)": "CORE_GENERAL",
    "디지털리터러시": "CORE_GENERAL",
    "BALANCE_GENERAL": "BALANCE_GENERAL",
    "균형교양": "BALANCE_GENERAL",
    "문학과문화": "BALANCE_GENERAL",
    "역사와철학": "BALANCE_GENERAL",
    "인간과사회": "BALANCE_GENERAL",
    "생명과환경": "BALANCE_GENERAL",
    "과학과기술": "BALANCE_GENERAL",
    "예술과체육": "BALANCE_GENERAL",
    "진로와개척": "BALANCE_GENERAL",
    "융복합": "BALANCE_GENERAL",
}


def bucket_category(raw: Optional[str]) -> Optional[str]:
    if not raw:
        return None
    normalized = raw.strip()
    if not normalized:
        return None
    normalized_key = normalized.upper().replace(" ", "_")
    if normalized_key in SUMMARY_KEY_SET:
        return normalized_key
    mapped = CATEGORY_BUCKETS.get(normalized) or CATEGORY_BUCKETS.get(normalized_key)
    if not mapped:
        return None
    mapped_key = mapped.upper().replace(" ", "_")
    if mapped_key in SUMMARY_KEY_SET:
        return mapped_key
    return None


class CreditSummaryItem(BaseModel):
    acquired: int
    required: int


class RadarItem(BaseModel):
    label: str
    rate: float


class CreditSummaryResponse(BaseModel):
    total: CreditSummaryItem
    major_required: CreditSummaryItem
    major_elective: CreditSummaryItem
    core_general: CreditSummaryItem
    balance_general: CreditSummaryItem
    radar: List[RadarItem]


def build_empty_summary() -> CreditSummaryResponse:
    zero_total = CreditSummaryItem(acquired=0, required=0)
    zeros = {key: CreditSummaryItem(acquired=0, required=0) for key in SUMMARY_KEYS}
    radar_items = [RadarItem(label=label, rate=0.0) for _, label in SUMMARY_BUCKETS]
    return CreditSummaryResponse(
        total=zero_total,
        major_required=zeros["MAJOR_REQUIRED"],
        major_elective=zeros["MAJOR_ELECTIVE"],
        core_general=zeros["CORE_GENERAL"],
        balance_general=zeros["BALANCE_GENERAL"],
        radar=radar_items,
    )


@router.get("/credit-summary", response_model=CreditSummaryResponse)
async def get_credit_summary(user=Depends(get_current_user)):
    db = get_db()

    student = await db.students.find_one({"student_id": user["student_id"]})
    if not student:
        return build_empty_summary()

    version = student.get("requirement_version")
    if not version:
        return build_empty_summary()

    required_map = {key: 0 for key in SUMMARY_KEYS}
    total_required_override = 0
    cursor = db.requirements.find({"requirement_version": version})
    async for r in cursor:
        bucket = bucket_category(r.get("category"))
        required_value = int(r.get("required_credits", 0))
        if bucket and bucket in required_map:
            required_map[bucket] = required_value
        else:
            raw = (r.get("category") or "").strip().upper().replace(" ", "_")
            if raw == "TOTAL":
                total_required_override = required_value

    enrollments = await db.enrollments.find(
        {"student_id": user["student_id"], "status": "COMPLETED"}
    ).to_list(None)
    acquired = {key: 0 for key in SUMMARY_KEYS}
    for enroll in enrollments:
        credits = int(enroll.get("credits") or 0)
        bucket = bucket_category(enroll.get("category"))
        if (not credits or not bucket) and enroll.get("course_code"):
            course = await db.courses.find_one({"course_code": enroll["course_code"]})
            if course:
                if not credits:
                    credits = int(course.get("credits", 0))
                if not bucket:
                    bucket = bucket_category(course.get("category"))
        if bucket in acquired and credits:
            acquired[bucket] += credits

    total_required = total_required_override or sum(required_map.values())
    total_acquired = sum(acquired.values())

    radar: List[RadarItem] = []
    for key, label in SUMMARY_BUCKETS:
        req_value = required_map[key]
        acc_value = acquired[key]
        rate = float(acc_value / req_value) if req_value > 0 else 0.0
        radar.append(RadarItem(label=label, rate=rate))

    def make_item(key: str) -> CreditSummaryItem:
        return CreditSummaryItem(acquired=acquired[key], required=required_map[key])

    return CreditSummaryResponse(
        total=CreditSummaryItem(acquired=total_acquired, required=total_required),
        major_required=make_item("MAJOR_REQUIRED"),
        major_elective=make_item("MAJOR_ELECTIVE"),
        core_general=make_item("CORE_GENERAL"),
        balance_general=make_item("BALANCE_GENERAL"),
        radar=radar,
    )


class RequiredCourseItem(BaseModel):
    course_code: str
    name: str
    is_completed: bool


class RequiredCoursesResponse(BaseModel):
    required_courses: List[RequiredCourseItem]


@router.get("/required-courses", response_model=RequiredCoursesResponse)
async def get_required_courses(user=Depends(get_current_user)):
    db = get_db()
    cursor = db.courses.find({"is_required": True})
    required_courses = [doc async for doc in cursor]

    completed_cursor = db.enrollments.find(
        {"student_id": user["student_id"], "status": "COMPLETED"},
        projection={"course_code": 1, "_id": 0},
    )
    completed_codes = {doc["course_code"] async for doc in completed_cursor}

    items = [
        RequiredCourseItem(
            course_code=course["course_code"],
            name=course.get("name") or course.get("course_name", ""),
            is_completed=course["course_code"] in completed_codes,
        )
        for course in required_courses
    ]
    return RequiredCoursesResponse(required_courses=items)


class SemesterGPAItem(BaseModel):
    year: int
    semester: int
    gpa: float
    credits: int


class SemesterGPAResponse(BaseModel):
    semesters: List[SemesterGPAItem]


@router.get("/semester-gpa", response_model=SemesterGPAResponse)
async def get_semester_gpa(user=Depends(get_current_user)):
    db = get_db()
    pipeline = [
        {
            "$match": {
                "student_id": user["student_id"],
                "status": "COMPLETED",
                "grade_point": {"$ne": None},
            }
        },
        {
            "$group": {
                "_id": {"year": "$year", "semester": "$semester"},
                "total_gp": {"$sum": {"$multiply": ["$grade_point", "$credits"]}},
                "total_credits": {"$sum": "$credits"},
            }
        },
        {"$sort": {"_id.year": 1, "_id.semester": 1}},
    ]

    data = await db.enrollments.aggregate(pipeline).to_list(None)
    semesters: List[SemesterGPAItem] = []
    for entry in data:
        year = entry["_id"]["year"]
        semester = entry["_id"]["semester"]
        total_credits = entry["total_credits"] or 0
        gpa = (entry["total_gp"] / total_credits) if total_credits > 0 else 0.0
        semesters.append(
            SemesterGPAItem(
                year=year,
                semester=semester,
                gpa=round(gpa, 2),
                credits=total_credits,
            )
        )

    return SemesterGPAResponse(semesters=semesters)


@router.get("/keywords", response_model=List[str])
async def get_keywords(user=Depends(get_current_user)):
    db = get_db()
    student = await db.students.find_one({"student_id": user["student_id"]})
    if not student:
        return []
    return student.get("keywords", [])


class KeywordAdd(BaseModel):
    keyword: str


@router.post("/keywords", response_model=dict)
async def add_keyword(payload: KeywordAdd, user=Depends(get_current_user)):
    db = get_db()
    keyword = payload.keyword.strip()
    if not keyword:
        raise HTTPException(status_code=400, detail="Keyword is required")
    await db.students.update_one(
        {"student_id": user["student_id"]},
        {"$addToSet": {"keywords": keyword}},
    )
    return {"message": "added"}


@router.delete("/keywords/{keyword}", response_model=dict)
async def delete_keyword(keyword: str, user=Depends(get_current_user)):
    db = get_db()
    await db.students.update_one(
        {"student_id": user["student_id"]},
        {"$pull": {"keywords": keyword}},
    )
    return {"message": "removed"}
