import type { MyPageUser, AcademicData, TimetableCourse, KeywordPrefs, CourseListItem } from '../../types/mypage';
import { DEFAULT_SELECTED_KEYWORDS } from './keywordConfig';

export const mockUser: MyPageUser = {
  id: '2021123456',
  name: '김학생',
  major: '컴퓨터공학과',
  semester: '2025-1',
};

export const mockAcademicData: AcademicData = {
  totalCredits: { current: 105, required: 130 },
  categories: [
    { key: 'major-required', name: '전공필수', current: 36, required: 42 },
    { key: 'major-elective', name: '전공선택', current: 36, required: 42 },
    { key: 'core', name: '핵심교양', current: 18, required: 18 },
    { key: 'balance', name: '균형교양', current: 12, required: 18 },
  ],
};

export const mockCoursesBySemester: Record<string, TimetableCourse[]> = {
  '2025-1': [
    { id: 'c1', name: '자료구조', professor: '김교수', day: 0, startTime: 9, duration: 2, color: 'bg-blue-500' },
    { id: 'c2', name: '운영체제', professor: '이교수', day: 1, startTime: 11, duration: 2, color: 'bg-purple-500' },
    { id: 'c3', name: '데이터베이스', professor: '박교수', day: 2, startTime: 13, duration: 2, color: 'bg-green-500' },
  ],
  '2024-2': [
    { id: 'c4', name: '인공지능개론', professor: '최교수', day: 0, startTime: 13, duration: 2, color: 'bg-orange-500' },
    { id: 'c5', name: '알고리즘', professor: '정교수', day: 3, startTime: 10, duration: 2, color: 'bg-pink-500' },
  ],
  '2024-1': [
    { id: 'c6', name: '프로그래밍언어', professor: '박교수', day: 2, startTime: 14, duration: 2, color: 'bg-green-500' },
  ],
};

export const getCoursesBySemester = (semester: string): TimetableCourse[] => {
  return mockCoursesBySemester[semester] ?? [];
};

export const mockTakenCourses: TimetableCourse[] = getCoursesBySemester(mockUser.semester);

export const mockKeywordPrefs: KeywordPrefs = {
  selected: DEFAULT_SELECTED_KEYWORDS,
};

export const mockUserDefinedCourses: CourseListItem[] = [
  { id: 'u1', title: '선형대수', professor: '김민지', credits: 3, semester: '2025-1', category: '사용자 지정' },
  { id: 'u2', title: '캡스톤 디자인', professor: '박수현', credits: 3, semester: '2025-1', category: '사용자 지정' },
];

export const mockSystemCourses: CourseListItem[] = [
  { id: 's1', title: '운영체제', professor: '이수연', credits: 3, semester: '2025-1', category: '시스템 추천' },
  { id: 's2', title: '컴퓨터네트워크', professor: '최민석', credits: 3, semester: '2025-1', category: '시스템 추천' },
];

export const mockGraduationCourses: CourseListItem[] = [
  { id: 'g1', title: '공학윤리', professor: '정해인', credits: 2, semester: '2024-2', category: '졸업요건' },
  { id: 'g2', title: '현대사회와법', professor: '박지훈', credits: 2, semester: '2024-2', category: '졸업요건' },
];

export default {
  mockUser,
  mockAcademicData,
  mockCoursesBySemester,
  getCoursesBySemester,
  mockTakenCourses,
  mockKeywordPrefs,
  mockUserDefinedCourses,
  mockSystemCourses,
  mockGraduationCourses,
};
