import type { TimetableCourse, TimetableCourseStandard } from '@/types/mypage';
import type { Course as PreviewCourse } from './components/TimetableOnly';

const tailwindToHex: Record<string, string> = {
  'bg-rose-500': '#f43f5e',
  'bg-teal-400': '#2dd4bf',
  'bg-emerald-300': '#6ee7b7',
  'bg-orange-400': '#fb923c',
  'bg-green-300': '#86efac',
  'bg-amber-200': '#fde68a',
  'bg-rose-300': '#fecaca',
  'bg-pink-300': '#f9a8d4',
  'bg-purple-300': '#c4b5fd',
  'bg-blue-300': '#93c5fd',
  'bg-emerald-400': '#34d399',
  'bg-yellow-300': '#fde047',
  'bg-blue-500': '#3b82f6',
  'bg-purple-500': '#a855f7',
  'bg-green-500': '#22c55e',
  'bg-orange-500': '#f97316',
  'bg-pink-500': '#ec4899',
};

export const toMainTimetable = (course: TimetableCourseStandard): TimetableCourse => ({
  id: course.id,
  name: course.name,
  professor: course.professor,
  day: course.day,
  startTime: 8 + course.periodStart, // 1교시=9시 가정
  duration: course.periodDuration,
  // 메인 시간표에서도 purge 문제 없이 보이도록 hex 적용
  color: tailwindToHex[course.colorClass] ?? '#3b82f6',
});

export const toPreviewCourse = (course: TimetableCourseStandard): PreviewCourse => {
  const dayChar = ['월', '화', '수', '목', '금'][course.day] ?? '월';
  const periods = Array.from({ length: course.periodDuration }, (_, i) => course.periodStart + i).join(',');
  const hex = tailwindToHex[course.colorClass] ?? '#4f46e5';
  return {
    id: course.id,
    name: course.name,
    professor: course.professor,
    credits: course.credits,
    time: `${dayChar}${periods}`,
    color: hex,
  };
};
