// src/pages/search/types.ts
import type { CourseOut } from '@/lib/api/courses';

export type FilterState = {
  balancedGeneral: boolean;
  basicGeneral: boolean;
  coreGeneral: boolean;
  teacherTraining: boolean;
  generalElective: boolean;
  majorRequired: boolean;
  majorElective: boolean;
};

export type NormalizedCourse = {
  id: string;
  name: string;
  professor: string;
  department: string;
  credits?: number;
  timeslot: string;
  capacity?: number;
  enrolled?: number;
  rating?: number;
  type: string;
  description: string;
  raw: CourseOut;
};
