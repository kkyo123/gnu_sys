from typing import Optional, List
from pydantic import BaseModel, Field

class RequirementBase(BaseModel):
    requirement_id: str = Field(..., description="졸업요건 고유 ID (예: GR2025)")
    year: int = Field(..., description="해당 연도")
    department: str = Field(..., description="학과/전공명")
    major_track: Optional[str] = Field(None, description="세부 전공 (컴퓨터과학/소프트웨어/빅데이터 등)")
    group: Optional[str] = Field(None, description="전공/교양/일반선택 등 구분")
    required_credits: Optional[int] = Field(None, description="필요 이수 학점")
    description: Optional[str] = Field(None, description="요건 설명")
    updated_at: Optional[str] = Field(None, description="마지막 갱신 일시 (ISO8601)")

class RequirementCreate(RequirementBase):
    """졸업요건 추가용 모델"""
    pass

class RequirementUpdate(BaseModel):
    """졸업요건 수정용 모델"""
    required_credits: Optional[int] = None
    description: Optional[str] = None

class RequirementPublic(RequirementBase):
    """조회용 응답 모델"""
    pass
