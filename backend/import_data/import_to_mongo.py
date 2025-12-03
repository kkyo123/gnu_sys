# import_to_mongo.py
import os
import datetime
from pathlib import Path

import pandas as pd
from pymongo import MongoClient

try:
    # .env 쓰고 있으면 자동으로 불러오기 (없으면 그냥 넘어감)
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


# -----------------------------
# 1. MongoDB 연결 설정
# -----------------------------
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "gnu_sys")

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# -----------------------------
# 2. 엑셀 파일 경로
#    (이 파일과 같은 폴더 기준)
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent

HISTORY_FILE = BASE_DIR / "이수이력등록.xlsx"
INTEREST_FILE = BASE_DIR / "관심과목.xlsx"


def _clean_records(df: pd.DataFrame):
    """엑셀 → Mongo 넣기 전에 NaN 제거, 타입 정리용 헬퍼"""
    # 전부 비어있는 행 삭제
    df = df.dropna(how="all")

    records = []
    for r in df.to_dict(orient="records"):
        doc = {}
        for k, v in r.items():
            # NaN/None 빼기
            if pd.isna(v):
                continue

            # pandas Timestamp → ISO 문자열
            if isinstance(v, (pd.Timestamp, datetime.datetime)):
                v = v.isoformat()

            # year 컬럼은 int 로 (엑셀에서 숫자로 읽히면 float 이라)
            if k == "year":
                try:
                    v = int(v)
                except Exception:
                    pass

            doc[k] = v
        if doc:
            records.append(doc)
    return records


# -----------------------------
# 3. 이수 이력 import
# -----------------------------
def import_course_histories():
    if not HISTORY_FILE.exists():
        print(f"[WARN] 이수이력등록 파일을 찾을 수 없음: {HISTORY_FILE}")
        return

    print("▶ Importing course_histories from 이수이력등록.xlsx ...")

    df = pd.read_excel(HISTORY_FILE)
    records = _clean_records(df)

    now = datetime.datetime.utcnow().isoformat()

    for doc in records:
        # created_at / updated_at 없으면 자동 추가
        doc.setdefault("created_at", now)
        doc.setdefault("updated_at", now)

    if records:
        result = db.course_histories.insert_many(records)
        print(f" → {len(result.inserted_ids)} docs inserted into 'course_histories'")
    else:
        print(" → 삽입할 데이터가 없음 (엑셀 비어있음)")


# -----------------------------
# 4. 관심 과목 import
# -----------------------------
def import_interests():
    if not INTEREST_FILE.exists():
        print(f"[WARN] 관심과목 파일을 찾을 수 없음: {INTEREST_FILE}")
        return

    print("▶ Importing interests from 관심과목.xlsx ...")

    df = pd.read_excel(INTEREST_FILE)
    records = _clean_records(df)

    now = datetime.datetime.utcnow().isoformat()

    for doc in records:
        doc.setdefault("created_at", now)

    if records:
        result = db.interests.insert_many(records)
        print(f" → {len(result.inserted_ids)} docs inserted into 'interests'")
    else:
        print(" → 삽입할 데이터가 없음 (엑셀 비어있음)")


# -----------------------------
# 5. 메인
# -----------------------------
if __name__ == "__main__":
    print(f"[INFO] MongoDB: {MONGO_URL} / DB: {DB_NAME}")
    import_course_histories()
    import_interests()
    print("🎉 import_to_mongo.py 완료")
