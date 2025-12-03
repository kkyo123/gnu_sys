import React from 'react';
import type { EnrollmentItem } from '../../../lib/api/mypage';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

interface EnrollmentDebugTableProps {
  enrollments: EnrollmentItem[];
  studentId?: string | null;
}

export const EnrollmentDebugTable: React.FC<EnrollmentDebugTableProps> = ({ enrollments, studentId }) => {
  const bannerText = studentId
    ? `학번 ${studentId} 학생의 강의 이력입니다.`
    : '학생의 강의 이력입니다.';

  if (!enrollments.length) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-muted-foreground space-y-2">
          <div>{bannerText}</div>
          <div>표시할 수강(enrollment) 데이터가 없습니다.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">수강 기록 (DEBUG)</CardTitle>
        <p className="text-sm text-muted-foreground">{bannerText}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-auto max-h-80">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs uppercase">
                <th className="py-2 text-left">코드</th>
                <th className="py-2 text-left">강의명</th>
                <th className="py-2 text-left">분류</th>
                <th className="py-2 text-left">원래 분류</th>
                <th className="py-2 text-left">년도/학기</th>
                <th className="py-2 text-left">상태</th>
                <th className="py-2 text-left">학점</th>
                <th className="py-2 text-left">평점</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => {
                const courseName = enrollment.course_name?.trim()
                  ? enrollment.course_name
                  : enrollment.course_code;
                return (
                  <tr key={enrollment.id} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs">{enrollment.course_code}</td>
                    <td className="py-2 pr-3">{courseName ?? '-'}</td>
                    <td className="py-2 pr-3">{enrollment.category_label ?? enrollment.category ?? '-'}</td>
                    <td className="py-2 pr-3">{enrollment.category_original ?? '-'}</td>
                    <td className="py-2 pr-3">
                      {enrollment.year}-{enrollment.semester}
                    </td>
                    <td className="py-2 pr-3">{enrollment.status}</td>
                    <td className="py-2 pr-3">{enrollment.credits ?? '-'}</td>
                    <td className="py-2 pr-3">
                      {enrollment.status === 'COMPLETED' ? enrollment.grade_point ?? '-' : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
