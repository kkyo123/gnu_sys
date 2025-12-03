import { request } from './client';
import type { TimetableCourseStandard } from '../../types/mypage';

type AuthHeaders = {
  Authorization: string;
};

const authHeaders = (token: string): AuthHeaders => ({
  Authorization: `Bearer ${token}`,
});

export type CourseTab = 'custom' | 'system' | 'graduation';

export interface CreditSummaryItem {
  acquired: number;
  required: number;
}

export interface RadarItem {
  label: string;
  rate: number;
}

export interface CreditSummaryResponse {
  total: CreditSummaryItem;
  major_required: CreditSummaryItem;
  major_elective: CreditSummaryItem;
  core_general: CreditSummaryItem;
  balance_general: CreditSummaryItem;
  radar: RadarItem[];
}

export interface RequiredCourseItem {
  course_code: string;
  name: string;
  is_completed: boolean;
}

export interface RequiredCoursesResponse {
  required_courses: RequiredCourseItem[];
}

export interface SemesterGPAItem {
  year: number;
  semester: number;
  gpa: number;
  credits: number;
}

export interface SemesterGPAResponse {
  semesters: SemesterGPAItem[];
}

export interface EnrollmentItem {
  id: string;
  student_id: string;
  course_code: string;
  course_name?: string | null;
  professor?: string | null;
  timeslot?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  year: number;
  semester: number;
  status: string;
  category?: string | null;
  category_label?: string | null;
  category_original?: string | null;
  grade?: string | null;
  grade_point?: number | null;
  credits?: number | null;
  created_at: string;
  updated_at: string;
  day?: number | null;
  period_start?: number | null;
  period_duration?: number | null;
  classroom?: string | null;
  color_class?: string | null;
  source_tab?: string | null;
}

export async function getCreditSummary(token: string): Promise<CreditSummaryResponse> {
  return request('/mypage/credit-summary', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

export async function getRequiredCourses(token: string): Promise<RequiredCoursesResponse> {
  return request('/mypage/required-courses', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

export async function getSemesterGPA(token: string): Promise<SemesterGPAResponse> {
  return request('/mypage/semester-gpa', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

export async function getKeywords(token: string): Promise<string[]> {
  return request('/mypage/keywords', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

export async function addKeyword(token: string, keyword: string): Promise<{ message: string }> {
  return request('/mypage/keywords', {
    method: 'POST',
    headers: {
      ...authHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keyword }),
  });
}

export async function deleteKeyword(token: string, keyword: string): Promise<{ message: string }> {
  return request(`/mypage/keywords/${encodeURIComponent(keyword)}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

export async function getMyEnrollments(token: string): Promise<EnrollmentItem[]> {
  return request('/me/enrollments', {
    method: 'GET',
    headers: authHeaders(token),
  });
}

/**
 * 시간표 조회 (enrollments 기반, TimetableCourseStandard[] 형태)
 * 백엔드 GET /me/timetable?year=YYYY&semester=N&tab=...&include_completed=true
 */
export async function getMyTimetable(
  token: string,
  params: {
    year: number;
    semester: number;
    tab?: CourseTab;
    includeCompleted?: boolean;
  },
): Promise<TimetableCourseStandard[]> {
  const search = new URLSearchParams();
  search.set('year', String(params.year));
  search.set('semester', String(params.semester));
  if (params.tab) search.set('tab', params.tab);
  if (params.includeCompleted) search.set('include_completed', 'true');

  const query = `?${search.toString()}`;

  const items = await request<Array<{
    id: string;
    name: string;
    professor?: string | null;
    credits: number;
    day: number;
    periodStart: number;
    periodDuration: number;
    colorClass: string;
  }>>(`/me/timetable${query}`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  return items.map((item, idx) => ({
    id: item.id ?? `${params.year}-${params.semester}-${idx}`,
    name: item.name,
    professor: item.professor ?? '',
    credits: item.credits ?? 0,
    day: item.day as number,
    periodStart: item.periodStart,
    periodDuration: item.periodDuration,
    colorClass: item.colorClass ?? 'bg-rose-500',
  }));
}
