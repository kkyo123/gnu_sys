// src/pages/Search/Graduation.tsx

import React, { useState } from 'react';
import { graduationData as initialData } from '../../data/graduation';
import type {
  Certification,
  GraduationData,
  CourseRecommendation,
} from '../../types/graduation';

import { BalancedAreasCard } from './components/BalancedAreasCard';
import { CertificationCard } from './components/CertificationCard';
import { GraduationOverview } from './components/GraduationOverview';
import { RecommendedCourses } from './components/RecommendedCourses';
import { RequirementGrid } from './components/RequirementGrid';

import LectureDetailModal from '../../components/LectureDetailModal';
import type { CourseOut } from '../../components/lectureCard';

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL as string;

interface GraduationProps {
  token: string | null;
  user: any | null;
}

const Graduation: React.FC<GraduationProps> = ({ token, user }) => {
  const [data, setData] = useState<GraduationData>(initialData);
  const { summary, requirements, balancedAreas, certifications, recommendedCourses } = data;

  const [selectedCourse, setSelectedCourse] = useState<CourseOut | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!token || !user) {
    return (
      <main className="container mx-auto px-4 py-6">
        <p className="text-muted-foreground">로그인 정보가 없습니다.</p>
      </main>
    );
  }

  const studentId: string = user.student_id;

  const handleSaveCertifications = (nextCertifications: Certification[]) => {
    setData((prev) => ({
      ...prev,
      certifications: nextCertifications,
    }));
  };

  const handleCourseDetail = (rec: CourseRecommendation) => {
    console.log("🔍 [Graduation] detail click:", rec);

    const modalCourse: CourseOut = {
      course_name: rec.title,
      course_code: rec.id,
      professor: rec.professor,
      category: rec.category,
      group: null,
      설명란: rec.description,
      비고: null,
      requirement_id: null,
      general_type: null,
      major_track: null,
      source_collection: null,
      source_sheet: null,
      year: null,
    };

    console.log("📦 [Graduation] modalCourse:", modalCourse);

    setSelectedCourse(modalCourse);
    setIsModalOpen(true);
  };

  const handleAddInterest = async (rec: CourseRecommendation) => {
    const payload = {
      student_id: studentId,
      tab: 'graduation' as const,
      course_code: rec.id,
      course_name: rec.title,
      professor: rec.professor,
      credits: rec.credits,
    };

    try {
      const res = await fetch(`${API_BASE}/mypage/interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("📥 [Graduation interest] status:", res.status, text);

      if (!res.ok) {
        window.alert('관심과목 등록 중 오류가 발생했습니다.');
        return;
      }

      window.alert('등록이 완료되었습니다.');
    } catch (err) {
      console.error(err);
      window.alert('관심과목 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">졸업 관리</h1>
          <p className="text-muted-foreground mt-2">
            졸업 요건을 실시간으로 확인하고 맞춤 추천을 받아보세요.
          </p>
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

        <RecommendedCourses
          courses={recommendedCourses}
          visibleCount={3}
          onCourseDetail={handleCourseDetail}
          onAddInterest={handleAddInterest}
        />
      </main>

      <LectureDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        studentId={studentId}
        sourceTab="graduation"
        token={token}        // ✔ 여기 중요
      />
    </>
  );
};

export default Graduation;
