export type Weekday = 0 | 1 | 2 | 3 | 4; // 0=월, 4=금

export type TimetableColor =
  | 'bg-blue-500'
  | 'bg-purple-500'
  | 'bg-green-500'
  | 'bg-orange-500'
  | 'bg-pink-500';

export interface MyPageUser {
  id: string;
  name: string;
  major: string;
  semester: string;
}

export interface CreditCategory {
  key: string;
  name: string;
  current: number;
  required: number;
}

export interface AcademicData {
  totalCredits: { current: number; required: number };
  categories: CreditCategory[];
}

// 메인 시간표에서 사용하던 구조 (시간 기반)
export interface TimetableCourse {
  id: string;
  name: string;
  professor: string;
  day: Weekday;
  startTime: number; // hour 기준 (예: 9 = 09:00)
  duration: number; // 시간 단위
  color: string; // Tailwind class 또는 hex
}

// 표준 강의 구조 (교시/요일 기반)
export interface TimetableCourseStandard {
  id: string;
  name: string;
  professor: string;
  credits: number;
  day: Weekday; // 0=월
  periodStart: number; // 1~9 교시 시작
  periodDuration: number; // 교시 수
  colorClass: TimetableColor | string; // Tailwind bg-* class
}

export interface CourseListItem {
  id: string;
  title: string;
  professor: string;
  credits: number;
  semester: string;
  category: string;
}

import type { KeywordGroupKey } from '../pages/Mypage/keywordConfig';

export interface KeywordPrefs {
  selected: Record<KeywordGroupKey, string[]>;
}
