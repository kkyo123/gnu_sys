import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { GraduationSummary } from '../../../types/graduation';
import { CircularProgress } from './CircularProgress';

interface GraduationOverviewProps {
  summary: GraduationSummary;
  className?: string;
}

export const GraduationOverview: React.FC<GraduationOverviewProps> = ({ summary, className }) => {
  const { totalRequiredCredits, completedCredits } = summary;

  const safeTotal = totalRequiredCredits <= 0 ? 1 : totalRequiredCredits;
  const safeCompleted = Math.min(Math.max(completedCredits, 0), safeTotal);

  const progressPercent = Math.round((safeCompleted / safeTotal) * 100);

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <h3 className="mb-4">학점 이수 진행도</h3>
        <div className="flex flex-col items-center justify-center py-4">
          <CircularProgress
            value={completedCredits}
            max={totalRequiredCredits}
            label={`${progressPercent}%`}
            helper=""
            tone="success"
          />
          <div className="text-center text-sm text-muted-foreground mt-2 leading-tight">
            <div>{completedCredits} / {totalRequiredCredits}학점</div>
            <div>이수 학점 / 졸업학점</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
