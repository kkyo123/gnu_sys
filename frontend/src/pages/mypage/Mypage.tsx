import { useEffect, useRef, useState } from 'react';
import { Calendar, Target, TrendingUp, ClipboardCheck, LineChart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { AcademicData, KeywordPrefs, MyPageUser, TimetableCourseStandard } from '../../types/mypage';
import {
  CreditOverview,
  KeywordPreferences,
  MyPageSidebar,
  Timetable,
  TimetableEditSection,
  RequiredCourseList,
  SemesterGpaTrend,
  EnrollmentDebugTable,
} from './components';
import { CourseDebugTable } from './components/CourseDebugTable'; // DEBUG: 테스트용 테이블
import { DAYS, SLOT_COUNT, SLOT_HEIGHT, START_HOUR } from './constants';
import { mockUser, mockAcademicData, mockKeywordPrefs } from './userData';
import { mockCoursesBySemester } from './courseData';
import { toMainTimetable } from './courseTransforms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { getCreditSummary, getKeywords } from '../../lib/api/mypage';
import { mapCreditSummaryToAcademicData, mapKeywordsToPrefs } from './dataTransforms';
import { useEnrollments, useRequiredCourses, useSemesterGpa } from './hooks';
import {
  DEFAULT_SELECTED_SEMESTER,
  MYPAGE_SECTION_IDS,
  SEMESTER_OPTIONS,
  type MyPageSectionId,
} from './config';

interface MyPageProps {
  token: string | null;
  user?: MyPageUser;
  academicData?: AcademicData;
  timetableCourses?: TimetableCourseStandard[];
  keywordPrefs?: KeywordPrefs;
}

export default function Mypage({
  token,
  user,
  academicData = mockAcademicData,
  keywordPrefs = mockKeywordPrefs,
}: MyPageProps) {
  const [academicDataState, setAcademicDataState] = useState<AcademicData | null>(null);
  const [keywordPrefsState, setKeywordPrefsState] = useState<KeywordPrefs | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(token));
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const canFetch = Boolean(token);

  const {
    courses: requiredCourses,
    loading: requiredCoursesLoading,
    error: requiredCoursesError,
    refetch: refetchRequiredCourses,
  } = useRequiredCourses(token);

const {
  semesters: semesterGpa,
  loading: semesterGpaLoading,
  error: semesterGpaError,
  refetch: refetchSemesterGpa,
} = useSemesterGpa(token);

const {
  enrollments,
  loading: enrollmentsLoading,
  error: enrollmentsError,
  refetch: refetchEnrollments,
} = useEnrollments(token);
  const [selectedSemester, setSelectedSemester] = useState<string>(DEFAULT_SELECTED_SEMESTER);
  const [isKeywordEditOpen, setIsKeywordEditOpen] = useState(false);
  const [, setIsProfileEditOpen] = useState(false);
  const [selectedBySemester, setSelectedBySemester] = useState<Record<string, TimetableCourseStandard[]>>(() =>
    Object.fromEntries(Object.entries(mockCoursesBySemester).map(([sem, courses]) => [sem, [...courses]])),
  );

  const semesterCourses = (selectedBySemester[selectedSemester] ?? []).map(toMainTimetable);

  const creditOverviewRef = useRef<HTMLElement>(null);
  const timetableRef = useRef<HTMLElement>(null);
  const preferencesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!canFetch || !token) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [creditSummary, keywords] = await Promise.all([
          getCreditSummary(token),
          getKeywords(token),
        ]);
        if (cancelled) return;
        setAcademicDataState(mapCreditSummaryToAcademicData(creditSummary));
        setKeywordPrefsState(mapKeywordsToPrefs(keywords));
      } catch (err) {
        if (cancelled) return;
        // eslint-disable-next-line no-console
        console.error('[mypage] failed to load data', err);
        setError('마이페이지 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void fetchData();
    return () => {
      cancelled = true;
    };
  }, [canFetch, token, reloadKey]);

  const handleRetry = () => setReloadKey((prev) => prev + 1);

  const creditData = academicDataState ?? academicData;
  const keywordData = keywordPrefsState ?? keywordPrefs;
  const completedRequiredCount = requiredCourses.filter((course) => course.is_completed).length;
  const totalRequiredCount = requiredCourses.length;

  if (!token) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">인증 정보가 없어 마이페이지를 불러올 수 없습니다.</p>
      </main>
    );
  }

  const scrollToSection = (id: MyPageSectionId) => {
    const refMap: Record<MyPageSectionId, React.RefObject<HTMLElement>> = {
      [MYPAGE_SECTION_IDS.creditOverview]: creditOverviewRef,
      [MYPAGE_SECTION_IDS.timetable]: timetableRef,
      [MYPAGE_SECTION_IDS.preferences]: preferencesRef,
    };
    const target = refMap[id]?.current;
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSaveSemesterCourses = (semester: string, courses: TimetableCourseStandard[]) => {
    setSelectedBySemester((prev) => ({ ...prev, [semester]: courses }));
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-row gap-4 max-w-6xl mx-auto px-4">
        <aside>
          <MyPageSidebar
            user={user}
            academicData={creditData}
            selectedKeywords={keywordData.selected}
            scrollToSection={scrollToSection}
            setIsProfileEditOpen={setIsProfileEditOpen}
            setIsKeywordEditOpen={setIsKeywordEditOpen}
          />
        </aside>

        <section className="w-1/2 min-w-0">
          <div className="text-white">---------------------------------------------------------------------------------------</div>
        </section>

        <section className="flex-col space-y-4 m-y-4 py-4">
          <section ref={creditOverviewRef} id={MYPAGE_SECTION_IDS.creditOverview} className="space-y-3">
            <h2 className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              학점 이수 현황
            </h2>
            {isLoading ? (
              <div className="space-y-4 rounded-lg border border-border p-6 animate-pulse">
                <div className="h-8 w-1/3 bg-muted rounded" />
                <div className="h-48 bg-muted rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="h-20 bg-muted rounded" />
                  ))}
                </div>
              </div>
            ) : (
              <CreditOverview academicData={creditData} />
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2">
                <ClipboardCheck className="h-6 w-6 text-primary" />
                전공 필수 과목
              </h2>
              <span className="text-sm text-muted-foreground">
                {completedRequiredCount}/{totalRequiredCount}과목 이수
              </span>
            </div>
            {requiredCoursesError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center justify-between gap-2">
                <span>{requiredCoursesError}</span>
                <button type="button" className="underline" onClick={() => void refetchRequiredCourses()}>
                  다시 시도
                </button>
              </div>
            )}
            {requiredCoursesLoading ? (
              <div className="rounded-lg border border-border p-6 animate-pulse space-y-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 flex-1 mx-4 bg-muted rounded" />
                    <div className="h-4 w-20 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <RequiredCourseList courses={requiredCourses} />
            )}
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2">
              <LineChart className="h-6 w-6 text-primary" />
              학기별 GPA
            </h2>
            {semesterGpaError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center justify-between gap-2">
                <span>{semesterGpaError}</span>
                <button type="button" className="underline" onClick={() => void refetchSemesterGpa()}>
                  다시 시도
                </button>
              </div>
            )}
            {semesterGpaLoading ? (
              <div className="rounded-lg border border-border p-6 animate-pulse space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-2 w-full bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <SemesterGpaTrend semesters={semesterGpa} />
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                수강 데이터 (DEBUG)
              </h2>
              <button
                type="button"
                className="text-xs text-primary underline-offset-2 hover:underline"
                onClick={() => void refetchEnrollments()}
              >
                새로고침
              </button>
            </div>
            {enrollmentsError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center justify-between gap-2">
                <span>{enrollmentsError}</span>
                <button type="button" className="underline" onClick={() => void refetchEnrollments()}>
                  다시 시도
                </button>
              </div>
            )}
            {enrollmentsLoading ? (
              <div className="rounded-lg border border-border p-4 animate-pulse space-y-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 w-16 bg-muted rounded" />
                    <div className="h-4 w-16 bg-muted rounded" />
                    <div className="h-4 w-12 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <EnrollmentDebugTable enrollments={enrollments} studentId={user?.id} />
                <p className="text-xs text-muted-foreground">
                  실제 마이페이지 UI 연동 전 데이터를 확인하기 위한 임시 표입니다.
                </p>
              </>
            )}
          </section>

          <section ref={timetableRef} id={MYPAGE_SECTION_IDS.timetable} className="space-y-3 my-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                학기별 시간표
              </h2>
              <div className="flex items-center gap-3">
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTER_OPTIONS.map((sem) => (
                      <SelectItem key={sem.value} value={sem.value}>
                        {sem.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TimetableEditSection
                  currentSemester={selectedSemester}
                  selectedBySemester={selectedBySemester}
                  onSaveSemesterCourses={handleSaveSemesterCourses}
                  onSemesterChange={setSelectedSemester}
                />
              </div>
            </div>

            <Timetable
              days={DAYS}
              startHour={START_HOUR}
              slotCount={SLOT_COUNT}
              slotHeight={SLOT_HEIGHT}
              courses={semesterCourses}
            />

            <CourseDebugTable
              title={`DEBUG 강의 리스트 (${selectedSemester})`}
              courses={selectedBySemester[selectedSemester] ?? []}
            />
          </section>

          <section ref={preferencesRef} id={MYPAGE_SECTION_IDS.preferences} className="space-y-4">
            <h2 className="mb-2 flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              선호 키워드 관리
            </h2>
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center justify-between gap-2">
                <span>{error}</span>
                <button type="button" className="text-red-700 underline" onClick={handleRetry}>
                  다시 시도
                </button>
              </div>
            )}
            {!error && isLoading ? (
              <div className="rounded-lg border border-border p-6 animate-pulse space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx}>
                    <div className="h-4 w-32 bg-muted rounded mb-2" />
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-muted rounded-full" />
                      <div className="h-6 w-16 bg-muted rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <KeywordPreferences prefs={keywordData} onEdit={() => setIsKeywordEditOpen(true)} />
            )}
          </section>
        </section>
      </div>

      <Dialog open={isKeywordEditOpen} onOpenChange={setIsKeywordEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">선호 키워드 수정</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
