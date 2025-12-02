# backend/scripts/seed_enrollments.py
import argparse
import asyncio
import os
import random
from typing import List, Dict, Any

from motor.motor_asyncio import AsyncIOMotorClient

# 여러 강의 컬렉션 이름들
# 기본값은 네가 알려준 목록으로 설정해두고,
# 필요하면 환경변수 COURSE_COLLECTIONS 로 덮어쓸 수 있게 해둠.
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


async def fetch_courses(db) -> List[Dict[str, Any]]:
    """
    여러 개의 강의 컬렉션에서 강의들을 모두 모아 하나의 리스트로 반환.
    """
    all_courses: List[Dict[str, Any]] = []

    projection = {
        "_id": 0,
        "course_code": 1,
        "name": 1,
        "credits": 1,
        "category": 1,
    }

    for col_name in COURSE_COLLECTIONS:
        col_name = col_name.strip()
        if not col_name:
            continue

        collection = db[col_name]
        cursor = collection.find({}, projection)

        async for course in cursor:
            # 디버깅용: 어느 컬렉션에서 왔는지 태그
            course["_source_collection"] = col_name
            all_courses.append(course)

    return all_courses


def build_enrollment(student_id: str, course: Dict[str, Any]) -> Dict[str, Any]:
    status = random.choices(["COMPLETED", "ENROLLED"], weights=[0.7, 0.3])[0]
    doc: Dict[str, Any] = {
        "student_id": student_id,
        "course_code": course["course_code"],
        "course_name": course.get("name", ""),
        "year": random.randint(2021, 2024),
        "semester": random.choice([1, 2]),
        "status": status,
        "credits": int(course.get("credits", 0)),
        "category": course.get("category"),
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
        description="Seed sample enrollments based on existing course collections."
    )
    parser.add_argument("student_id", help="Target student_id to seed enrollments for")
    parser.add_argument("-n", "--count", type=int, default=10, help="Number of enrollments to create")
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
    