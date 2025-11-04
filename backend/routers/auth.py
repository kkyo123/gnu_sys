from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
import unicodedata
from datetime import datetime, timedelta
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from passlib.context import CryptContext
from database import connection
import logging
import os

router = APIRouter(tags=["Auth"])
logger = logging.getLogger("app.auth")

# ====== Config & Security ======
pwd_ctx = CryptContext(
    schemes=[
        "pbkdf2_sha256",   # default, no 72-byte limit
        "bcrypt_sha256",   # accept old hashes for verification
        "bcrypt",          # accept plain bcrypt if present
    ],
    default="pbkdf2_sha256",
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
def _normalize_pw(raw: str) -> str:
    # Normalize to avoid ambiguous unicode forms
    return unicodedata.normalize("NFKC", raw)

def make_password_hash(raw: str) -> str:
    pw = _normalize_pw(raw)
    try:
        return pwd_ctx.hash(pw)
    except ValueError as e:
        # e.g., backend-specific limits (bcrypt 72-byte) -> surface as 400
        raise HTTPException(status_code=400, detail=str(e))

def verify_password(raw: str, hashed: str) -> bool:
    pw = _normalize_pw(raw)
    return pwd_ctx.verify(pw, hashed)


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
    except ExpiredSignatureError:
        logger.warning("/auth/me expired token")
        raise HTTPException(status_code=401, detail="Expired token")
    except JWTError:
        logger.warning("/auth/me invalid token")
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
    logger.info("/auth/ping")
    return {"auth": "ok"}

@router.post("/register", response_model=dict, summary="회원가입")
async def register(payload: UserCreate):
    logger.info("/auth/register email=%s student_id=%s", payload.email, payload.student_id)
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
    logger.info("/auth/register created user student_id=%s", payload.student_id)

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
    logger.info("/auth/login identifier=%s", body.identifier)
    user = await get_user_by_identifier(body.identifier)
    if not user or not verify_password(body.password, user.get("password_hash", "")):
        logger.warning("/auth/login invalid credentials identifier=%s", body.identifier)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # On successful verify, upgrade hash if needed (migrate older schemes)
    try:
        if pwd_ctx.needs_update(user.get("password_hash", "")):
            new_hash = make_password_hash(body.password)
            await connection.get_db().users.update_one(
                {"student_id": user["student_id"]},
                {"$set": {"password_hash": new_hash, "updated_at": datetime.utcnow().isoformat() + "Z"}},
            )
    except Exception:
        # Non-fatal: proceed with login even if upgrade failed
        pass

    token = create_access_token(sub=user["student_id"])
    logger.info("/auth/login success student_id=%s", user["student_id"])
    return TokenResponse(access_token=token)

@router.get("/me", summary="토큰으로 내 계정 확인")
async def me(current = Depends(get_current_user)):
    logger.info("/auth/me student_id=%s", current.get("student_id"))
    return current
