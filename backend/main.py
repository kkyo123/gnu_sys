from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users

app = FastAPI()

# 프론트 개발 서버 주소
# node.js 설치 후 주소 재입력
origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
