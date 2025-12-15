import { useEffect, useRef, useState } from 'react';
import { Calendar, Target, TrendingUp, ClipboardCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AcademicData, KeywordPrefs, MyPageUser, TimetableCourseStandard } from '@/types/mypage';
import {
  KeywordPreferences,
  MyPageSidebar,
  Timetable,
  TimetableEditSection,
  RequiredCourseList,
  SemesterGpaTrend,
  EnrollmentDebugTable,
} from './components';
import { CourseDebugTable } from './components/CourseDebugTable';
import { DAYS, SLOT_COUNT, SLOT_HEIGHT, START_HOUR } from './data';
import { toMainTimetable } from './transforms/courseTransforms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getKeywords, getMyTimetable } from '@/lib/api/mypage';
import { mapKeywordsToPrefs } from '@mypage/transforms/dataTransforms';
import { useEnrollments, useRequiredCourses, useSemesterGpa } from './sections/hooks';
import { CreditOverviewSection } from './sections/CreditOverviewSection';
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

const emptyKeywordPrefs: KeywordPrefs = mapKeywordsToPrefs([]);

export default function Mypage({ token, user, academicData, keywordPrefs }: MyPageProps) {
  const [academicDataState, setAcademicDataState] = useState<AcademicData | null>(null);
  const [keywordPrefsState, setKeywordPrefsState] = useState<KeywordPrefs | null>(null);
  const [keywordsLoading, setKeywordsLoading] = useState<boolean>(() => Boolean(token));
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

  const [selectedSemester, setSelectedSemester] = useState(DEFAULT_SELECTED_SEMESTER);
  const [isKeywordEditOpen, setIsKeywordEditOpen] = useState(false);
  const [, setIsProfileEditOpen] = useState(false);

  const parseSemesterKey = (value: string) => {
    const [yearStr, semStr] = value.split('-');
    return {
      year: Number(yearStr),
      semester: Number(semStr),
    };
  };

  const [selectedBySemester, setSelectedBySemester] = useState<Record<string, TimetableCourseStandard[]>>({});
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [timetableError, setTimetableError] = useState<string | null>(null);
  const [timetableReloadKey, setTimetableReloadKey] = useState(0);

  const semesterCourses = (selectedBySemester[selectedSemester] ?? []).map(toMainTimetable);

  const creditOverviewRef = useRef<HTMLElement>(null);
  const timetableRef = useRef<HTMLElement>(null);
  const preferencesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!canFetch || !token) {
      setKeywordsLoading(false);
      return;
    }
    let cancelled = false;
    const fetchKeywords = async () => {
      setKeywordsLoading(true);
      setError(null);
      try {
        const keywords = await getKeywords(token);
        if (cancelled) return;
        setKeywordPrefsState(mapKeywordsToPrefs(keywords));
      } catch (err) {
        if (cancelled) return;
        console.error('[mypage] failed to load keywords', err);
        setError('선호 키워드 정보를 불러오지 못했어요. 다시 시도해 주세요.');
      } finally {
        if (!cancelled) setKeywordsLoading(false);
      }
    };
    void fetchKeywords();
    return () => {
      cancelled = true;
    };
  }, [canFetch, token, reloadKey]);

  const fetchTimetable = async () => {
    if (!token) return;
    const { year, semester } = parseSemesterKey(selectedSemester);
    setTimetableLoading(true);
    setTimetableError(null);
    try {
      const data = await getMyTimetable(token, {
        year,
        semester,
        includeCompleted: false,
      });
      setSelectedBySemester((prev) => ({
        ...prev,
        [selectedSemester]: data,
      }));
    } catch (err) {
      console.error('[mypage] failed to load timetable', err);
      setTimetableError('시간표 정보를 불러오지 못했어요. 다시 시도해 주세요.');
    } finally {
      setTimetableLoading(false);
    }
  };

  useEffect(() => {
    void fetchTimetable();
  }, [token, selectedSemester, timetableReloadKey]);

  const handleRetry = () => setReloadKey((prev) => prev + 1);

  const creditData = academicDataState ?? academicData ?? null;
  const keywordData: KeywordPrefs = keywordPrefsState ?? keywordPrefs ?? emptyKeywordPrefs;

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
            <CreditOverviewSection token={token} onDataLoaded={(data) => setAcademicDataState(data)} />
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

            {timetableError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center justify-between gap-2">
                <span>{timetableError}</span>
                <button
                  type="button"
                  className="underline"
                  onClick={() => setTimetableReloadKey((prev) => prev + 1)}
                >
                  다시 시도
                </button>
              </div>
            )}

            {timetableLoading ? (
              <div className="rounded-lg border border-border p-6 animate-pulse space-y-3">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-40 bg-muted rounded" />
              </div>
            ) : (
              <>
                <Timetable
                  days={DAYS}
                  startHour={START_HOUR}
                  slotCount={SLOT_COUNT}
                  slotHeight={SLOT_HEIGHT}
                  courses={semesterCourses}
                />

                
              </>
            )}
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
            {!error && keywordsLoading ? (
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
            <DialogTitle className="text-xl font-semibold">선호 키워드 설정</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
