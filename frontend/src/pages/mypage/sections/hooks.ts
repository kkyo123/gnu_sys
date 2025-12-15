import { useCallback, useEffect, useState } from 'react';
import {
  getRequiredCourses,   
  getSemesterGPA,
  getMyEnrollments,
  type RequiredCourseItem,   // course_code, namd, is_completed
  type SemesterGPAItem,      // year, semester, gpa, credits
  type EnrollmentItem,       // id, student_id, course_code, course_name, professor, timeslot, start_time, end_time, year, semester, status, category, category_label, category_original, grade
} from '@/lib/api/mypage';

export function useRequiredCourses(token?: string | null) {
  const [courses, setCourses] = useState<RequiredCourseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(() => Boolean(token));
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) {
      setCourses([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getRequiredCourses(token);
      setCourses(response.required_courses);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[mypage] failed to load required courses', err);
      setError('전공 필수 과목 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    courses,
    loading,
    error,
    refetch: fetchData,
  };
}

export function useSemesterGpa(token?: string | null) {
  const [semesters, setSemesters] = useState<SemesterGPAItem[]>([]);
  const [loading, setLoading] = useState<boolean>(() => Boolean(token));
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) {
      setSemesters([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getSemesterGPA(token);
      setSemesters(response.semesters);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[mypage] failed to load semester GPA data', err);
      setError('학기별 GPA 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    semesters,
    loading,
    error,
    refetch: fetchData,
  };
}

export function useEnrollments(token?: string | null) {
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(() => Boolean(token));
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) {
      setEnrollments([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getMyEnrollments(token);
      setEnrollments(response);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[mypage] failed to load enrollments', err);
      setError('수강 데이터(enrollments)를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    enrollments,
    loading,
    error,
    refetch: fetchData,
  };
}
