from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from database import connection
import os

router = APIRouter(tags=["Auth"])

# ====== Config & Security ======
pwd_ctx = CryptContext(
    schemes=["bcrypt_sha256"],  
    default="bcrypt_sha256",
    deprecated="auto",
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALG = os.getenv("JWT_ALG", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

# ====== Schemas ======
class UserCreate(BaseModel):
    student_id: str
    email: EmailStr
    name: str
    password: str =  Field(min_length=8, max_length=128) # 최소/최대 길이정함

class LoginRequest(BaseModel):
    identifier: str      # 학번 또는 이메일
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ====== Helpers ======
def make_password_hash(raw: str) -> str:
    return pwd_ctx.hash(raw)

def verify_password(raw: str, hashed: str) -> bool:
    return pwd_ctx.verify(raw, hashed)


def create_access_token(sub: str) -> str:
    now = datetime.utcnow()
    payload = {
        "sub": sub,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=JWT_EXPIRE_MINUTES)).timestamp()),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

async def get_user_by_identifier(identifier: str):
    db = connection.get_db()
    return await db.users.find_one(
        {"$or": [{"email": identifier}, {"student_id": identifier}]}
    )

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        sub = payload.get("sub")
        if not sub:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db = connection.get_db()
    user = await db.users.find_one(
        {"student_id": sub},
        projection={"_id": 0, "password_hash": 0}
    )
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ====== Endpoints ======
@router.get("/ping", summary="Auth health check")
async def ping():
    return {"auth": "ok"}

@router.post("/register", response_model=dict, summary="회원가입")
async def register(payload: UserCreate):
    db = connection.get_db()
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
    if not user or not verify_password(body.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(sub=user["student_id"])
    return TokenResponse(access_token=token)

@router.get("/me", summary="토큰으로 내 계정 확인")
async def me(current = Depends(get_current_user)):
    return current
