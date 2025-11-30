import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Edit } from 'lucide-react';
import { TimetableOnly, type Course as PreviewCourse } from './TimetableOnly';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Card, CardContent } from '../../../components/ui/card';
import { coursesByTab, type CourseTab } from '../courseData';
import type { TimetableCourseStandard } from '../../../types/mypage';
import { toPreviewCourse } from '../courseTransforms';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { SEMESTER_OPTIONS } from '../config';

type TabKey = CourseTab | 'selected';

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
      const nextForSemester = exists ? current.filter((c) => c.id !== course.id) : [...current, course];
      return { ...prev, [currentSemester]: nextForSemester };
    });
  };

  const selectedCoursesForSemester = localSelected[currentSemester] ?? [];

  const selectedPreviewCourses: PreviewCourse[] = useMemo(
    () => (tabCourses[activeTab] ?? selectedCoursesForSemester).map(toPreviewCourse),
    [tabCourses, activeTab, selectedCoursesForSemester],
  );

  const hoveredPreviewCourse: PreviewCourse | null = useMemo(
    () => (hoveredCourse ? toPreviewCourse(hoveredCourse) : null),
    [hoveredCourse],
  );

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

              <TimetableOnly hoveredCourse={hoveredPreviewCourse} selectedCourses={selectedPreviewCourses} />
            </div>

            {/* 오른쪽: 강의 리스트 + 탭 */}
            <div className="space-y-3">
              <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabKey)}>
                <TabsList className="mb-3 w-full flex flex-nowrap items-center">
                  <TabsTrigger value="selected"  className="grow text-center">현재 학기</TabsTrigger>
                  <TabsTrigger value="custom"  className="grow text-center">사용자 지정</TabsTrigger>
                  <TabsTrigger value="system"  className="grow text-center">시스템 기반</TabsTrigger>
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
