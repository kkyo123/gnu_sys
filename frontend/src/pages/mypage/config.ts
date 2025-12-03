export const MYPAGE_SECTION_IDS = {
  creditOverview: 'credit-overview',
  timetable: 'timetable',
  preferences: 'preferences',
} as const;

export type MyPageSectionId = typeof MYPAGE_SECTION_IDS[keyof typeof MYPAGE_SECTION_IDS];

export interface SemesterOption {
  value: string;
  label: string;
}

export const SEMESTER_OPTIONS: SemesterOption[] = [
  { value: '2025-1', label: '2025년 1학기' },
  { value: '2024-2', label: '2024년 2학기' },
  { value: '2024-1', label: '2024년 1학기' },
];

export const DEFAULT_SELECTED_SEMESTER = '2025-1';
