import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BalancedArea } from '@/types/graduation';

interface BalancedAreasCardProps {
  areas: BalancedArea[];
}

export const BalancedAreasCard: React.FC<BalancedAreasCardProps> = ({ areas }) => {
  const completedCount = areas.filter((a) => a.completedCredits >= a.requiredCredits).length;
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>균형교양 영역 ({completedCount}/{areas.length} 영역 이수)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {areas.map((area) => {
            const done = area.completedCredits >= area.requiredCredits;
            return (
              <div
                key={area.id}
                className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-colors ${
                  done ? 'bg-green-50 border-green-200' : 'bg-muted/30 border-muted'
                }`}
              >
                {done ? (
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                )}
                <div className="flex flex-col text-sm">
                  <span className={done ? 'text-green-700' : 'text-muted-foreground'}>{area.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
