import { useRef, useState } from 'react';
import { Calendar, Target, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { AcademicData, KeywordPrefs, MyPageUser, TimetableCourse } from '../../types/mypage';
import { CreditOverview, KeywordPreferences, MyPageSidebar, Timetable, TimetableEditSection } from './components';
import { DAYS, SLOT_COUNT, SLOT_HEIGHT, START_HOUR } from './constants';
import { mockUser, mockAcademicData, mockKeywordPrefs, getCoursesBySemester } from './userData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import {
  DEFAULT_SELECTED_SEMESTER,
  MYPAGE_SECTION_IDS,
  SEMESTER_OPTIONS,
  type MyPageSectionId,
} from './config';

interface MyPageProps {
  user?: MyPageUser;
  academicData?: AcademicData;
  timetableCourses?: TimetableCourse[];
  keywordPrefs?: KeywordPrefs;
}

export default function Mypage({
  user = mockUser,
  academicData = mockAcademicData,
  keywordPrefs = mockKeywordPrefs,
}: Omit<MyPageProps, 'timetableCourses'>) {
  const [selectedSemester, setSelectedSemester] = useState<string>(DEFAULT_SELECTED_SEMESTER);
  const [isKeywordEditOpen, setIsKeywordEditOpen] = useState(false); // TODO: Dialog 연동
  const [, setIsProfileEditOpen] = useState(false); // TODO: Dialog 연동

  const semesterCourses = getCoursesBySemester(selectedSemester);

  const creditOverviewRef = useRef<HTMLElement>(null);
  const timetableRef = useRef<HTMLElement>(null);
  const preferencesRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: MyPageSectionId) => {
    const refMap: Record<MyPageSectionId, React.RefObject<HTMLElement>> = {
      [MYPAGE_SECTION_IDS.creditOverview]: creditOverviewRef,
      [MYPAGE_SECTION_IDS.timetable]: timetableRef,
      [MYPAGE_SECTION_IDS.preferences]: preferencesRef,
    };
    const target = refMap[id]?.current;
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-row gap-4 max-w-6xl mx-auto px-4">
        <aside>
          <MyPageSidebar
            user={user}
            academicData={academicData}
            selectedKeywords={keywordPrefs.selected}
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
            <CreditOverview academicData={academicData} />
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
                <TimetableEditSection />
              </div>
            </div>

            <Timetable
              days={DAYS}
              startHour={START_HOUR}
              slotCount={SLOT_COUNT}
              slotHeight={SLOT_HEIGHT}
              courses={semesterCourses}
            />
          </section>

          <section ref={preferencesRef} id={MYPAGE_SECTION_IDS.preferences} className="space-y-4">
            <h2 className="mb-2 flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              선호 키워드 관리
            </h2>
            <KeywordPreferences prefs={keywordPrefs} onEdit={() => setIsKeywordEditOpen(true)} />
          </section>
        </section>
      </div>


      //선호 키워드 팝업창      
      <Dialog open={isKeywordEditOpen} onOpenChange={setIsKeywordEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">선호 키워드 편집</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
