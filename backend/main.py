from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connection
from routers import courses, evaluations, requirements
from routers import auth, users
from routers import enrollments, dashboard, graduation
from routers import mypage


app = FastAPI(title="gnu_sys")

origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth.router,         prefix="/auth",         tags=["Auth"]) # 인증 및 사용자 관리
app.include_router(users.router,        prefix="/users",        tags=["Users"]) # 사용자 프로필 및 정보
app.include_router(courses.router,      prefix="/courses",      tags=["Courses"]) # 강의 정보 및 검색
app.include_router(evaluations.router,  prefix="/evaluations",  tags=["Evaluations"]) # 강의 평가
app.include_router(requirements.router, prefix="/requirements", tags=["Requirements"]) # 졸업 요건
app.include_router(enrollments.router, prefix="", tags=["Enrollments"]) # 수강 신청 관련
app.include_router(dashboard.router,   prefix="", tags=["Dashboard"]) # 대시보드 관련
app.include_router(graduation.router, prefix="/graduation", tags=["Graduation"]) # 졸업 관리
app.include_router(mypage.router,     prefix="/mypage", tags=["MyPage"]) # 마이페이지 관련


@app.on_event("startup")
async def on_startup():
    
    await connection.connect_to_mongo()
    db = connection.get_db() 

    # 필요한 인덱스들 (존재하면 MongoDB가 무시)
    await db.users.create_index("student_id", unique=True)
    # Cleanup invalid usernames (null/empty) before creating a unique index
    try:
        await db.users.update_many({"$or": [{"username": None}, {"username": ""}]}, {"$unset": {"username": ""}})
    except Exception:
        pass
    # Create unique index on username only when it exists and is non-empty string
    try:
        await db.users.create_index(
            "username",
            unique=True,
            partialFilterExpression={"username": {"$exists": True, "$type": "string", "$ne": ""}},
        )
    except Exception:
        pass
    await db.profiles.create_index("student_id", unique=True)
    await db.evaluations.create_index("course_code")
    await db.evaluations.create_index([("course_code", 1), ("student_id", 1)], unique=True)
    await db.requirements.create_index("requirement_id", unique=True)
    await db.requirements.create_index("department_scope")
    await db.requirements.create_index("year")

    
    await connection.ensure_indexes()

@app.on_event("shutdown")
async def on_shutdown():
    await connection.close_mongo_connection()

@app.get("/")
def root():
    return {"ok": True, "service": "gnu_sys"}