from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from database import connection
from fastapi.security import OAuth2PasswordBearer
import os

router = APIRouter(tags=["Auth"])

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALG = os.getenv("JWT_ALG", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

# 스키마
class UserCreate(BaseModel):
    student_id: str
    email: EmailStr
    name: str
    password: str

class LoginRequest(BaseModel):
    identifier: str   # 학번 또는 이메일 (이름 아님)
    password: str

# 헬프
async def get_user_by_identifier(identifier: str):
    db = connection.get_db()
    # identifier가 이메일 형식이면 email로, 아니면 student_id로 검색
    q = {"$or": [{"email": identifier}, {"student_id": identifier}]}
    return await db.users.find_one(q)  # 로그인 검증용이니 projection 생략(해시 필요)

@router.post("/register", response_model=dict, summary="회원가입")
async def register(payload: UserCreate):
    db = connection.get_db()
    # 중복 체크: 학번, 이메일
    exists = await db.users.find_one(
        {"$or": [{"student_id": payload.student_id}, {"email": payload.email}]}
    )
    if exists:
        raise HTTPException(status_code=409, detail="User already exists")

    doc = {
        "student_id": payload.student_id,
        "email": payload.email,
        "name": payload.name,                 # ✅ 이름 저장(로그인에는 미사용)
        "password_hash": make_password_hash(payload.password),
        "created_at": datetime.utcnow().isoformat() + "Z",
        "updated_at": datetime.utcnow().isoformat() + "Z",
    }
    await db.users.insert_one(doc)

    # 프로필 기본 문서 upsert
    await db.profiles.update_one(
        {"student_id": payload.student_id},
        {"$setOnInsert": {
            "student_id": payload.student_id,
            "nickname": payload.name,
            "bio": "",
            "updated_at": datetime.utcnow().isoformat() + "Z"
        }},
        upsert=True,
    )
    return {"message": "registered"}

@router.post("/login", response_model=TokenResponse, summary="로그인(학번 또는 이메일)")
async def login(body: LoginRequest):
    user = await get_user_by_identifier(body.identifier)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(body.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(sub=user["student_id"])
    return TokenResponse(access_token=token)

@router.get("/me", summary="토큰으로 내 계정 확인")
async def me(current = Depends(get_current_user)):
    # get_current_user는 student_id로 조회 → name/email도 포함됨
    return current

# 엔드포인트

@router.get("/ping")
async def ping():
    return {"auth": "ok"}

@router.post("/register", response_model=dict, summary="회원가입")
async def register(payload: UserCreate):
    db = connection.get_db()

    # 중복 체크
    exists = await db.users.find_one(
        {"$or": [{"student_id": payload.student_id}, {"email": payload.email}]}
    )
    if exists:
        raise HTTPException(status_code=409, detail="User already exists")

    doc = {
        "student_id": payload.student_id,
        "email": payload.email,
        "name": payload.name,
        "password_hash": make_password_hash(payload.password),
        "created_at": datetime.utcnow().isoformat() + "Z",
        "updated_at": datetime.utcnow().isoformat() + "Z",
    }
    await db.users.insert_one(doc)

    # 프로필(없으면 생성)
    await db.profiles.update_one(
        {"student_id": payload.student_id},
        {"$setOnInsert": {"student_id": payload.student_id, "nickname": payload.name, "bio": "", "updated_at": datetime.utcnow().isoformat() + "Z"}},
        upsert=True,
    )
    return {"message": "registered"}

@router.post("/login", response_model=TokenResponse, summary="로그인(토큰 발급)")
async def login(body: LoginRequest):
    user = await get_user_by_login(body.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(body.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(sub=user["student_id"])
    return TokenResponse(access_token=token)

@router.get("/me", summary="토큰으로 내 계정 확인")
async def me(current = Depends(get_current_user)):
    return current
