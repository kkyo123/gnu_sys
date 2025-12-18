import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CourseCard, type NormalizedCourse } from './CourseCard';

type Props = {
  courses: NormalizedCourse[];
  loading: boolean;
  error: string | null;
  onDetail: (course: NormalizedCourse) => void;
};

export function CourseList({ courses, loading, error, onDetail }: Props) {
  return (
    <div className="grid gap-4">
      {loading && (
        <Card>
          <CardContent className="pt-6">불러오는 중...</CardContent>
        </Card>
      )}

      {error && !loading && (
        <Card>
          <CardContent className="pt-6 text-red-600">{error}</CardContent>
        </Card>
      )}

      {!loading && !error && courses.map((course) => (
        <CourseCard key={course.id} course={course} onDetail={onDetail} />
      ))}
    </div>
  );
}
