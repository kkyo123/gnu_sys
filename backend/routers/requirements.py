from fastapi import APIRouter, HTTPException, Query
from database.connection import db, now_iso
from models.requirement_model import RequirementCreate, RequirementPublic, RequirementUpdate

router = APIRouter()

@router.post("/", response_model=dict)
async def create_requirement(payload: RequirementCreate):
    exists = await db.requirements.find_one({"requirement_id": payload.requirement_id})
    if exists:
        raise HTTPException(status_code=409, detail="requirement_id already exists")

    doc = payload.model_dump()  # pydantic v2
    doc["created_at"] = now_iso()
    doc["updated_at"] = now_iso()
    await db.requirements.insert_one(doc)
    return {"message": "Requirement created"}

@router.get("/", response_model=list[RequirementPublic])
async def list_requirements(
    department: str | None = Query(None, description="학과 이름으로 필터"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    q: dict = {}
    if department:
        q["$or"] = [
            {"department_scope": {"$exists": False}},
            {"department_scope": {"$size": 0}},                 # 리스트인데 빈 배열인 케이스
            {"department_scope": department},                   # 단일 문자열 저장 케이스
            {"department_scope": {"$in": [department]}},        # 리스트에 포함된 케이스
        ]

    cursor = (
        db.requirements
          .find(q, projection={"_id": 0})   # ✅ _id 제거
          .skip(offset)
          .limit(limit)
          .sort("year", 1)                  # 선택: 정렬 기준 하나 두면 응답 안정적
    )
    docs = await cursor.to_list(length=limit)
    return [RequirementPublic(**r) for r in docs]

@router.patch("/{requirement_id}", response_model=dict)
async def update_requirement(requirement_id: str, payload: RequirementUpdate):
    updates = payload.model_dump(exclude_unset=True)  # ✅ v2
    if not updates:
        return {"message": "No changes"}

    updates["updated_at"] = now_iso()
    res = await db.requirements.update_one({"requirement_id": requirement_id}, {"$set": updates})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Requirement not found")
    return {"message": "Requirement updated"}
