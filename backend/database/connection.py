from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection
from datetime import datetime
from dotenv import load_dotenv
from typing import List
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL") or os.getenv("MONGODB_URI") or "mongodb://localhost:27017"
DB_NAME = os.getenv("DB_NAME", "gnu_sys")
COURSE_COLLECTIONS = [c.strip() for c in os.getenv("COURSE_COLLECTIONS", "").split(",") if c.strip()]

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
    database = get_db()
    names = COURSE_COLLECTIONS or ["courses"]
    return [database[name] for name in names]

async def ensure_indexes():
    for coll in await get_course_collections():
        await coll.create_index("course_code")
        await coll.create_index([("year", 1), ("group", 1), ("category", 1)])
        try:
            await coll.create_index([("course_name", "text"), ("professor", "text"), ("category", "text")])
        except Exception:
            pass
