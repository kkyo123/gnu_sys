# backend/scripts/seed_enrollments.py

import argparse
import asyncio
import os
import random
import re
from typing import List, Dict, Any, Tuple, Optional

from motor.motor_asyncio import AsyncIOMotorClient

# 여러 강의 컬렉션 이름들
COURSE_COLLECTIONS = os.getenv(
    "COURSE_COLLECTIONS",
    "courses_2025_major,"
    "courses_2024_major,"
    "courses_2023_major_sci,"
    "courses_2023_major_sw,"
    "courses_2022_major_sci,"
    "courses_2022_major_sw,"
    "courses_2021_major_sci,"
    "courses_2021_major_sw,"
    "courses_2021_major_bd,"
    "courses_NormalStudy,"
    "core_general,"
    "balance_general,"
    "basic_general,"
    "courses_Major2025"
).split(",")

# 요일 매핑 (시간표용)
DAY_MAPPING = {
    "월": 0,
    "화": 1,
    "수": 2,
    "목": 3,
    "금": 4,
    "토": 5,
    "일": 6,
}

# 시간표 색상 후보
COLOR_CLASSES = [
    "bg-rose-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-sky-500",
]


async def fetch_courses(db) -> List[Dict[str, Any]]:
    """
    여러 개의 강의 컬렉션에서 강의들을 모두 모아 하나의 리스트로 반환.
    시간표용이라 day/period/classroom 까지 projection에 포함.
    """
    all_courses: List[Dict[str, Any]] = []

    projection = {
        "_id": 1,
        "course_code": 1,
        "course_name": 1,
        "name": 1,
        "credits": 1,
        "category": 1,
        "day": 1,        # "월", "화", "수", "목", "금" 등
        "period": 1,     # "1,2,3" 또는 3 같은 값
        "classroom": 1,
    }

    for col_name in COURSE_COLLECTIONS:
        col_name = col_name.strip()
        if not col_name:
            continue

        collection = db[col_name]
        cursor = collection.find({}, projection)

        async for course in cursor:
            course["_source_collection"] = col_name
            all_courses.append(course)

    return all_courses


def parse_day(day_str: Optional[str]) -> int:
    """
    "월", "화", "수", "목", "금", "토", "일" → 0~6 으로 변환.
    값이 없거나 매핑 안 되면 0(월)로.
    """
    if not day_str:
        return 0
    return DAY_MAPPING.get(day_str.strip(), 0)


def parse_period(period_raw: Any) -> Tuple[int, int]:
    """
    period 값이
    - "1,2,3"
    - "1-3"
    - 3 (int)
    - 기타 섞여 들어와도 최대한 안전하게 파싱.

    반환: (period_start, period_duration)
    예) "1,2,3" → (1, 3)
        3       → (3, 1)
    """
    # 값이 없으면 기본 1교시 1시간
    if period_raw is None:
        return 1, 1

    # 이미 int 인 경우
    if isinstance(period_raw, int):
        return period_raw, 1

    # 리스트나 튜플로 들어오면 숫자 뽑아서 처리
    if isinstance(period_raw, (list, tuple)):
        nums = []
        for x in period_raw:
            try:
                nums.append(int(x))
            except (TypeError, ValueError):
                continue
        if not nums:
            return 1, 1
        nums = sorted(set(nums))
        period_start = nums[0]
        period_duration = len(nums)
        return period_start, period_duration

    # 나머지는 문자열 취급
    s = str(period_raw)
    # "1,2,3", "1-3" 등에서 숫자만 추출
    tokens = re.findall(r"\d+", s)
    if not tokens:
        return 1, 1

    nums = sorted({int(t) for t in tokens})
    period_start = nums[0]
    period_duration = len(nums)

    return period_start, period_duration


def build_enrollment(student_id: str, course: Dict[str, Any]) -> Dict[str, Any]:
    """
    이수 기록 + 시간표 정보를 동시에 담는 enrollment 문서 생성.
    (기존 스키마 유지하면서 timetable 필드만 추가)
    """
    status = random.choices(["COMPLETED", "ENROLLED"], weights=[1, 0])[0]

    try:
        credits = int(course.get("credits", 0.5))
    except (ValueError, TypeError):
        credits = 0.5

    course_name = course.get("name") or course.get("course_name") or "Unknown Course"

    year = random.randint(2022, 2024)
    semester_int = random.choice([1, 2])

    # 시간표 정보 파싱
    day_idx = parse_day(course.get("day"))
    period_start, period_duration = parse_period(course.get("period"))
    color_class = random.choice(COLOR_CLASSES)

    doc: Dict[str, Any] = {
        # 기존 필드 (이수/성적용)
        "student_id": student_id,
        "course_code": course["course_code"],
        "course_name": course_name,
        "year": year,
        "semester": semester_int,
        "status": status,
        "credits": credits,
        "category": course.get("category"),

        # 문자열 학기 키 (예: "2023-2")
        "semester_key": f"{year}-{semester_int}",

        # 프론트용 user_id
        "user_id": student_id,

        # 시간표 관련 필드
        "day": day_idx,                     # 0~6
        "period_start": period_start,       # 시작 교시
        "period_duration": period_duration, # 몇 교시 길이인지
        "classroom": course.get("classroom"),
        "color_class": color_class,
        "source_tab": "custom",             # 더미 데이터: 기본은 custom
    }

    if status == "COMPLETED":
        doc["grade_point"] = random.choice([4.5, 4.0, 3.5, 3.0, 2.5, 2.0])

    return doc


async def seed(student_id: str, count: int, mongo_uri: str, db_name: str):
    client = AsyncIOMotorClient(mongo_uri)
    db = client[db_name]

    courses = await fetch_courses(db)
    if not courses:
        raise RuntimeError("All course collections are empty – nothing to seed from")

    available = len(courses)
    if count > available:
        print(f"Requested {count} records but only {available} courses exist. Using {available}.")
        count = available

    selected_courses = random.sample(courses, count)
    docs = [build_enrollment(student_id, course) for course in selected_courses]

    result = await db.enrollments.insert_many(docs)
    print(f"Inserted {len(result.inserted_ids)} enrollment docs for student {student_id}")

    client.close()


def main():
    parser = argparse.ArgumentParser(
        description="Seed sample enrollments (grade + timetable) based on existing course collections."
    )
    parser.add_argument("student_id", help="Target student_id to seed enrollments for")
    parser.add_argument(
        "-n", "--count",
        type=int,
        default=10,
        help="Number of enrollments to create"
    )
    parser.add_argument(
        "--mongo-uri",
        default=os.getenv("MONGODB_URI", "mongodb://localhost:27017"),
        help="Mongo connection string",
    )
    parser.add_argument(
        "--db",
        default=os.getenv("MONGODB_DB", "unicourse"),
        help="Database name",
    )
    args = parser.parse_args()
    asyncio.run(seed(args.student_id, args.count, args.mongo_uri, args.db))


if __name__ == "__main__":
    main()
