import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Certification } from '../../../types/graduation';

interface CertificationCardProps {
  certifications: Certification[];
}

export const CertificationCard: React.FC<CertificationCardProps> = ({ certifications }) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>졸업인증제 현황</CardTitle>
        <Button variant="ghost" size="sm">
          상세 보기
        </Button>
      </div>
    </CardHeader>

    <CardContent className="space-y-4">
      {certifications.map((cert) => {
        const allItemsCompleted = cert.items?.every((item) => item.completed);
        const isComplete = cert.items && cert.requiredCount
          ? cert.items.filter((i) => i.completed).length >= cert.requiredCount
          : cert.completed || Boolean(allItemsCompleted);

        const completedCount = cert.items?.filter((i) => i.completed).length ?? 0;
        const totalCount = cert.items?.length ?? 0;

        return (
          <div key={cert.id} className="space-y-3">
            {/* 🔹 1) 제목 박스 (단독 카드) */}
            <div
              className={`p-4 rounded-lg border-2 ${
                isComplete ? 'bg-green-50 border-green-200' : 'bg-muted/30 border-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                {isComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                )}
                <div className="flex flex-col">
                  <span className={isComplete ? 'text-green-700' : 'text-muted-foreground'}>
                    {cert.title}
                  </span>

                  {cert.requiredCount && cert.items && (
                    <span className="text-xs text-muted-foreground">
                      {cert.requiredCount}개 이상 이수 필요 · 완료 {completedCount}/{totalCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 🔹 2) item 박스들 – 제목 박스 “밖에서” 세로로 주르륵 */}
            {cert.items && cert.items.length > 0 && (
              <div className="px-4 space-y-2">
                {cert.items.map((item) => {
                  const itemComplete = item.completed;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border-2 ${
                        itemComplete ? 'bg-green-50 border-green-200' : 'bg-muted/30 border-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {itemComplete ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                        )}
                        <span className={itemComplete ? 'text-green-700' : 'text-muted-foreground'}>
                          {item.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </CardContent>
  </Card>
);
