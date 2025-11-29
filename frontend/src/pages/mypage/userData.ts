import type { MyPageUser, AcademicData, TimetableCourse, KeywordPrefs } from '../../types/mypage';
import { DEFAULT_SELECTED_KEYWORDS } from './keywordConfig';

// 1. 사용자 기본 정보
export const mockUser: MyPageUser = {
  id: '2021123456',
  name: '김학생',
  major: '컴퓨터과학과',
  semester: '2025-1',
};

// 2. 학업/이수 관련 데이터 (moved from existing mock)
export const mockAcademicData: AcademicData = {
  totalCredits: { current: 105, required: 130 },
  categories: [
    { key: 'major-required', name: '전공필수', current: 36, required: 42 },
    { key: 'major-elective', name: '전공선택', current: 36, required: 42 },
    { key: 'core', name: '핵심교양', current: 18, required: 18 },
    { key: 'balance', name: '균형교양', current: 12, required: 18 },
  ],
};

// 3. 학기별 수강/이수한 강의 목록 (timetable-style entries)
export const mockCoursesBySemester: Record<string, TimetableCourse[]> = {
  '2025-1': [
    { id: 'c1', name: '자료구조', professor: '김교수', day: 0, startTime: 9, duration: 2, color: 'bg-blue-500' },
    { id: 'c2', name: '운영체제', professor: '이교수', day: 1, startTime: 10.5, duration: 1.5, color: 'bg-purple-500' },
    { id: 'c3', name: '데이터베이스', professor: '박교수', day: 2, startTime: 13, duration: 2, color: 'bg-green-500' },
  ],
  '2024-2': [
    { id: 'c4', name: '웹개발', professor: '최교수', day: 0, startTime: 13, duration: 2, color: 'bg-orange-500' },
    { id: 'c5', name: '알고리즘', professor: '정교수', day: 3, startTime: 10, duration: 2, color: 'bg-pink-500' },
  ],
  '2024-1': [
    { id: 'c6', name: '프로그래밍', professor: '박교수', day: 2, startTime: 14, duration: 2, color: 'bg-green-500' },
  ],
};

// Helper: Get courses for a specific semester
export const getCoursesBySemester = (semester: string): TimetableCourse[] => {
  return mockCoursesBySemester[semester] ?? [];
};

// For backward compatibility: default to current semester's courses
export const mockTakenCourses: TimetableCourse[] = getCoursesBySemester(mockUser.semester);

// 4. 선호 키워드 (grouped) — use centralized defaults
export const mockKeywordPrefs: KeywordPrefs = {
  selected: DEFAULT_SELECTED_KEYWORDS,
};

export default {
  mockUser,
  mockAcademicData,
  mockCoursesBySemester,
  getCoursesBySemester,
  mockTakenCourses,
  mockKeywordPrefs,
};
