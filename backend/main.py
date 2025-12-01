from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connection
from routers import courses, evaluations, requirements
from routers import auth, users
from routers import enrollments, dashboard, graduation


app = FastAPI(title="gnu_sys")

origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ?쇱슦???깅줉
app.include_router(auth.router,         prefix="/auth",         tags=["Auth"]) # ?몄쬆 諛??ъ슜??愿由?
app.include_router(users.router,        prefix="/users",        tags=["Users"]) # ?ъ슜???꾨줈??諛??뺣낫
app.include_router(courses.router,      prefix="/courses",      tags=["Courses"]) # 媛뺤쓽 ?뺣낫 諛?寃??
app.include_router(evaluations.router,  prefix="/evaluations",  tags=["Evaluations"]) # 媛뺤쓽 ?됯?
app.include_router(requirements.router, prefix="/requirements", tags=["Requirements"]) # 議몄뾽 ?붽굔
app.include_router(enrollments.router, prefix="", tags=["Enrollments"])
app.include_router(dashboard.router,   prefix="", tags=["Dashboard"])
app.include_router(graduation.router, prefix="/graduation", tags=["Graduation"])


@app.on_event("startup")
async def on_startup():
    
    await connection.connect_to_mongo()
    db = connection.get_db() 

    # ?꾩슂???몃뜳?ㅻ뱾 (議댁옱?섎㈃ MongoDB媛 臾댁떆)
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

