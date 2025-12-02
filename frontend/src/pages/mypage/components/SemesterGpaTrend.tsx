import React from 'react';
import type { SemesterGPAItem } from '../../../lib/api/mypage';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';

interface SemesterGpaTrendProps {
  semesters: SemesterGPAItem[];
}

const semesterLabel = (item: SemesterGPAItem) => `${item.year}-${item.semester}`;

export const SemesterGpaTrend: React.FC<SemesterGpaTrendProps> = ({ semesters }) => {
  if (!semesters.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          학기별 GPA 데이터가 없습니다.
        </CardContent>
      </Card>
    );
  }

  const maxCredits = Math.max(...semesters.map((s) => s.credits || 1), 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">학기별 GPA 추이</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {semesters.map((item) => (
          <div key={semesterLabel(item)}>
            <div className="flex justify-between items-center text-sm">
              <div className="font-medium">{semesterLabel(item)}</div>
              <div className="text-muted-foreground">{item.credits}학점</div>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-semibold">{item.gpa.toFixed(2)}</span>
              <div className="flex-1">
                <Progress value={(item.credits / maxCredits) * 100} className="h-2" />
              </div>
              <span className="text-xs text-muted-foreground">GPA</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
