import React from 'react';
import { Clock, User, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  raw: any;
};

type Props = {
  course: NormalizedCourse;
  onDetail: (course: NormalizedCourse) => void;
};

export function CourseCard({ course, onDetail }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3>{course.name}</h3>
              {course.type && <Badge variant="secondary">{course.type}</Badge>}
              {course.raw?.course_code && (course.raw?.cls ?? course.raw?.class) && (
                <span className="text-xs text-muted-foreground">
                  · {course.raw.course_code} - {(course.raw?.cls ?? course.raw?.class) as string}{' '}
                </span>
              )}
            </div>

            <p className="text-muted-foreground text-sm mb-3">강의설명</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{course.credits ? `${course.credits}학점` : 'n학점'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{course.professor || '교수명'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{course.timeslot || '강의시간'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onDetail(course)}>
                상세보기
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
