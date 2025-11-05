import { request } from './client';

{/* 강의 출력 자료형태 */}
export type CourseOut = {
  requirement_id?: string;
  category?: string;
  course_name?: string;
  course_code?: string;
  professor?: string;
  group?: string; // 전공/교양/일반선택/교직
  year?: number;
  major_track?: string;
  general_type?: string; // 핵심/균형/기초 등
  source_collection?: string;
  source_sheet?: string;
  description?: string; // 서버 필드명이 한글일 수 있어 보조 사용
  [key: string]: any;
};

export type ListCoursesParams = {
  q?: string;
  year?: number;
  group?: string;
  category?: string;
  major_track?: string;
  general_type?: string;
  limit?: number;
  skip?: number;
  collection?: string;
};

export async function listCourses(params: ListCoursesParams = {}): Promise<CourseOut[]> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
  });
  const path = `/courses${qs.toString() ? `?${qs.toString()}` : ''}`;
  return request<CourseOut[]>(path, { method: 'GET' });
}

export async function countCourses(params: Omit<ListCoursesParams, 'limit' | 'skip'> = {}): Promise<number> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
  });
  const path = `/courses/count${qs.toString() ? `?${qs.toString()}` : ''}`;
  return request<number>(path, { method: 'GET' });
}

