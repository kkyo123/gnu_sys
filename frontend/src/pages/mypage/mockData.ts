import { AcademicData, KeywordPrefs, TimetableCourse } from '../../types/mypage';

export const academicDataMock: AcademicData = {
  totalCredits: { current: 105, required: 130 },
  categories: [
    { key: 'major-required', name: '전공필수', current: 36, required: 42 },
    { key: 'major-elective', name: '전공선택', current: 36, required: 42 },
    { key: 'core', name: '핵심교양', current: 18, required: 18 },
    { key: 'balance', name: '균형교양', current: 12, required: 18 },
  ],
};

export const timetableCoursesMock: TimetableCourse[] = [
  { id: 'c1', name: '자료구조', professor: '김교수', day: 0, startTime: 9, duration: 2, color: 'bg-blue-500' },
  { id: 'c2', name: '운영체제', professor: '이교수', day: 1, startTime: 10.5, duration: 1.5, color: 'bg-purple-500' },
  { id: 'c3', name: '데이터베이스', professor: '박교수', day: 2, startTime: 13, duration: 2, color: 'bg-green-500' },
];

export const keywordPrefsMock: KeywordPrefs = {
  selected: ['AI', '네트워크', 'UX'],
};
