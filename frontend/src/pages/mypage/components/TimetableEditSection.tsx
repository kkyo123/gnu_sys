import React, { useEffect, useMemo, useState } from 'react';
import { Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { coursesByTab, type CourseTab } from '@/pages/Mypage/courseData';
import type { TimetableCourse, TimetableCourseStandard, Weekday } from '@/types/mypage';
import { TimetableGrid } from './TimetableGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEMESTER_OPTIONS } from '@/pages/Mypage/config';

type TabKey = CourseTab | 'selected';

// --- [ 시간표 설정 및 상수 ] --------------------------------------------------
const tailwindToHex: Record<string, string> = {
  'bg-rose-500': '#f43f5e',
  'bg-teal-400': '#2dd4bf',
  'bg-emerald-300': '#6ee7b7',
  'bg-orange-400': '#fb923c',
  'bg-green-300': '#86efac',
  'bg-amber-200': '#fde68a',
  'bg-rose-300': '#fecaca',
  'bg-pink-300': '#f9a8d4',
  'bg-purple-300': '#c4b5fd',
  'bg-blue-300': '#93c5fd',
  'bg-emerald-400': '#34d399',
  'bg-yellow-300': '#fde047',
  'bg-blue-500': '#3b82f6',
  'bg-purple-500': '#a855f7',
  'bg-green-500': '#22c55e',
  'bg-orange-500': '#f97316',
  'bg-pink-500': '#ec4899',
};

const DAYS: Record<Weekday, string> = { 0: '\uC6D4', 1: '\uD654', 2: '\uC218', 3: '\uBAA9', 4: '\uAE08' };
const START_HOUR = 9; // 시간표 시작 시간 (예: 9시)
const SLOT_COUNT = 9; // 9교시 (9시부터 9개 슬롯)
const SLOT_HEIGHT = 50; // 슬롯 당 높이 (px)

// --- [ 시간표 설정 및 상수 끝 ] ----------------------------------------------

// --- [ 타입 변환 함수: TimetableCourseStandard -> TimetableCourse ] ------------
// periodStart(교시 번호)를 startTime(시(hour))로 변환
const PERIOD_START_OFFSET = START_HOUR; // 1교시를 START_HOUR(9시)로 매핑한다고 가정
const toTimetableCourse = (course: TimetableCourseStandard): TimetableCourse => ({
  id: course.id,
  name: course.name,
  professor: course.professor,
  day: course.day,
  // periodStart가 1부터 시작하고, 1교시가 9시(START_HOUR)라면 offset은 9-1=8 입니다.
  startTime: PERIOD_START_OFFSET + course.periodStart - 1,
  duration: course.periodDuration,
  color: tailwindToHex[course.colorClass] ?? '#3b82f6',
});
// --- [ 타입 변환 함수 끝 ] ----------------------------------------------------

interface TimetableEditSectionProps {
  currentSemester: string;
  selectedBySemester: Record<string, TimetableCourseStandard[]>;
  onSaveSemesterCourses: (semester: string, courses: TimetableCourseStandard[]) => void;
  onSemesterChange: (semester: string) => void;
}

export const TimetableEditSection: React.FC<TimetableEditSectionProps> = ({
  currentSemester,
  selectedBySemester,
  onSaveSemesterCourses,
  onSemesterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('selected'); // 기본: 현재 학기
  const [hoveredCourse, setHoveredCourse] = useState<TimetableCourseStandard | null>(null);
  const [localSelected, setLocalSelected] = useState<Record<string, TimetableCourseStandard[]>>(selectedBySemester);

  useEffect(() => {
    if (isOpen) {
      // 팝업 열릴 때 최신 선택 상태를 가져옴
      setLocalSelected(selectedBySemester);
    }
  }, [isOpen, selectedBySemester, currentSemester]);

  const tabCourses: Record<TabKey, TimetableCourseStandard[]> = {
    selected: localSelected[currentSemester] ?? [],
    ...coursesByTab,
  };

  const toggleCourse = (course: TimetableCourseStandard) => {
    setLocalSelected((prev) => {
      const current = prev[currentSemester] ?? [];
      const exists = current.some((c) => c.id === course.id);
      if (exists) {
        setHoveredCourse(null);
      }
      const nextForSemester = exists ? current.filter((c) => c.id !== course.id) : [...current, course];
      return { ...prev, [currentSemester]: nextForSemester };
    });
  };

  const selectedCoursesForSemester = localSelected[currentSemester] ?? [];

  // ** 1. TimetableGrid에 전달할 최종 강의 목록 계산 (선택된 강의 + 호버된 강의) **
  const coursesForGrid: TimetableCourse[] = useMemo(() => {
    const selected = selectedCoursesForSemester.map(toTimetableCourse);
    
    // 호버된 강의가 있고, 아직 선택 목록에 없다면 추가하여 미리보기를 제공
    if (hoveredCourse && !selectedCoursesForSemester.some((c) => c.id === hoveredCourse.id)) {
      // *주의: 호버된 강의를 시각적으로 구분하려면 toTimetableCourse 함수나 
      // TimetableGrid 내부에서 색상/스타일을 조정해야 합니다.
      return [...selected, toTimetableCourse(hoveredCourse)];
    }
    return selected;
  }, [selectedCoursesForSemester, hoveredCourse]);

  // ** 2. 시간 슬롯 배열 계산 **
  const timeSlots = useMemo(() => Array.from({ length: SLOT_COUNT }, (_, i) => START_HOUR + i), []);

  const handleSave = () => {
    onSaveSemesterCourses(currentSemester, selectedCoursesForSemester);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Edit className="mr-2 h-4 w-4" />
        시간표 수정하기
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[98vw] max-w-none h-[98vh] max-h-[98vh]">
          <DialogHeader className="text-left">
            <DialogTitle>시간표 수정하기</DialogTitle>
            <DialogDescription>
              탭을 선택하고 원하는 강의를 확인하여 시간표를 수정하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-nowrap space-x-3">
            {/* 왼쪽: 시간표 미리보기 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-nowrap">
                <span className="text-sm text-muted-foreground">학기 선택</span>
                <Select
                  value={currentSemester}
                  onValueChange={(val) => {
                    onSemesterChange(val);
                    setHoveredCourse(null);
                  }}
                >
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
              </div>

              {/* ** 3. TimetableGrid 렌더링 ** */}
              <TimetableGrid days={DAYS} timeSlots={timeSlots} slotHeight={SLOT_HEIGHT} courses={coursesForGrid} />
            </div>

            {/* 오른쪽: 강의 리스트 + 탭 */}
            <div className="space-y-3">
              <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabKey)}>
                <TabsList className="mb-3 w-full flex flex-nowrap items-center">
                  <TabsTrigger value="selected" className="grow text-center">현재 학기</TabsTrigger>
                  <TabsTrigger value="custom" className="grow text-center">사용자 지정</TabsTrigger>
                  <TabsTrigger value="system" className="grow text-center">시스템 기반</TabsTrigger>
                  <TabsTrigger value="graduation" className="grow text-center">졸업요건 기반</TabsTrigger>
                </TabsList>

                {(['selected', 'custom', 'system', 'graduation'] as TabKey[]).map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <ScrollArea className="max-h-[460px] rounded-lg border bg-card p-4">
                      <div className="space-y-3">
                        {tabCourses[tab].length === 0 ? (
                          <p className="py-6 text-center text-sm text-muted-foreground">
                            등록된 강의가 없습니다.
                          </p>
                        ) : (
                          tabCourses[tab].map((course) => (
                            <Card
                              key={course.id}
                              className={`cursor-pointer shadow-sm ${
                                selectedCoursesForSemester.some((c) => c.id === course.id) ? 'ring-2 ring-primary' : ''
                              }`}
                              onMouseEnter={() => setHoveredCourse(course)}
                              onMouseLeave={() => setHoveredCourse(null)}
                              onClick={() => toggleCourse(course)}
                            >
                              <CardContent className="flex items-start gap-3 px-3 py-3">
                                <span
                                  className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${course.colorClass}`}
                                  aria-hidden
                                />
                                <div className="space-y-1">
                                  <p className="text-sm font-medium leading-tight">{course.name}</p>
                                  <p className="text-xs text-muted-foreground">{course.professor}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {['월', '화', '수', '목', '금'][course.day]}
                                    {course.periodStart}~
                                    {course.periodStart + course.periodDuration - 1}교시
                                  </p>
                                </div>
                                <div className="ml-auto text-xs text-muted-foreground">{course.credits}학점</div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          <DialogFooter className="mt-2 flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSave}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
