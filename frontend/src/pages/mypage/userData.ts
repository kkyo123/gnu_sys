import type { MyPageUser, AcademicData, TimetableCourse, KeywordPrefs, TimetableCourseStandard } from '../../types/mypage';
import { DEFAULT_SELECTED_KEYWORDS } from './keywordConfig';
import {
  mockCoursesBySemester,
  mockUserDefinedCourses,
  mockSystemCourses,
  mockGraduationCourses,
} from './courseData';
import { toMainTimetable } from './courseTransforms';


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



export const getCoursesBySemester = (semester: string): TimetableCourse[] =>
  (mockCoursesBySemester[semester] ?? []).map(toMainTimetable);

export const mockTakenCourses: TimetableCourse[] = getCoursesBySemester(mockUser.semester);

export const mockKeywordPrefs: KeywordPrefs = {
  selected: DEFAULT_SELECTED_KEYWORDS,
};

export { mockUserDefinedCourses, mockSystemCourses, mockGraduationCourses };

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
