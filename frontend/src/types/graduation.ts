export type RequirementKey = 'majorRequired' | 'majorElective' | 'coreGeneral' | 'balanceGeneral';
export type CoursePriority = 'high' | 'medium' | 'low';
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface GraduationSummary {
  totalRequiredCredits: number;
  completedCredits: number;
}

export interface CreditRequirement {
  key: RequirementKey;
  label: string;
  requiredCredits: number;
  completedCredits: number;
  accent: 'blue' | 'green' | 'amber' | 'purple';
}

export interface BalancedArea {
  id: string;
  name: string;
  requiredCredits: number;
  completedCredits: number;
}

export interface CertificationItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Certification {
  id: string;
  title: string;
  completed: boolean;
  requiredCount?: number;
  items?: CertificationItem[];
}

export interface CourseRecommendation {
  id: string;
  title: string;
  professor: string;
  credits: number;
  category: string;
  semester: string;
  difficulty: CourseDifficulty;
  priority: CoursePriority;
  rating?: number;
  prerequisite?: string;
  description: string;
}

export interface GraduationData {
  summary: GraduationSummary;
  requirements: CreditRequirement[];
  balancedAreas: BalancedArea[];
  certifications: Certification[];
  recommendedCourses: CourseRecommendation[];
}
