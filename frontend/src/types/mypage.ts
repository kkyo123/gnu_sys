export type Weekday = 0 | 1 | 2 | 3 | 4; // 월~금
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

export interface TimetableCourse {
  id: string;
  name: string;
  professor: string;
  day: Weekday;
  startTime: number; // 24h 기준, 정수/0.5 단위
  duration: number; // 시간 단위
  color: TimetableColor;
}

export interface KeywordPrefs {
  selected: string[];
}
