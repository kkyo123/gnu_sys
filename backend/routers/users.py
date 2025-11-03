from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from database import connection
from routers.auth import get_current_user

router = APIRouter(tags=["Users"])

class ProfilePublic(BaseModel):
    student_id: str
    nickname: str | None = None
    bio: str | None = None

class ProfileUpdate(BaseModel):
    nickname: str | None = None
    bio: str | None = None

@router.get("/me", response_model=ProfilePublic, summary="내 프로필 조회")
async def get_me(user = Depends(get_current_user)):
    db = connection.get_db()
    prof = await db.profiles.find_one({"student_id": user["student_id"]}, projection={"_id": 0})
    if not prof:
        prof = {"student_id": user["student_id"], "nickname": user.get("name"), "bio": ""}
        await db.profiles.insert_one(prof | {"updated_at": datetime.utcnow().isoformat() + "Z"})
    return ProfilePublic(**prof)

@router.patch("/me", response_model=dict, summary="내 프로필 수정")
async def update_me(payload: ProfileUpdate, user = Depends(get_current_user)):
    updates = {}
    if payload.nickname is not None:
        updates["nickname"] = payload.nickname
    if payload.bio is not None:
        updates["bio"] = payload.bio

    if not updates:
        return {"message": "No changes"}

    updates["updated_at"] = datetime.utcnow().isoformat() + "Z"
    db = connection.get_db()
    res = await db.profiles.update_one({"student_id": user["student_id"]}, {"$set": updates}, upsert=True)
    if res.matched_count == 0 and res.upserted_id is None:
        raise HTTPException(status_code=500, detail="Profile update failed")
    return {"message": "updated"}
