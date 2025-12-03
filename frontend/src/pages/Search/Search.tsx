import React, { useEffect, useMemo, useState } from 'react';
import { Search as SearchIcon, Filter, Clock, User, Star, BookOpen, Users, FileText, Award } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Separator } from '../../components/ui/separator';
import { listCourses, type CourseOut } from '../../lib/api/courses';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    balancedGeneral: false,
    basicGeneral: false,
    coreGeneral: false,
    teacherTraining: false,
    generalElective: false,
    majorRequired: false,
    majorElective: false,
  });
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const departments = [
    '전체', '컴퓨터공학과', '전자공학과', '기계공학과', '화학공학과',
    '경영학과', '경제학과', '물리학과', '산업운영공학과', '수학과'
  ];

  const days = ['전체', '월', '화', '수', '목', '금'];
  const times = ['전체', '1교시(09:00-10:30)', '2교시(10:30-12:00)', '3교시(13:00-14:30)', '4교시(14:30-16:00)', '5교시(16:00-17:30)'];

  const [apiCourses, setApiCourses] = useState<CourseOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const normalized = useMemo(() => {
    return apiCourses.map((c) => ({
      id: (c as any).course_code || c.course_name || Math.random().toString(36).slice(2),
      name: (c as any).name || c.course_name || '미정',
      professor: c.professor || '미정',
      department: (c as any).group || (c as any).general_type || c.category || '-',
      credits: (c as any).credits ?? (c as any).credit ?? (c as any).credits ?? undefined,
      timeslot: (c as any).timeslot ?? (c as any).time ?? '-',
      capacity: (c as any).capacity,
      enrolled: (c as any).enrolled,
      rating: (c as any).rating || undefined,
      type: c.category || (c as any).general_type || (c as any).group || '-',
      description: (c as any).description || '-',
      raw: c,
    }));
  }, [apiCourses]);

  const firstCourse = useMemo(() => apiCourses[0] ?? null, [apiCourses]);

  const firstCourseKeywordRows = useMemo(() => {
    if (!firstCourse) return [];
    const raw: any = firstCourse;
    const formatValue = (value?: string[] | string) => {
      if (!value) return undefined;
      if (Array.isArray(value)) return value.join(', ');
      if (typeof value === 'string') {
        return value
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean)
          .join(', ');
      }
      return undefined;
    };
    return [
      { label: 'plan', value: formatValue(raw?.plan_keywords) },
      { label: 'test', value: formatValue(raw?.test_keywords) },
      { label: 'assignment', value: formatValue(raw?.assignment_keywords) },
      { label: 'method', value: formatValue(raw?.method_keywords) },
      { label: 'etc', value: formatValue(raw?.etc_keywords) },
    ];
  }, [firstCourse]);

  const firstCourseRows = useMemo(() => {
    if (!firstCourse) return [];
    const raw: any = firstCourse;
    return [
      { label: 'requirement_id', value: firstCourse.requirement_id },
      { label: 'category', value: firstCourse.category },
      { label: 'course_name', value: firstCourse.course_name },
      { label: 'course_code', value: firstCourse.course_code },
      { label: 'professor', value: firstCourse.professor },
      { label: 'timeslot', value: raw?.timeslot ?? raw?.time },
      { label: 'credits', value: firstCourse.credits },
      { label: 'class', value: raw?.class ?? raw?.cls },
      { label: 'group', value: raw?.group },
      { label: 'year', value: firstCourse.year },
      { label: 'major_track', value: firstCourse.major_track },
      { label: 'general_type', value: firstCourse.general_type },
      { label: 'source_collection', value: firstCourse.source_collection },
      { label: 'source_sheet', value: firstCourse.source_sheet },
      { label: '비고', value: raw?.비고 },
      { label: '설명', value: raw?.설명 ?? raw?.description },
      
    ];
  }, [firstCourse]);

  // 체크박스 필터 키와 실제 데이터상의 유형 문자열 매핑
  // 1) 키를 표준 태그로 매핑 (프런트 고정 키 → 표준 태그)
  const KEY_TO_TAG: Record<string, string> = {
    balancedGeneral: 'balance_general',
    basicGeneral: 'basic_general',
    coreGeneral: 'core_general',
    teacherTraining: 'teacher_training',
    generalElective: 'general_elective',
    majorRequired: 'major_required',
    majorElective: 'major_elective',
  };

  // 2) 과목 raw 데이터에서 표준 태그를 유도
  function deriveTags(raw: any): string[] {
    const tags: string[] = [];
    const cat = String(raw?.category ?? '').toLowerCase();
    const gen = String(raw?.general_type ?? '').toLowerCase();
    const grp = String(raw?.group ?? '').toLowerCase();
    const src = String(raw?.source_collection ?? '').toLowerCase();

    // 전공
    if (cat.includes('전공필수')) tags.push('major_required');
    if (cat.includes('전공선택')) tags.push('major_elective');

    // 교양 (핵심/균형/기초) - 한글/영문/띄어쓰기/컬렉션명 모두 대응
    if (gen.includes('핵심') || gen.includes('핵심 교양') || src.includes('core_general')) tags.push('core_general');
    if (gen.includes('균형') || gen.includes('균형 교양') || src.includes('balance_general')) tags.push('balance_general');
    if (gen.includes('기초') || gen.includes('기초 교양') || src.includes('basic_general')) tags.push('basic_general');

    // 일반선택/교직
    if (gen.includes('일반선택') || src.includes('courses_normalstudy') || cat.includes('일반선택')) tags.push('general_elective');
    if (gen.includes('교직') || src.includes('courses_normalstudy') || cat.includes('교직')) tags.push('teacher_training');

    // 보조: group이 교양이면 일반선택일 가능성 보조 처리(과도한 매칭 방지 위해 중복만 허용)
    if (grp.includes('교양') && !tags.some(t => t.startsWith('major_'))) {
      // 이미 특정 교양 태그가 있으면 유지, 없으면 일반선택 후보로만 추가
      if (!tags.includes('core_general') && !tags.includes('balance_general') && !tags.includes('basic_general')) {
        if (!tags.includes('general_elective')) tags.push('general_elective');
      }
    }
    return Array.from(new Set(tags));
  }

  const filteredCourses = useMemo(() => {
    const activeKeys = Object.entries(selectedFilters)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k);

    return normalized.filter((course) => {
      const matchesDepartment = !selectedDepartment || selectedDepartment === '전체' || course.department === selectedDepartment;

      // 체크박스가 하나도 선택되지 않았으면 유형 필터는 통과
      if (activeKeys.length === 0) return matchesDepartment;

      const tags = deriveTags((course as any).raw || course);
      const matchesSelected = activeKeys.some((key) => tags.includes(KEY_TO_TAG[key]));

      return matchesDepartment && matchesSelected;
    });
  }, [normalized, selectedDepartment, selectedFilters]);

  const handleFilterChange = (filter: string, checked: boolean) => {
    setSelectedFilters(prev => ({ ...prev, [filter]: checked }));
  };

  const handleCourseDetail = (course: any) => {
    setSelectedCourse(course);
    setIsDetailOpen(true);
  };

  const getCourseDetails = (course: any) => {
    const keywordMap: { [key: number]: string[] } = {
      1: ['자료구조', '프로그래밍', '코딩', '알고리즘', '메모리관리', '객체지향'],
      2: ['통계', '확률', '프로그래밍', '컴퓨터구조', '소프트웨어', '네트워크'],
      3: ['수학', '논리', '공학', '기계학습', '운영환경', '데이터'],
      4: ['물리', '화학', '컴퓨팅', '인공지능', '분산시스템', '보안'],
      5: ['SQL', '데이터모델링', '정규화', 'DBMS', '데이터처리', '정보화']
    };

    return {
      ...course,
      prerequisites: course.id === 1 ? ['프로그래밍입문'] : course.id === 5 ? ['자료구조'] : [],
      keywords: keywordMap[course.id] || ['학습', '이론', '실습', '응용'],
      assessmentMethod: {
        midterm: 30,
        final: 30,
        assignment: 25,
        attendance: 15
      },
      syllabus: `${course.name}의 강의개요입니다.`,
      reviews: Math.floor(Math.random() * 50) + 20,
      difficulty: course.rating > 4.5 ? '어려움' : course.rating > 4.0 ? '보통' : '쉬움'
    };
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1>강의 검색</h1>
        <p className="text-muted-foreground mt-2">키워드로 원하는 강의를 찾아보세요</p>
      </div>
      {/* --- BEGIN: First Course Quick View (temporary)}
      {firstCourse && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>강의 검색 첫 번째 결과 상세</CardTitle>
            <CardDescription>현재 검색 조건으로 반환된 첫 번째 강의 정보를 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <tbody>
                  {[...firstCourseRows, ...firstCourseKeywordRows].map((row) => (
                    <tr key={row.label} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-semibold text-muted-foreground text-xs uppercase">{row.label}</td>
                      <td className="py-2">{row.value ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      {/* --- END: First Course Quick View (temporary) --- */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="강의명, 교수명으로 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            필터
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>학과</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="학과 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>요일</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="요일 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>시간</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="시간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {times.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">분류</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(selectedFilters).map(([key, checked]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={checked}
                        onCheckedChange={(v) => handleFilterChange(key, Boolean(v))}
                      />
                      <Label htmlFor={key} className="text-sm">
                        {key === 'balancedGeneral' && '균형교양'}
                        {key === 'basicGeneral' && '기초교양'}
                        {key === 'coreGeneral' && '핵심교양'}
                        {key === 'teacherTraining' && '교직'}
                        {key === 'generalElective' && '일반선택'}
                        {key === 'majorRequired' && '전공필수'}
                        {key === 'majorElective' && '전공선택'}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">

        <div className="grid gap-4">
          {loading && (
            <Card><CardContent className="pt-6">불러오는 중...</CardContent></Card>
          )}
          {error && !loading && (
            <Card><CardContent className="pt-6 text-red-600">{error}</CardContent></Card>
          )}
          {!loading && !error && filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3>{course.name}</h3>
                      {course.type && <Badge variant="secondary">{course.type}</Badge>}
                      {course.raw?.course_code && (course.raw?.cls ?? course.raw?.class) && (
                        <span className="text-xs text-muted-foreground">
                          · {course.raw.course_code} - {(course.raw?.cls ?? course.raw?.class) as string}{' '}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">강의설명</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{course.credits ? (course.credits + '학점') : 'n학점'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{course.professor || '교수명'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{course.timeslot || '강의시간'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleCourseDetail(course)}>상세보기</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCourse && (() => {
            const details = getCourseDetails(selectedCourse);
            return (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-2xl mb-2">{selectedCourse.name}</DialogTitle>
                      <DialogDescription className="flex items-center space-x-2">
                        <Badge variant="secondary">{selectedCourse.type}</Badge>
                        <span>·</span>
                        {selectedCourse.raw?.course_code && (selectedCourse.raw?.cls ?? selectedCourse.raw?.class) &&(
                          <>
                            <span>
                              {selectedCourse.raw.course_code} - {(selectedCourse.raw?.cls ?? selectedCourse.raw?.class) as string}
                            </span>
                            </>
                          )}
                        
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-6 mt-4 ml-2 mr-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">교수명</p>
                          <p>{selectedCourse.professor}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">시간표</p>
                          <p>{selectedCourse.timeslot}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">학점</p>
                          <p>{selectedCourse.credits}학점</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4" />
                      <span>강의 소개</span>
                    </h4>
                    <p className="text-muted-foreground">{selectedCourse.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-3">관련 키워드</h4>
                    <div className="flex flex-wrap gap-2">
                      {details.keywords.map((keyword: string) => (
                        <Badge key={keyword} variant="secondary" className="px-3 py-1">{keyword}</Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex space-x-2 pt-4">
                    <Button className="flex-1" disabled={selectedCourse.enrolled >= selectedCourse.capacity}>수강신청</Button>
                    <Button variant="outline" className="flex-1">강의계획서 보기</Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </main>
  );
}
