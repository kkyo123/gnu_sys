import React from 'react';
import type { RequiredCourseItem } from '../../../lib/api/mypage';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { CheckCircle2, CircleSlash } from 'lucide-react';

interface RequiredCourseListProps {
  courses: RequiredCourseItem[];
}

export const RequiredCourseList: React.FC<RequiredCourseListProps> = ({ courses }) => {
  if (!courses.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          전공 필수 과목 정보를 찾을 수 없습니다.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">전공 필수 이수 현황</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-80 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs uppercase">
                <th className="py-2 text-left">코드</th>
                <th className="py-2 text-left">과목명</th>
                <th className="py-2 text-left">상태</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.course_code} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-mono text-xs">{course.course_code}</td>
                  <td className="py-2 pr-3">{course.name}</td>
                  <td className="py-2">
                    {course.is_completed ? (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
                        이수 완료
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-200">
                        <CircleSlash className="h-3.5 w-3.5 mr-1 text-amber-500" />
                        이수 전
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
