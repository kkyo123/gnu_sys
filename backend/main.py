from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import connection
from routers import courses, evaluations, requirements
from routers import auth, users
from routers import enrollments, dashboard, graduation
from routers import mypage
from routers import timetable


app = FastAPI(title="gnu_sys")

origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routers
app.include_router(auth.router,         prefix="/auth",         tags=["Auth"])
app.include_router(users.router,        prefix="/users",        tags=["Users"])
app.include_router(courses.router,      prefix="/courses",      tags=["Courses"])
app.include_router(evaluations.router,  prefix="/evaluations",  tags=["Evaluations"])
app.include_router(requirements.router, prefix="/requirements", tags=["Requirements"])
app.include_router(enrollments.router,  prefix="",              tags=["Enrollments"])
app.include_router(dashboard.router,    prefix="",              tags=["Dashboard"])
app.include_router(graduation.router,   prefix="/graduation",   tags=["Graduation"])
app.include_router(mypage.router,       prefix="/mypage",       tags=["MyPage"])
# timetable router was previously under /api, but frontend calls /me/timetable
app.include_router(timetable.router,    prefix="",              tags=["Timetable"])


@app.on_event("startup")
async def on_startup():
    await connection.connect_to_mongo()
    db = connection.get_db()

    # indexes
    await db.users.create_index("student_id", unique=True)
    try:
        await db.users.update_many({"$or": [{"username": None}, {"username": ""}]}, {"$unset": {"username": ""}})
    except Exception:
        pass
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
