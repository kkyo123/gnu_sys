from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from database.connection import get_db
from routers.auth import get_current_user

router = APIRouter(tags=["MyPage"])



# 1. 학점 요약 + 레이더 차트


class CreditSummaryItem(BaseModel):
    acquired: int
    required: int


class RadarItem(BaseModel):
    label: str     # 예: 전공 / 교양 / 선택
    rate: float    # 0.0 ~ 1.0


class CreditSummaryResponse(BaseModel):
    total: CreditSummaryItem
    major: CreditSummaryItem
    general: CreditSummaryItem
    elective: CreditSummaryItem
    radar: List[RadarItem]

@router.get("/credit-summary", response_model=CreditSummaryResponse)
async def get_credit_summary(user=Depends(get_current_user)):
    db = get_db()

    # 1) 학생 정보 조회
    student = await db.students.find_one({"student_id": user["student_id"]})
    if not student:
        # 학생 문서가 아직 없으면 0으로 채운 기본 응답 반환
        zero_item = CreditSummaryItem(acquired=0, required=0)
        radar = [
            RadarItem(label="전공",   rate=0.0),
            RadarItem(label="교양",   rate=0.0),
            RadarItem(label="선택",   rate=0.0),
        ]
        return CreditSummaryResponse(
            total=zero_item,
            major=zero_item,
            general=zero_item,
            elective=zero_item,
            radar=radar,
        )

    version = student.get("requirement_version")
    if not version:
        # requirement_version 이 없을 때도 0으로 응답 (원하면 여기도 에러로 바꿀 수 있음)
        zero_item = CreditSummaryItem(acquired=0, required=0)
        radar = [
            RadarItem(label="전공",   rate=0.0),
            RadarItem(label="교양",   rate=0.0),
            RadarItem(label="선택",   rate=0.0),
        ]
        return CreditSummaryResponse(
            total=zero_item,
            major=zero_item,
            general=zero_item,
            elective=zero_item,
            radar=radar,
        )

    # 2) 졸업요건 로드
    reqs: Dict[str, dict] = {}
    cursor = db.requirements.find({"requirement_version": version})
    async for r in cursor:
        reqs[r["category"]] = r

    # 3) 이수 과목 집계
    enrolls = await db.enrollments.find(
        {"student_id": user["student_id"], "status": "COMPLETED"}
    ).to_list(None)

    acquired = {"MAJOR": 0, "GENERAL": 0, "ELECTIVE": 0}

    for e in enrolls:
        course = await db.courses.find_one({"course_code": e["course_code"]})
        if not course:
            continue

        cat = course.get("category", "")
        credits = int(course.get("credits", 0))

        if cat in acquired:
            acquired[cat] += credits

    def req(cat: str) -> int:
        d = reqs.get(cat)
        if not d:
            return 0
        return int(d.get("required_credits", 0))

    total_req = req("TOTAL") or req("MAJOR") + req("GENERAL") + req("ELECTIVE")
    total_acc = acquired["MAJOR"] + acquired["GENERAL"] + acquired["ELECTIVE"]

    radar: List[RadarItem] = []
    for cat, label in [("MAJOR", "전공"), ("GENERAL", "교양"), ("ELECTIVE", "선택")]:
        r = req(cat)
        a = acquired[cat]
        rate = float(a / r) if r > 0 else 0.0
        radar.append(RadarItem(label=label, rate=rate))

    return CreditSummaryResponse(
        total=CreditSummaryItem(acquired=total_acc, required=total_req),
        major=CreditSummaryItem(acquired=acquired["MAJOR"], required=req("MAJOR")),
        general=CreditSummaryItem(acquired=acquired["GENERAL"], required=req("GENERAL")),
        elective=CreditSummaryItem(acquired=acquired["ELECTIVE"], required=req("ELECTIVE")),
        radar=radar,
    )


# 2. 전공 필수 과목 체크리스트

class RequiredCourseItem(BaseModel):
    course_code: str
    name: str
    is_completed: bool


class RequiredCoursesResponse(BaseModel):
    required_courses: List[RequiredCourseItem]


@router.get("/required-courses", response_model=RequiredCoursesResponse)
async def get_required_courses(user=Depends(get_current_user)):
    db = get_db()
    # 전공필수 = courses.is_required == True
    cursor = db.courses.find({"is_required": True})
    required = [c async for c in cursor]

    completed = db.enrollments.find(
        {"student_id": user["student_id"], "status": "COMPLETED"},
        projection={"course_code": 1, "_id": 0}
    )
    completed_codes = {e["course_code"] async for e in completed}

    items = []
    for c in required:
        items.append(
            RequiredCourseItem(
                course_code=c["course_code"],
                name=c["name"],
                is_completed=c["course_code"] in completed_codes
            )
        )

    return RequiredCoursesResponse(required_courses=items)


# 3. 학기별 평균 평점

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

    semesters = []
    for d in data:
        y = d["_id"]["year"]
        s = d["_id"]["semester"]
        total_c = d["total_credits"] or 0
        gpa = (d["total_gp"] / total_c) if total_c > 0 else 0.0

        semesters.append(
            SemesterGPAItem(
                year=y,
                semester=s,
                gpa=round(gpa, 2),
                credits=total_c
            )
        )

    return SemesterGPAResponse(semesters=semesters)


# 4. 선호 키워드 관리

@router.get("/keywords", response_model=List[str])
async def get_keywords(user=Depends(get_current_user)):
    db = get_db()
    stu = await db.students.find_one({"student_id": user["student_id"]})
    return stu.get("keywords", [])


class KeywordAdd(BaseModel):
    keyword: str


@router.post("/keywords", response_model=dict)
async def add_keyword(payload: KeywordAdd, user=Depends(get_current_user)):
    db = get_db()
    kw = payload.keyword.strip()

    await db.students.update_one(
        {"student_id": user["student_id"]},
        {"$addToSet": {"keywords": kw}}
    )
    return {"message": "added"}


@router.delete("/keywords/{keyword}", response_model=dict)
async def delete_keyword(keyword: str, user=Depends(get_current_user)):
    db = get_db()
    await db.students.update_one(
        {"student_id": user["student_id"]},
        {"$pull": {"keywords": keyword}}
    )
    return {"message": "removed"}
