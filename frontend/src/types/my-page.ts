export type RequirementStatus = 'completed' | 'in-progress' | 'pending';

export type GraduationRequirement = {
  id: number;
  title: string;
  status: RequirementStatus;
  icon?: string; // emoji or short code
};

export type AcademicProgress = {
  totalCredits: { current: number; required: number };
  majorCredits: { current: number; required: number };
  gpa: { current: number; max: number };
  creditsByCategory: {
    major: number;
    general: number;
    elective: number;
  };
};

export type CourseReview = {
  id: number;
  courseName: string;
  professor: string;
  rating: number; // 0 ~ 5
  semester: string; // e.g., '2024-1'
  category: '전공' | '교양' | string;
  review: string;
  date: string; // ISO or YYYY-MM-DD
};

export type SortBy = 'latest' | 'rating' | 'semester';

export type RecommendationPrefs = {
  credits: boolean;
  keywords: boolean;
};

export type NotificationPrefs = {
  reviews: boolean;
  requirements: boolean;
  recommendations: boolean;
};

