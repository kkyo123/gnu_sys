import React, { useState } from 'react';
import { graduationData as initialData } from '../../data/graduation';
import { Certification, GraduationData } from '../../types/graduation';
import { BalancedAreasCard } from './components/BalancedAreasCard';
import { CertificationCard } from './components/CertificationCard';
import { GraduationOverview } from './components/GraduationOverview';
import { RecommendedCourses } from './components/RecommendedCourses';
import { RequirementGrid } from './components/RequirementGrid';

const Graduation: React.FC = () => {
  const [data, setData] = useState<GraduationData>(initialData);
  const { summary, requirements, balancedAreas, certifications, recommendedCourses } = data;

  const handleSaveCertifications = (nextCertifications: Certification[]) => {
    setData((prev) => ({
      ...prev,
      certifications: nextCertifications,
    }));
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">졸업 관리</h1>
        <p className="text-muted-foreground mt-2">졸업 요건을 실시간으로 확인하고 맞춤 추천을 받아보세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GraduationOverview summary={summary} className="col-span-1" />
        <RequirementGrid
          requirements={requirements}
          className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
        />
      </div>

      <BalancedAreasCard areas={balancedAreas} />
      <CertificationCard certifications={certifications} onSave={handleSaveCertifications} />
      <RecommendedCourses courses={recommendedCourses} visibleCount={3} />
    </main>
  );
};

export default Graduation;
