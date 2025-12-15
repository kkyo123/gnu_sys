import React, { useEffect, useRef, useState } from 'react';
import { CreditOverview } from './components';
import { mapCreditSummaryToAcademicData } from './utils/mapCreditSummary';
import type { AcademicData } from '@/types/mypage';
import { getCreditSummary } from '@/lib/api/mypage';

interface CreditOverviewSectionProps {
  token: string;
  onDataLoaded?: (data: AcademicData) => void;
}

export const CreditOverviewSection: React.FC<CreditOverviewSectionProps> = ({ token, onDataLoaded }) => {
  const [data, setData] = useState<AcademicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const latestOnDataLoaded = useRef<typeof onDataLoaded>();

  useEffect(() => {
    latestOnDataLoaded.current = onDataLoaded;
  }, [onDataLoaded]);

  useEffect(() => {
    let cancelled = false;

    const fetchCreditSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCreditSummary(token);
        if (cancelled) return;
        const mapped = mapCreditSummaryToAcademicData(response);
        setData(mapped);
        latestOnDataLoaded.current?.(mapped);
      } catch (err) {
        if (!cancelled) {
          console.error('[mypage] credit summary fetch failed', err);
          setError('학점 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCreditSummary();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-4 rounded-lg border border-border p-6 animate-pulse">
        <div className="h-8 w-1/3 bg-muted rounded" />
        <div className="h-48 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="h-20 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (!data) return null;

  return <CreditOverview academicData={data} />;
};
