import React from 'react';
import { BookOpen, GraduationCap, Target } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import type { CourseDifficulty, CoursePriority, CourseRecommendation } from '../../../types/graduation';

const priorityCopy: Record<CoursePriority, { label: string; className: string }> = {
  high: { label: '필수', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
  medium: { label: '추천', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  low: { label: '선택', className: 'bg-slate-100 text-slate-700 hover:bg-slate-100' },
};

const difficultyCopy: Record<CourseDifficulty, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '심화',
};

interface RecommendedCoursesProps {
  courses: CourseRecommendation[];
  visibleCount?: number;
  /** 과목 상세 모달 열기 */
  onCourseDetail?: (course: CourseRecommendation) => void;
  /** 카드에서 바로 관심과목 등록 */
  onAddInterest?: (course: CourseRecommendation) => void;
}

export const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({
  courses,
  visibleCount,
  onCourseDetail,
  onAddInterest,
}) => {
  const list = visibleCount ? courses.slice(0, visibleCount) : courses;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-primary" />
          <span>맞춤형 추천 과목</span>
        </CardTitle>
        <CardDescription>이수 현황과 GPA를 반영한 우선순위별 추천</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {list.map((course) => (
          <Card key={course.id} className="border">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* 왼쪽: 텍스트 정보 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <Badge variant="secondary" className={priorityCopy[course.priority].className}>
                      {priorityCopy[course.priority].label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {course.category} · {course.semester}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span>교수: {course.professor}</span>
                    <span>선수: {course.prerequisite ?? '없음'}</span>
                    {course.rating && <span>평점: {course.rating.toFixed(1)}</span>}
                  </div>
                </div>

                {/* 오른쪽: 정보 + 버튼들 */}
                <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{course.credits}학점</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>난이도: {difficultyCopy[course.difficulty]}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddInterest?.(course)}
                    >
                      관심과목
                    </Button>
                    <Button
                      size="sm"
                      className="bg-foreground text-background hover:bg-foreground/90"
                      onClick={() => onCourseDetail?.(course)}
                    >
                      과목 상세
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
