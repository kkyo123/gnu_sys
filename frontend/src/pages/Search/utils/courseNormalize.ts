// src/pages/search/utils/courseNormalize.ts
import type { CourseOut } from '@/lib/api/courses';
import type { NormalizedCourse } from '../types';

export function normalizeCourses(apiCourses: CourseOut[]): NormalizedCourse[] {
  return apiCourses.map((c: any) => ({
    id: c.course_code || c.course_name || Math.random().toString(36).slice(2),
    name: c.name || c.course_name || '미정',
    professor: c.professor || '미정',
    department: c.group || c.general_type || c.category || '-',
    credits: c.credits ?? c.credit ?? undefined,
    timeslot: c.timeslot ?? c.time ?? '-',
    capacity: c.capacity,
    enrolled: c.enrolled,
    rating: c.rating ?? undefined,
    type: c.category || c.general_type || c.group || '-',
    description: c.description || '-',
    raw: c,
  }));
}
