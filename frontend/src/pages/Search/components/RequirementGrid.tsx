import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { CreditRequirement } from '../../../types/graduation';
import { percent, remaining } from '../utils/graduation';

interface RequirementGridProps {
  requirements: CreditRequirement[];
  className?: string;
}

export const RequirementGrid: React.FC<RequirementGridProps> = ({ requirements, className }) => (
  <div className={className ?? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'}>
    {requirements.map((req) => {
      const reqRemaining = remaining(req.completedCredits, req.requiredCredits);
      const reqPercent = percent(req.completedCredits, req.requiredCredits);
      const tone =
        reqRemaining === 0 ? 'text-green-600' : reqRemaining <= 3 ? 'text-amber-600' : 'text-orange-600';

      return (
        <Card key={req.key}>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3>{req.label}</h3>
              <span className="text-sm text-muted-foreground">
                {req.completedCredits}/{req.requiredCredits}학점
              </span>
            </div>
            <Progress value={reqPercent} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">달성도: {reqPercent}%</span>
              <span className={tone}>{reqRemaining === 0 ? '완료' : `${reqRemaining}학점 남음`}</span>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);
