import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { GraduationSummary } from '../../../types/graduation';
import { remaining } from '../utils/graduation';
import { CircularProgress } from './CircularProgress';

interface GraduationOverviewProps {
  summary: GraduationSummary;
}

export const GraduationOverview: React.FC<GraduationOverviewProps> = ({ summary }) => {
  const { totalRequiredCredits, completedCredits, gpa, minGpa } = summary;
  const meetsGpa = gpa >= minGpa;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-8">
          <CircularProgress
            value={completedCredits}
            max={totalRequiredCredits}
            label={`${completedCredits}학점`}
            helper={`전체 ${totalRequiredCredits}학점`}
            tone={remaining(completedCredits, totalRequiredCredits) === 0 ? 'success' : 'default'}
          />
          <div className="mt-4 text-center space-y-2">
            <h3 className="text-xl font-semibold">졸업 이수 현황</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>남은 학점: {remaining(completedCredits, totalRequiredCredits)}학점</span>
              <span className={meetsGpa ? 'text-green-600' : 'text-red-600'}>
                GPA: {gpa.toFixed(2)} / 요구 {minGpa.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
