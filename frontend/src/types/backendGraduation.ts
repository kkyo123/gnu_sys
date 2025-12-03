export type BackendCategoryStatus = {
  acquired: number;
  required: number;
  remaining: number;
  is_passed: boolean;
};

export type BackendGPAStatus = {
  current: number;
  required: number;
  is_passed: boolean;
};

export type BackendQualificationStatus = {
  required_required: number;
  required_optional: number;
  acquired_required: number;
  acquired_optional: number;
  is_passed: boolean;
};

export type RequirementKey =
  | 'majorRequired'
  | 'majorElective'
  | 'coreGeneral'
  | 'balanceGeneral';

export type BackendGraduationStatusResponse = {
  total: BackendCategoryStatus;
  categories: Record<string, BackendCategoryStatus>;
  gpa: BackendGPAStatus;
  qualification: BackendQualificationStatus;
  requirement_details: Record<RequirementKey, BackendCategoryStatus>;
};

export type RecommendedCourseGroup = 'MUST' | 'HIGH' | 'EXPLORE';

export type BackendRecommendedCourse = {
  course_code: string;
  name: string;
  professor?: string;
  category?: string;
  sub_category?: string;
  credits: number;
  schedule?: Record<string, any>[];
  score: number;
  group: RecommendedCourseGroup;
};

export type BackendRecommendedCoursesResponse = {
  courses: BackendRecommendedCourse[];
};
