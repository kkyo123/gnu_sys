import { request } from './client';

type AuthHeaders = {
  Authorization: string;
};

const authHeaders = (token: string): AuthHeaders => ({
  Authorization: `Bearer ${token}`,
});

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
  year: number;
  semester: number;
  status: string;
  category?: string | null;
  category_label?: string | null;
  grade?: string | null;
  grade_point?: number | null;
  credits?: number | null;
  created_at: string;
  updated_at: string;
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
