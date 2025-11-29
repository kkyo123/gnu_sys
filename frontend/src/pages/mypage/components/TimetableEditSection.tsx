import React, { useMemo, useState } from 'react';
import { Calendar, Edit } from 'lucide-react';
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

type Weekday = 'mon' | 'tue' | 'wed' | 'thu';

interface TimetableCourse {
  id: string;
  name: string;
  professor: string;
  day: Weekday;
  startPeriod: number; // 1~9
  duration: number; // 교시 수
  colorClass: string; // tailwind bg-*
}

type CourseTab = 'user' | 'system' | 'gradreq';

const DAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu'];
const DAY_LABEL: Record<Weekday, string> = { mon: '월', tue: '화', wed: '수', thu: '목' };
const START_PERIOD = 1;
const END_PERIOD = 9;
const ROW_HEIGHT = 52; // px per period row

const mockUserCourses: TimetableCourse[] = [
  { id: 'u1', name: '자료구조', professor: '김민지', day: 'mon', startPeriod: 2, duration: 2, colorClass: 'bg-blue-500' },
  { id: 'u2', name: '웹프론트엔드', professor: '이수연', day: 'wed', startPeriod: 5, duration: 2, colorClass: 'bg-amber-500' },
];

const mockSystemCourses: TimetableCourse[] = [
  { id: 's1', name: '운영체제', professor: '정현우', day: 'tue', startPeriod: 3, duration: 2, colorClass: 'bg-purple-500' },
  { id: 's2', name: '네트워크', professor: '박지후', day: 'thu', startPeriod: 4, duration: 2, colorClass: 'bg-emerald-500' },
];

const mockGradReqCourses: TimetableCourse[] = [
  { id: 'g1', name: '공학윤리', professor: '최해인', day: 'mon', startPeriod: 7, duration: 2, colorClass: 'bg-rose-500' },
  { id: 'g2', name: '현대사회와법', professor: '김도윤', day: 'tue', startPeriod: 6, duration: 2, colorClass: 'bg-sky-500' },
];

interface TimetableGridProps {
  days: Weekday[];
  startPeriod: number;
  endPeriod: number;
  courses: TimetableCourse[];
  hoveredCourse: TimetableCourse | null;
}

const TimetableGrid: React.FC<TimetableGridProps> = ({ days, startPeriod, endPeriod, courses, hoveredCourse }) => {
  const periods = useMemo(
    () => Array.from({ length: endPeriod - startPeriod + 1 }, (_, i) => startPeriod + i),
    [startPeriod, endPeriod],
  );

  const courseBlocks = [...courses, ...(hoveredCourse ? [{ ...hoveredCourse, id: 'hover-preview' }] : [])];

  const periodToTop = (period: number) => (period - startPeriod) * ROW_HEIGHT;

  return (
    <div className="relative border rounded-lg bg-white shadow-sm">
      <div className="grid grid-cols-[60px_repeat(4,1fr)]">
        {/* Header row */}
        <div className="h-10 border-b flex items-center justify-center text-sm text-muted-foreground">교시</div>
        {days.map((d) => (
          <div key={d} className="h-10 border-b flex items-center justify-center text-sm font-medium">
            {DAY_LABEL[d]}
          </div>
        ))}

        {/* Grid cells */}
        {periods.map((p) => (
          <React.Fragment key={p}>
            <div className="h-13 border-b flex items-center justify-center text-xs text-muted-foreground">{p}교시</div>
            {days.map((d) => (
              <div key={`${d}-${p}`} className="h-13 border-b border-l last:border-r bg-muted/10" />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Course blocks */}
      <div className="absolute inset-x-[60px] top-10 bottom-0">
        {courseBlocks.map((course) => {
          const dayIndex = days.indexOf(course.day);
          if (dayIndex === -1) return null;
          const top = periodToTop(course.startPeriod);
          const height = course.duration * ROW_HEIGHT;
          const left = (dayIndex * 100) / days.length;
          const width = 100 / days.length;
          const isPreview = course.id === 'hover-preview';
          return (
            <div
              key={`${course.id}-${course.day}-${course.startPeriod}`}
              className={`absolute rounded-md text-xs text-white p-2 shadow ${course.colorClass} ${
                isPreview ? 'opacity-60' : ''
              }`}
              style={{
                top,
                height,
                left: `${left}%`,
                width: `${width}%`,
              }}
            >
              <div className="font-semibold truncate">{course.name}</div>
              <div className="text-[11px] truncate">{course.professor}</div>
              <div className="text-[11px] truncate">
                {DAY_LABEL[course.day]} {course.startPeriod}~{course.startPeriod + course.duration - 1}교시
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TimetableEditSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CourseTab>('user');
  const [hoveredCourse, setHoveredCourse] = useState<TimetableCourse | null>(null);

  const [userCourses] = useState<TimetableCourse[]>(mockUserCourses);
  const [systemCourses] = useState<TimetableCourse[]>(mockSystemCourses);
  const [gradReqCourses] = useState<TimetableCourse[]>(mockGradReqCourses);

  const tabCourses: Record<CourseTab, TimetableCourse[]> = {
    user: userCourses,
    system: systemCourses,
    gradreq: gradReqCourses,
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Edit className="h-4 w-4 mr-2" />
        시간표 수정하기
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-[1200px]">
          <DialogHeader className="text-left">
            <DialogTitle>시간표 수정하기</DialogTitle>
            <DialogDescription>선택한 학기의 시간표와 강의 목록을 확인하고 수정할 수 있습니다.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-6 w-full">
            {/* Left: Timetable */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                월~목 · 1~9교시
              </div>
              <TimetableGrid
                days={DAYS}
                startPeriod={START_PERIOD}
                endPeriod={END_PERIOD}
                courses={tabCourses[activeTab]}
                hoveredCourse={hoveredCourse}
              />
            </div>

            {/* Right: Tabs + list */}
            <div className="space-y-3">
              <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as CourseTab)}>
                <TabsList className="grid grid-cols-3 w-full mb-3">
                  <TabsTrigger value="user">사용자 지정</TabsTrigger>
                  <TabsTrigger value="system">시스템 기반</TabsTrigger>
                  <TabsTrigger value="gradreq">졸업요건 기반</TabsTrigger>
                </TabsList>

                {(['user', 'system', 'gradreq'] as CourseTab[]).map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <ScrollArea className="max-h-[460px] rounded-lg border bg-card p-4">
                      <div className="space-y-3">
                        {tabCourses[tab].length === 0 ? (
                          <p className="py-6 text-center text-sm text-muted-foreground">등록된 강의가 없습니다.</p>
                        ) : (
                          tabCourses[tab].map((course) => (
                            <div
                              key={course.id}
                              className="flex items-start gap-3 rounded-md border bg-background px-3 py-2 shadow-sm cursor-pointer"
                              onMouseEnter={() => setHoveredCourse(course)}
                              onMouseLeave={() => setHoveredCourse(null)}
                            >
                              <span
                                className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${course.colorClass}`}
                                aria-hidden
                              />
                              <div className="space-y-1">
                                <p className="text-sm font-medium leading-tight">{course.name}</p>
                                <p className="text-xs text-muted-foreground">{course.professor}</p>
                                <p className="text-xs text-muted-foreground">
                                  {DAY_LABEL[course.day]} {course.startPeriod}~{course.startPeriod + course.duration - 1}
                                  교시
                                </p>
                              </div>
                            </div>
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
            <Button onClick={() => setIsOpen(false)}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
