from typing import Optional
from pydantic import BaseModel, Field

class CourseBase(BaseModel):
    requirement_id: Optional[str] = Field(None, description="졸업 요건 ID (시트별 구분값)")
    category: Optional[str] = Field(None, description="전공필수/전공선택/핵심/균형/기초 등")
    course_name: str = Field(..., description="과목명")
    course_code: Optional[str] = Field(None, description="과목코드")
    professor: Optional[str] = Field(None, description="담당교수")
    group: Optional[str] = Field(None, description="전공/교양/일반선택/교직")
    year: Optional[int] = Field(None, description="연도 (2025 등)")
    major_track: Optional[str] = Field(None, description="컴퓨터과학/컴퓨터소프트웨어/빅데이터")
    general_type: Optional[str] = Field(None, description="핵심교양/균형교양/기초교양/일반선택·교직")
    설명란: Optional[str] = None
    비고: Optional[str] = None
    source_collection: Optional[str] = Field(None, description="데이터가 들어있는 컬렉션명")
    source_sheet: Optional[str] = Field(None, description="엑셀 시트명 (있을 경우)")

class CourseCreate(CourseBase):
    """새 과목 등록용 모델"""
    pass

class CourseUpdate(BaseModel):
    """기존 과목 수정용 모델"""
    category: Optional[str] = None
    professor: Optional[str] = None
    설명란: Optional[str] = None
    비고: Optional[str] = None

class CourseOut(CourseBase):
    """조회 시 응답 모델"""
    pass
