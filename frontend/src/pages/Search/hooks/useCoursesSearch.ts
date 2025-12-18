// src/pages/search/hooks/useCourseSearch.ts
import { useEffect, useState } from 'react';
import { listCourses, type CourseOut } from '@/lib/api/courses';

export function useCourseSearch(query: string) {
  const [courses, setCourses] = useState<CourseOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listCourses({ q: query, limit: 50 });
        if (active) setCourses(data || []);
      } catch (e: any) {
        if (active) setError(e?.message || '검색 중 오류가 발생했습니다');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [query]);

  return { courses, loading, error };
}
