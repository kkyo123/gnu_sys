import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Certification } from '@/types/graduation';

interface CertificationCardProps {
  certifications: Certification[];
  onSave?: (nextCertifications: Certification[]) => void;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({ certifications, onSave }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [draftCerts, setDraftCerts] = useState<Certification[]>(certifications);

  useEffect(() => {
    if (!showDetails) {
      setDraftCerts(certifications);
    }
  }, [certifications, showDetails]);

  const displayCerts = showDetails ? draftCerts : certifications;

  const toggleCertification = (certId: string) => {
    if (!showDetails) return;

    setDraftCerts((prev) =>
      prev.map((cert) => {
        if (cert.id !== certId) return cert;
        // items가 없는 인증만 직접 토글, 세부 항목이 있는 경우는 항목으로만 제어
        if (cert.items && cert.items.length > 0) {
          return cert;
        }
        return { ...cert, completed: !cert.completed };
      })
    );
  };

  const toggleItem = (certId: string, itemId: string) => {
    if (!showDetails) return;
    setDraftCerts((prev) =>
      prev.map((cert) =>
        cert.id === certId
          ? {
              ...cert,
              items: cert.items?.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : cert
      )
    );
  };

  const handleOpenDetails = () => {
    setDraftCerts(certifications);
    setShowDetails(true);
  };

  const handleCancel = () => {
    setDraftCerts(certifications);
    setShowDetails(false);
  };

  const handleSave = () => {
    onSave?.(draftCerts);
    setShowDetails(false);
  };

  const isCertificationComplete = (cert: Certification) => {
    const allItemsCompleted = cert.items?.every((item) => item.completed);
    return cert.items && cert.requiredCount
      ? (cert.items.filter((i) => i.completed).length >= cert.requiredCount)
      : cert.completed || Boolean(allItemsCompleted);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>졸업인증제 현황</CardTitle>

          {!showDetails ? (
            <Button variant="ghost" size="sm" onClick={handleOpenDetails}>
              수정 하기
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                취소
              </Button>
              <Button size="sm" onClick={handleSave}>
                저장
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {displayCerts.map((cert) => {
          const isComplete = isCertificationComplete(cert);

          return (
            <div key={cert.id} className="space-y-2">
              <div
                role={showDetails ? 'button' : undefined}
                tabIndex={showDetails ? 0 : -1}
                onClick={() => toggleCertification(cert.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCertification(cert.id);
                  }
                }}
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
                        {cert.requiredCount}개 이상 이수 필요
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {showDetails && cert.items && cert.items.length > 0 && (
                <div className="px-4  space-y-2">
                  {cert.items.map((item) => {
                    const itemComplete = item.completed;
                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleItem(cert.id, item.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleItem(cert.id, item.id);
                          }
                        }}
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
};
