import React, { useMemo } from 'react';
import { Clock, User, BookOpen, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import type { NormalizedCourse } from './CourseCard';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  course: NormalizedCourse | null;
};

function getCourseDetails(course: NormalizedCourse) {
  const keywordMap: { [key: string]: string[] } = {
    '1': ['자료구조', '프로그래밍', '코딩', '알고리즘', '메모리관리', '객체지향'],
    '2': ['통계', '확률', '프로그래밍', '컴퓨터구조', '소프트웨어', '네트워크'],
    '3': ['수학', '논리', '공학', '기계학습', '운영환경', '데이터'],
    '4': ['물리', '화학', '컴퓨팅', '인공지능', '분산시스템', '보안'],
    '5': ['SQL', '데이터모델링', '정규화', 'DBMS', '데이터처리', '정보화'],
  };

  const idKey = String(course.id);

  return {
    ...course,
    prerequisites: idKey === '1' ? ['프로그래밍입문'] : idKey === '5' ? ['자료구조'] : [],
    keywords: keywordMap[idKey] || ['학습', '이론', '실습', '응용'],
    assessmentMethod: { midterm: 30, final: 30, assignment: 25, attendance: 15 },
    syllabus: `${course.name}의 강의개요입니다.`,
    reviews: Math.floor(Math.random() * 50) + 20,
    difficulty: (course.rating ?? 0) > 4.5 ? '어려움' : (course.rating ?? 0) > 4.0 ? '보통' : '쉬움',
  };
}

export function CourseDetailDialog({ open, onOpenChange, course }: Props) {
  const details = useMemo(() => (course ? getCourseDetails(course) : null), [course]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!course || !details ? null : (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-2xl mb-2">{course.name}</DialogTitle>
                  <DialogDescription className="flex items-center space-x-2">
                    <Badge variant="secondary">{course.type}</Badge>
                    <span>·</span>
                    {course.raw?.course_code && (course.raw?.cls ?? course.raw?.class) && (
                      <span>
                        {course.raw.course_code} - {(course.raw?.cls ?? course.raw?.class) as string}
                      </span>
                    )}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4 ml-2 mr-2">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">교수명</p>
                      <p>{course.professor}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">시간표</p>
                      <p>{course.timeslot}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">학점</p>
                      <p>{course.credits ?? '-'}학점</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>강의 소개</span>
                </h4>
                <p className="text-muted-foreground">{course.description}</p>
              </div>

              <Separator />

              <div>
                <h4 className="mb-3">관련 키워드</h4>
                <div className="flex flex-wrap gap-2">
                  {details.keywords.map((keyword: string) => (
                    <Badge key={keyword} variant="secondary" className="px-3 py-1">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex space-x-2 pt-4">
                <Button className="flex-1" disabled={(course.enrolled ?? 0) >= (course.capacity ?? Infinity)}>
                  수강신청
                </Button>
                <Button variant="outline" className="flex-1">
                  강의계획서 보기
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
