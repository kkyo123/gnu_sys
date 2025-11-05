from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection
from datetime import datetime
from dotenv import load_dotenv, find_dotenv
from typing import List
import os

load_dotenv(find_dotenv())

MONGO_URL = os.getenv("MONGO_URL") or os.getenv("MONGODB_URI") or "mongodb://localhost:27017"
DB_NAME = os.getenv("DB_NAME", "gnu_sys")
# 肄ㅻ쭏濡??섏뿴?섎㈃ ?곗꽑 ?ъ슜, 鍮꾩뼱?덉쑝硫??먮룞 媛먯?
# Comma-separated list; prefer COURSE_COLLECTIONS, but also accept common misspelling COURSE_COLECTIONS
_raw_course_collections = (
    os.getenv("COURSE_COLLECTIONS")
    or os.getenv("COURSE_COLECTIONS")
    or ""
)
COURSE_COLLECTIONS = [c.strip() for c in _raw_course_collections.split(",") if c.strip()]

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None

async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=8000)
    db = client[DB_NAME]
    await db.command("ping")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        client = None

def now_iso() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

def get_db() -> AsyncIOMotorDatabase:
    assert db is not None, "DB is not connected. Did you call connect_to_mongo()?"
    return db

async def get_course_collections() -> List[AsyncIOMotorCollection]:
    """
    1) COURSE_COLLECTIONS=.env??吏?뺣뤌 ?덉쑝硫?洹?紐⑸줉 ?ъ슜
    2) ?꾨땲硫?DB?먯꽌 ?먮룞?쇰줈 而щ젆??寃??
       - 'courses_' 濡??쒖옉?섎뒗 寃??꾨?
       - ?뱀떆 ?곕뒗 援먯뼇??而щ젆?섏씠 ?곕줈 ?덉쑝硫?異붽?
    """
    database = get_db()
    # Use configured COURSE_COLLECTIONS; ignore any single-collection overrides
    names = COURSE_COLLECTIONS
    if not names:
        all_names = await database.list_collection_names()
        names = [n for n in all_names if n.startswith("courses_")]
        # ?꾩슂?섎㈃ ?꾨옒 異붽?:
        for extra in ("core_general", "balance_general", "basic_general", "courses_NormalStudy"):
            if extra in all_names:
                names.append(extra)

    return [database[name] for name in names]

async def ensure_indexes():
    for coll in await get_course_collections():
        await coll.create_index("course_code")
        await coll.create_index([("year", 1), ("group", 1), ("category", 1)])
        try:
            await coll.create_index([("course_name", "text"), ("professor", "text"), ("category", "text")]) 
        except Exception:
            pass
