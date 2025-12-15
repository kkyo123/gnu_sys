import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AcademicData } from '@/types/mypage';
import { PROGRESS_CIRCUMFERENCE, PROGRESS_RADIUS, PROGRESS_STROKE } from '@/pages/mypage/data';

interface CreditOverviewProps {
  academicData: AcademicData;
}

export const CreditOverview: React.FC<CreditOverviewProps> = ({ academicData }) => {
  const progress =
    academicData.totalCredits.required === 0
      ? 0
      : academicData.totalCredits.current / academicData.totalCredits.required;
  const progressPercent = Math.round(progress * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <h3 className="mb-4">학점 이수 진행도</h3>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-40 h-40 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={PROGRESS_RADIUS}
                  stroke="currentColor"
                  strokeWidth={PROGRESS_STROKE}
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={PROGRESS_RADIUS}
                  stroke="currentColor"
                  strokeWidth={PROGRESS_STROKE}
                  fill="none"
                  strokeDasharray={`${progress * PROGRESS_CIRCUMFERENCE} ${PROGRESS_CIRCUMFERENCE}`}
                  className="text-green-500 transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">{progressPercent}%</span>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <div>
                {academicData.totalCredits.current} / {academicData.totalCredits.required}학점
              </div>
              <div>이수 학점 / 졸업학점</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {academicData.categories.map((category) => {
          const percent = category.required === 0 ? 0 : (category.current / category.required) * 100;
          const remaining = Math.max(category.required - category.current, 0);
          const isDone = remaining === 0;
          return (
            <Card key={category.key} className="shadow-sm">
              <CardContent className="pt-6 space-y-3">
                <h3>{category.name}</h3>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">이수학점</div>
                  <div className="flex items-end justify-between">
                    <span>
                      {category.current}/{category.required}학점
                    </span>
                  </div>
                </div>
                <Progress value={percent} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">진행률: {Math.round(percent)}%</span>
                  <span className={isDone ? 'text-green-600' : 'text-red-500'}>
                    {isDone ? '이수 완료' : `${remaining}학점 남음`}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
