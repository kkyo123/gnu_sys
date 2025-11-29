import { useRef, useState } from 'react';
import { TrendingUp, Calendar, Edit, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import type { AcademicData, KeywordPrefs, MyPageUser, TimetableCourse } from '../../types/mypage';
import { CreditOverview, Timetable, KeywordPreferences, MyPageSidebar } from './components';
import { DAYS, SLOT_COUNT, SLOT_HEIGHT, START_HOUR } from './constants';
import { academicDataMock, keywordPrefsMock, timetableCoursesMock } from './mockData';

interface MyPageProps {
  user?: MyPageUser;
  academicData?: AcademicData;
  timetableCourses?: TimetableCourse[];
  keywordPrefs?: KeywordPrefs;
}

export default function Mypage({
  academicData = academicDataMock,
  timetableCourses = timetableCoursesMock,
  keywordPrefs = keywordPrefsMock,
}: Omit<MyPageProps, 'user'>) {
  const [selectedSemester, setSelectedSemester] = useState('2025-1');
  const [, setIsTimetableEditOpen] = useState(false); // TODO: Dialog 연결
  const [, setIsKeywordEditOpen] = useState(false); // TODO: Dialog 연결
  const [, setIsProfileEditOpen] = useState(false); // TODO: Dialog 연결

  const creditOverviewRef = useRef<HTMLElement>(null);
  const timetableRef = useRef<HTMLElement>(null);
  const preferencesRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: string) => {
    let ref: HTMLElement | null = null;
    switch (id) {
      case 'credit-overview':
        ref = creditOverviewRef.current;
        break;
      case 'timetable':
        ref = timetableRef.current;
        break;
      case 'preferences':
        ref = preferencesRef.current;
        break;
    }
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="flex">
        {/* 사이드바 */}
        <MyPageSidebar
          user={undefined}
          academicData={academicData}
          selectedKeywords={keywordPrefs.selected}
          scrollToSection={scrollToSection}
          setIsProfileEditOpen={setIsProfileEditOpen}
          setIsKeywordEditOpen={setIsKeywordEditOpen}
        />

        {/* 메인 콘텐츠 */}
        <div
          className="mx-auto px-6 py-4 space-y-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* SECTION A — 학점 이수 현황 */}
          <section ref={creditOverviewRef} id="credit-overview" className="space-y-6">
            <h2 className="mb-2 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              학점 이수 현황
            </h2>
            <CreditOverview academicData={academicData} />
          </section>

          {/* SECTION B — 시간표 */}
          <section ref={timetableRef} id="timetable" className="space-y-4">
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
                    <SelectItem value="2025-1">2025년 1학기</SelectItem>
                    <SelectItem value="2024-2">2024년 2학기</SelectItem>
                    <SelectItem value="2024-1">2024년 1학기</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setIsTimetableEditOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  시간표 수정하기
                </Button>
              </div>
            </div>

            <Timetable
              days={DAYS}
              startHour={START_HOUR}
              slotCount={SLOT_COUNT}
              slotHeight={SLOT_HEIGHT}
              courses={timetableCourses}
            />
          </section>

          {/* SECTION C — 선호 키워드 관리 */}
          <section ref={preferencesRef} id="preferences" className="space-y-4">
            <h2 className="mb-2 flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              선호 키워드 관리
            </h2>
            <KeywordPreferences prefs={keywordPrefs} onEdit={() => setIsKeywordEditOpen(true)} />
          </section>
        </div>
      </div>
      </div>
    </main>
  );
}
