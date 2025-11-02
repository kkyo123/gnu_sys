from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connection
from routers import courses, evaluations, requirements
from routers import auth, users

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
app.include_router(auth.router,         prefix="/auth",         tags=["Auth"])
app.include_router(users.router,        prefix="/users",        tags=["Users"])
app.include_router(courses.router,      prefix="/courses",      tags=["Courses"])
app.include_router(evaluations.router,  prefix="/evaluations",  tags=["Evaluations"])
app.include_router(requirements.router, prefix="/requirements", tags=["Requirements"])

@app.on_event("startup")
async def on_startup():
    
    await connection.connect_to_mongo()
    db = connection.get_db() 

    # 필요한 인덱스들 (존재하면 MongoDB가 무시)
    await db.users.create_index("student_id", unique=True)
    await db.profiles.create_index("student_id", unique=True)
    await db.evaluations.create_index("course_code")
    await db.evaluations.create_index([("course_code", 1), ("student_id", 1)], unique=True)
    await db.requirements.create_index("requirement_id", unique=True)
    await db.requirements.create_index("department_scope")
    await db.requirements.create_index("year")

    # 여러 과목 컬렉션 공통 인덱스 (courses_2025_major 등)
    await connection.ensure_indexes()

@app.on_event("shutdown")
async def on_shutdown():
    await connection.close_mongo_connection()

@app.get("/")
def root():
    return {"ok": True, "service": "gnu_sys"}
