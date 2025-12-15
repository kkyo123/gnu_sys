import React from 'react';
import type { EnrollmentItem } from '@/lib/api/mypage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EnrollmentDebugTableProps {
  enrollments: EnrollmentItem[];
  studentId?: string | null;
}

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

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
        <p className="text-sm text-muted-foreground">
          {bannerText} (이수 정보 + 시간표 필드)
        </p>
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
                {/* 🔽 시간표 디버깅용 컬럼 */}
                <th className="py-2 text-left">요일/교시</th>
                <th className="py-2 text-left">강의실</th>
                <th className="py-2 text-left">source_tab</th>
                <th className="py-2 text-left">color_class</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => {
                const courseName = enrollment.course_name?.trim()
                  ? enrollment.course_name
                  : enrollment.course_code;

                // 타입 정의에는 없을 수 있는 필드라 any로 안전하게 꺼냄
                const eAny = enrollment as any;

                const day: number | undefined =
                  typeof eAny.day === 'number' ? eAny.day : undefined;
                const periodStart: number | undefined =
                  typeof eAny.period_start === 'number' ? eAny.period_start : undefined;
                const periodDuration: number | undefined =
                  typeof eAny.period_duration === 'number' ? eAny.period_duration : undefined;

                const weekdayLabel =
                  day !== undefined && day >= 0 && day < WEEKDAYS.length
                    ? WEEKDAYS[day]
                    : '-';

                let periodLabel = '-';
                if (periodStart !== undefined && periodDuration !== undefined) {
                  const end = periodStart + periodDuration - 1;
                  periodLabel =
                    periodDuration === 1
                      ? `${periodStart}교시`
                      : `${periodStart}~${end}교시`;
                }

                const classroom: string = eAny.classroom ?? '-';
                const sourceTab: string = eAny.source_tab ?? '-';
                const colorClass: string = eAny.color_class ?? '-';

                return (
                  <tr key={enrollment.id} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs">
                      {enrollment.course_code}
                    </td>
                    <td className="py-2 pr-3">{courseName ?? '-'}</td>
                    <td className="py-2 pr-3">
                      {enrollment.category_label ?? enrollment.category ?? '-'}
                    </td>
                    <td className="py-2 pr-3">
                      {enrollment.category_original ?? '-'}
                    </td>
                    <td className="py-2 pr-3">
                      {enrollment.year}-{enrollment.semester}
                    </td>
                    <td className="py-2 pr-3">{enrollment.status}</td>
                    <td className="py-2 pr-3">{enrollment.credits ?? '-'}</td>
                    <td className="py-2 pr-3">
                      {enrollment.status === 'COMPLETED'
                        ? enrollment.grade_point ?? '-'
                        : '-'}
                    </td>

                    {/* 🔽 시간표 디버깅용 셀들 */}
                    <td className="py-2 pr-3">
                      {weekdayLabel} {periodLabel !== '-' ? periodLabel : ''}
                    </td>
                    <td className="py-2 pr-3">{classroom}</td>
                    <td className="py-2 pr-3">{sourceTab}</td>
                    <td className="py-2 pr-3 font-mono text-[11px]">
                      {colorClass}
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
