import asyncio
from database.connection import (
    connect_to_mongo,
    get_db,
    close_mongo_connection,
    now_iso,
)

# ------------------------------
# 설정 영역
# ------------------------------

# 시연용 계정: 김이번 (숙련자, 2022학번)
STUDENT_ID_KIM2 = "20220001"   

# 김이번이 "실제로 수강한 걸로" 만들 과목 목록
# (컬렉션 이름, requirement_id)
# 👉 나중에 여기만 채우면 됨
TARGET_COURSES = [
    # 예시) 전공
    ("courses_2022_major_sw", "cs101"),
    ("courses_2022_major_sw", "cs102"),
    ("courses_2023_major_sw", "cs201"),
    ("courses_2023_major_sw", "cs202"),
    ("courses_2024_major",    "cs301"),
    ("courses_2024_major",    "cs302"),
    ("courses_2025_major",    "cs401"),
    ("courses_2025_major",    "cs402"),

    # 예시) 교양 (requirement_id 실제 값에 맞게 수정)
    # ("core_general",        "ge201"),
    # ("balance_general",     "bg101"),
]

# 김이번 입학년도
ENTRANCE_YEAR_KIM2 = 2022


# ------------------------------
# 유틸 함수
# ------------------------------

def parse_year_sem(requirement_id: str, entrance_year: int):
    """
    예: cs302, entrance_year=2022
    -> grade = 3, semester_num = 2
    -> year = 2022 + (3-1) = 2024
    -> semester = "2024-2"
    """
    # cs101, cs302 이런 형태만 처리 (앞 두 글자는 'cs'라고 가정)
    grade = int(requirement_id[2])      # 1,2,3,4
    sem_digit = requirement_id[4]      # "1" or "2"
    semester_num = 1 if sem_digit == "1" else 2

    year = entrance_year + (grade - 1)
    return year, semester_num


def calc_credits(period: str) -> int:
    """
    "1,2,3" -> 3학점
    """
    if not period:
        return 0
    return len([p.strip() for p in period.split(",") if p.strip()])


# ------------------------------
# 메인 로직
# ------------------------------

async def generate_for_kim2():
    await connect_to_mongo()
    db = get_db()
    now = now_iso()

    for collection_name, rid in TARGET_COURSES:
        course = await db[collection_name].find_one({"requirement_id": rid})
        if not course:
            print(f"[WARN] {collection_name} 에서 requirement_id={rid} 과목을 찾지 못했습니다.")
            continue

        # 연도/학기 계산
        year, semester_num = parse_year_sem(rid, ENTRANCE_YEAR_KIM2)
        semester = f"{year}-{semester_num}"

        period_str = course.get("period", "")
        credits = calc_credits(period_str)

        doc = {
            "student_id": STUDENT_ID_KIM2,
            "semester": semester,
            "year": year,
            "semester_num": semester_num,

            "course_code": str(course.get("course_code", "")),
            "course_name": course.get("course_name", ""),
            "category": course.get("category", ""),

            "day": course.get("day"),
            "period": period_str,
            "credits": credits,

            "status": "COMPLETED",
            "updated_at": now,
        }

        await db.course_histories.update_one(
            {
                "student_id": STUDENT_ID_KIM2,
                "semester": semester,
                "course_code": doc["course_code"],
            },
            {
                "$set": doc,
                "$setOnInsert": {"created_at": now},
            },
            upsert=True,
        )

        print(f"[OK] {collection_name} / {rid} → "
              f"course_histories 저장 ({STUDENT_ID_KIM2}, {semester}, {doc['course_name']})")

    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(generate_for_kim2())
