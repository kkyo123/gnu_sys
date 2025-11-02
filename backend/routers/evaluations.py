#강의평가 부분
# from fastapi import APIRouter, HTTPException, Query
# from database.connection import db, now_iso
# from models.evaluation_model import EvaluationCreate, EvaluationPublic, EvaluationSummary

# router = APIRouter()

# @router.post("/", response_model=dict)
# async def create_evaluation(payload: EvaluationCreate):
#     # 과목 존재 체크(선택)
#     if not await db.courses.find_one({"course_code": payload.course_code}):
#         raise HTTPException(status_code=404, detail="Course not found")

#     # 학생 중복 평가 방지
#     exists = await db.evaluations.find_one({
#         "course_code": payload.course_code,
#         "student_id": payload.student_id
#     })
#     if exists:
#         raise HTTPException(status_code=409, detail="evaluation already exists for this student/course")

#     doc = payload.dict()
#     doc["created_at"] = now_iso()
#     doc["updated_at"] = now_iso()
#     await db.evaluations.insert_one(doc)
#     return {"message": "Evaluation saved"}

# @router.get("/{course_code}", response_model=dict)
# async def get_evaluations(course_code: str):
#     data = [EvaluationPublic(**d) async for d in db.evaluations.find({"course_code": course_code})]
#     if not data:
#         return {"data": [], "summary": None}
#     count = len(data)
#     avg_diff = sum(d.difficulty for d in data) / count
#     exam_counts = [d.exam_count for d in data if d.exam_count is not None]
#     avg_exam = round(sum(exam_counts) / len(exam_counts), 2) if exam_counts else None
#     summary = EvaluationSummary(course_code=course_code, count=count, avg_difficulty=round(avg_diff, 2), avg_exam_count=avg_exam)
#     return {"data": [d.dict() for d in data], "summary": summary.dict()}

from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
async def ping():
    return {"evaluations": "ok"}

