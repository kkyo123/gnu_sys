import type { Weekday } from '../../../types/mypage';

export const START_HOUR = 9; // 시간표 시작 시각
export const SLOT_COUNT = 9; // 9~17시
export const SLOT_HEIGHT = 68; // px per slot

export const PROGRESS_RADIUS = 80;
export const PROGRESS_STROKE = 20;
export const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;

export const DAYS: Record<Weekday, string> = {
  0: '월',
  1: '화',
  2: '수',
  3: '목',
  4: '금',
};
