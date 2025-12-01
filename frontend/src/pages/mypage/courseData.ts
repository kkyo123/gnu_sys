import type { TimetableCourseStandard, CourseListItem } from '../../types/mypage';

export type CourseTab = 'custom' | 'system' | 'graduation';

// 공통 강의 베이스: 한 곳에서 관리하고, 학기/탭 별로 파생해 사용
const baseCourses: Record<string, TimetableCourseStandard> = {
  c1: { id: 'c1', name: '자료구조', professor: '김교수', credits: 3, day: 0, periodStart: 1, periodDuration: 2, colorClass: 'bg-blue-500' },
  c2: { id: 'c2', name: '운영체제', professor: '이교수', credits: 3, day: 1, periodStart: 3, periodDuration: 2, colorClass: 'bg-purple-500' },
  c3: { id: 'c3', name: '데이터베이스', professor: '박교수', credits: 3, day: 2, periodStart: 5, periodDuration: 2, colorClass: 'bg-green-500' },
  c4: { id: 'c4', name: '인공지능개론', professor: '최교수', credits: 3, day: 0, periodStart: 5, periodDuration: 2, colorClass: 'bg-orange-500' },
  c5: { id: 'c5', name: '알고리즘', professor: '조교수', credits: 3, day: 3, periodStart: 2, periodDuration: 2, colorClass: 'bg-pink-500' },
  c6: { id: 'c6', name: '프로그래밍언어론', professor: '박교수', credits: 3, day: 2, periodStart: 6, periodDuration: 2, colorClass: 'bg-green-500' },
  t1: { id: 't1', name: '알고리즘', professor: '최상민', credits: 3, day: 1, periodStart: 1, periodDuration: 3, colorClass: 'bg-rose-500' },
  t2: { id: 't2', name: '정보보안개론', professor: '김지윤', credits: 3, day: 1, periodStart: 6, periodDuration: 3, colorClass: 'bg-teal-400' },
  t3: { id: 't3', name: '운영체제', professor: '남영호', credits: 3, day: 2, periodStart: 5, periodDuration: 3, colorClass: 'bg-emerald-300' },
  t4: { id: 't4', name: '데이터과학', professor: '서현', credits: 3, day: 3, periodStart: 6, periodDuration: 3, colorClass: 'bg-orange-400' },
  t5: { id: 't5', name: '인공지능', professor: '이민수', credits: 3, day: 0, periodStart: 3, periodDuration: 3, colorClass: 'bg-green-300' },
  t6: { id: 't6', name: '데이터베이스', professor: '박준영', credits: 3, day: 2, periodStart: 1, periodDuration: 3, colorClass: 'bg-amber-200' },
  t7: { id: 't7', name: '네트워크', professor: '정수진', credits: 3, day: 3, periodStart: 2, periodDuration: 3, colorClass: 'bg-rose-300' },
  t8: { id: 't8', name: '컴퓨터구조', professor: '강민호', credits: 3, day: 4, periodStart: 5, periodDuration: 3, colorClass: 'bg-pink-300' },
  t9: { id: 't9', name: '프로그래밍언어론', professor: '윤서연', credits: 3, day: 0, periodStart: 6, periodDuration: 3, colorClass: 'bg-purple-300' },
  t10: { id: 't10', name: '소프트웨어공학', professor: '최동욱', credits: 3, day: 1, periodStart: 4, periodDuration: 3, colorClass: 'bg-blue-300' },
  t11: { id: 't11', name: '컴파일러', professor: '한지민', credits: 3, day: 2, periodStart: 8, periodDuration: 2, colorClass: 'bg-emerald-400' },
  t12: { id: 't12', name: '모바일프로그래밍', professor: '임태훈', credits: 3, day: 4, periodStart: 1, periodDuration: 3, colorClass: 'bg-yellow-300' },
  t13: { id: 't13', name: '임시강의', professor: '월공강', credits: 3, day: 0, periodStart: 1, periodDuration: 2, colorClass: 'bg-yellow-300' },
};

const pick = (ids: string[]) => ids.map((id) => baseCourses[id]).filter(Boolean) as TimetableCourseStandard[];

export const mockCoursesBySemester: Record<string, TimetableCourseStandard[]> = {
  '2025-1': pick(['c1', 'c2', 'c3']),
  '2024-2': pick(['c4', 'c5']),
  '2024-1': pick(['c6']),
};

export const coursesByTab: Record<CourseTab, TimetableCourseStandard[]> = {
  custom: pick(['t1', 't2', 't3', 't4']),
  system: pick(['t5', 't6', 't7', 't8']),
  graduation: pick(['t9', 't10', 't11', 't12', 't13']),
};

export const mockUserDefinedCourses: CourseListItem[] = [
  { id: 'u1', title: '사용자 정의 과목 A', professor: '김민수', credits: 3, semester: '2025-1', category: '사용자 정의' },
  { id: 'u2', title: '사용자 정의 과목 B', professor: '박수정', credits: 3, semester: '2025-1', category: '사용자 정의' },
];

export const mockSystemCourses: CourseListItem[] = [
  { id: 's1', title: '운영체제', professor: '이경민', credits: 3, semester: '2025-1', category: '시스템 추천' },
  { id: 's2', title: '컴퓨터네트워크', professor: '최성훈', credits: 3, semester: '2025-1', category: '시스템 추천' },
];

export const mockGraduationCourses: CourseListItem[] = [
  { id: 'g1', title: '공학윤리', professor: '김해리', credits: 2, semester: '2024-2', category: '졸업요건' },
  { id: 'g2', title: '경제와사회', professor: '박다인', credits: 2, semester: '2024-2', category: '졸업요건' },
];
