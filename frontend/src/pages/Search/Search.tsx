import React, { useEffect, useMemo, useState } from 'react';
import { listCourses, type CourseOut } from '@/lib/api/courses';

import {
  SearchBar,
  FilterPanel,
  CourseList,
  CourseDetailDialog,
  type FilterState,
  type NormalizedCourse,
} from './components';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('전체');
  const [selectedDay, setSelectedDay] = useState('전체');
  const [selectedTime, setSelectedTime] = useState('전체');
  const [showFilters, setShowFilters] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    balancedGeneral: false,
    basicGeneral: false,
    coreGeneral: false,
    teacherTraining: false,
    generalElective: false,
    majorRequired: false,
    majorElective: false,
  });

  const departments = ['전체', '컴퓨터공학과', '전자공학과', '기계공학과', '화학공학과', '경영학과', '경제학과', '물리학과', '산업운영공학과', '수학과'];
  const days = ['전체', '월', '화', '수', '목', '금'];
  const times = ['전체', '1교시(09:00-10:30)', '2교시(10:30-12:00)', '3교시(13:00-14:30)', '4교시(14:30-16:00)', '5교시(16:00-17:30)'];

  const [apiCourses, setApiCourses] = useState<CourseOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<NormalizedCourse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listCourses({ q: searchQuery, limit: 50 });
        if (active) setApiCourses(data || []);
      } catch (e: any) {
        if (active) setError(e?.message || '검색 중 오류가 발생했습니다');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [searchQuery]);

  const normalized: NormalizedCourse[] = useMemo(() => {
    return apiCourses.map((c: any) => ({
      id: c.course_code || c.course_name || Math.random().toString(36).slice(2),
      name: c.name || c.course_name || '미정',
      professor: c.professor || '미정',
      department: c.group || c.general_type || c.category || '-',
      credits: c.credits ?? c.credit ?? undefined,
      timeslot: c.timeslot ?? c.time ?? '-',
      capacity: c.capacity,
      enrolled: c.enrolled,
      rating: c.rating ?? undefined,
      type: c.category || c.general_type || c.group || '-',
      description: c.description || '-',
      raw: c,
    }));
  }, [apiCourses]);

  const KEY_TO_TAG: Record<string, string> = {
    balancedGeneral: 'balance_general',
    basicGeneral: 'basic_general',
    coreGeneral: 'core_general',
    teacherTraining: 'teacher_training',
    generalElective: 'general_elective',
    majorRequired: 'major_required',
    majorElective: 'major_elective',
  };

  function deriveTags(raw: any): string[] {
    const tags: string[] = [];
    const cat = String(raw?.category ?? '').toLowerCase();
    const gen = String(raw?.general_type ?? '').toLowerCase();
    const grp = String(raw?.group ?? '').toLowerCase();
    const src = String(raw?.source_collection ?? '').toLowerCase();

    if (cat.includes('전공필수')) tags.push('major_required');
    if (cat.includes('전공선택')) tags.push('major_elective');

    if (gen.includes('핵심') || src.includes('core_general')) tags.push('core_general');
    if (gen.includes('균형') || src.includes('balance_general')) tags.push('balance_general');
    if (gen.includes('기초') || src.includes('basic_general')) tags.push('basic_general');

    if (gen.includes('일반선택') || cat.includes('일반선택') || src.includes('courses_normalstudy')) tags.push('general_elective');
    if (gen.includes('교직') || cat.includes('교직')) tags.push('teacher_training');

    if (grp.includes('교양') && !tags.some((t) => t.startsWith('major_'))) {
      if (!tags.includes('core_general') && !tags.includes('balance_general') && !tags.includes('basic_general')) {
        tags.push('general_elective');
      }
    }
    return Array.from(new Set(tags));
  }

  const filteredCourses = useMemo(() => {
    const activeKeys = Object.entries(selectedFilters)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k);

    return normalized.filter((course) => {
      const matchesDepartment = selectedDepartment === '전체' || course.department === selectedDepartment;

      // TODO: selectedDay / selectedTime 실제 필터 로직은 timeslot 파싱 규칙 정해지면 추가
      if (activeKeys.length === 0) return matchesDepartment;

      const tags = deriveTags(course.raw);
      const matchesSelected = activeKeys.some((key) => tags.includes(KEY_TO_TAG[key]));

      return matchesDepartment && matchesSelected;
    });
  }, [normalized, selectedDepartment, selectedFilters]);

  const onFilterChange = (key: keyof FilterState, checked: boolean) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: checked }));
  };

  const onDetail = (course: NormalizedCourse) => {
    setSelectedCourse(course);
    setIsDetailOpen(true);
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1>강의 검색</h1>
        <p className="text-muted-foreground mt-2">키워드로 원하는 강의를 찾아보세요</p>
      </div>

      <div className="space-y-4 mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((v) => !v)}
        />

        {showFilters && (
          <FilterPanel
            departments={departments}
            days={days}
            times={times}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedFilters={selectedFilters}
            onFilterChange={onFilterChange}
          />
        )}
      </div>

      <CourseList courses={filteredCourses} loading={loading} error={error} onDetail={onDetail} />

      <CourseDetailDialog open={isDetailOpen} onOpenChange={setIsDetailOpen} course={selectedCourse} />
    </main>
  );
}
