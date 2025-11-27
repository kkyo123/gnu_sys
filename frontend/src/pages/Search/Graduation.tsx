import React from 'react';
import { graduationData } from '../../data/graduation';
import { BalancedAreasCard } from './components/BalancedAreasCard';
import { CertificationCard } from './components/CertificationCard';
import { GraduationOverview } from './components/GraduationOverview';
import { RecommendedCourses } from './components/RecommendedCourses';
import { RequirementGrid } from './components/RequirementGrid';

const Graduation: React.FC = () => {
  const { summary, requirements, balancedAreas, certifications, recommendedCourses } = graduationData;

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">졸업 관리</h1>
        <p className="text-muted-foreground mt-2">졸업 요건을 실시간으로 확인하고 맞춤 추천을 받아보세요.</p>
      </div>

      <GraduationOverview summary={summary} />
      <RequirementGrid requirements={requirements} />
      <BalancedAreasCard areas={balancedAreas} />
      <CertificationCard certifications={certifications} />
      <RecommendedCourses courses={recommendedCourses} visibleCount={3} />
    </main>
  );
};

export default Graduation;
