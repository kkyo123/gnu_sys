import React, { useMemo, useState } from 'react';
import { Calendar, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Card, CardContent } from '../../../components/ui/card';

type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

interface TimetableCourse {
  id: string;
  name: string;
  professor: string;
  credits: number;
  time: string; // 예: "화1,2,3"
  day: Weekday;
  startPeriod: number; // 1~9
  duration: number; // 교시 수
  colorClass: string; // tailwind bg-*
}

type CourseTab = 'custom' | 'system' | 'graduation';

const dayLabel: Record<Weekday, string> = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금' };
const DAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri'];
const START_PERIOD = 1;
const END_PERIOD = 9;
const ROW_HEIGHT = 52;

const coursesByTab: Record<CourseTab, TimetableCourse[]> = {
  custom: [
    { id: '1', name: '알고리즘', professor: '최상민', credits: 3, time: '화1,2,3', day: 'tue', startPeriod: 1, duration: 3, colorClass: 'bg-rose-500' },
    { id: '2', name: '정보보안개론', professor: '김지윤', credits: 3, time: '화6,7,8', day: 'tue', startPeriod: 6, duration: 3, colorClass: 'bg-teal-400' },
    { id: '3', name: '운영체제', professor: '남영호', credits: 3, time: '수5,6,7', day: 'wed', startPeriod: 5, duration: 3, colorClass: 'bg-emerald-300' },
    { id: '4', name: '데이터과학', professor: '서현', credits: 3, time: '목6,7,8', day: 'thu', startPeriod: 6, duration: 3, colorClass: 'bg-orange-400' },
  ],
  system: [
    { id: '5', name: '인공지능', professor: '이민수', credits: 3, time: '월3,4,5', day: 'mon', startPeriod: 3, duration: 3, colorClass: 'bg-green-300' },
    { id: '6', name: '데이터베이스', professor: '박준영', credits: 3, time: '수1,2,3', day: 'wed', startPeriod: 1, duration: 3, colorClass: 'bg-amber-200' },
    { id: '7', name: '네트워크', professor: '정수진', credits: 3, time: '목2,3,4', day: 'thu', startPeriod: 2, duration: 3, colorClass: 'bg-rose-300' },
    { id: '8', name: '컴퓨터구조', professor: '강민호', credits: 3, time: '금5,6,7', day: 'fri', startPeriod: 5, duration: 3, colorClass: 'bg-pink-300' },
  ],
  graduation: [
    { id: '9', name: '프로그래밍언어론', professor: '윤서연', credits: 3, time: '월6,7,8', day: 'mon', startPeriod: 6, duration: 3, colorClass: 'bg-purple-300' },
    { id: '10', name: '소프트웨어공학', professor: '최동욱', credits: 3, time: '화4,5,6', day: 'tue', startPeriod: 4, duration: 3, colorClass: 'bg-blue-300' },
    { id: '11', name: '컴파일러', professor: '한지민', credits: 3, time: '수8,9', day: 'wed', startPeriod: 8, duration: 2, colorClass: 'bg-emerald-400' },
    { id: '12', name: '모바일프로그래밍', professor: '임태훈', credits: 3, time: '금1,2,3', day: 'fri', startPeriod: 1, duration: 3, colorClass: 'bg-yellow-300' },
  ],
};

const TimetableGrid: React.FC<{
  days: Weekday[];
  startPeriod: number;
  endPeriod: number;
  courses: TimetableCourse[];
  hoveredCourse: TimetableCourse | null;
}> = ({ days, startPeriod, endPeriod, courses, hoveredCourse }) => {
  const periods = useMemo(
    () => Array.from({ length: endPeriod - startPeriod + 1 }, (_, i) => startPeriod + i),
    [startPeriod, endPeriod],
  );

  const blocks = [...courses, ...(hoveredCourse ? [{ ...hoveredCourse, id: 'hover-preview' }] : [])];
  const periodToTop = (period: number) => (period - startPeriod) * ROW_HEIGHT;

  return (
    <div className="relative border rounded-lg bg-white shadow-sm">
      <div className="grid grid-cols-[60px_repeat(5,1fr)]">
        <div className="h-10 border-b flex items-center justify-center text-sm text-muted-foreground">교시</div>
        {days.map((d) => (
          <div key={d} className="h-10 border-b flex items-center justify-center text-sm font-medium">
            {dayLabel[d]}
          </div>
        ))}

        {periods.map((p) => (
          <React.Fragment key={p}>
            <div className="h-13 border-b flex items-center justify-center text-xs text-muted-foreground">{p}교시</div>
            {days.map((d) => (
              <div key={`${d}-${p}`} className="h-13 border-b border-l last:border-r bg-muted/10" />
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="absolute inset-x-[60px] top-10 bottom-0">
        {blocks.map((course) => {
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
              className={`absolute rounded-md text-xs text-white p-2 shadow ${course.colorClass} ${isPreview ? 'opacity-50' : ''}`}
              style={{ top, height, left: `${left}%`, width: `${width}%` }}
            >
              <div className="font-semibold truncate">{course.name}</div>
              <div className="text-[11px] truncate">{course.professor}</div>
              <div className="text-[11px] truncate">
                {dayLabel[course.day]} {course.startPeriod}~{course.startPeriod + course.duration - 1}교시
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
  const [activeTab, setActiveTab] = useState<CourseTab>('custom');
  const [hoveredCourse, setHoveredCourse] = useState<TimetableCourse | null>(null);

  const [userCourses] = useState<TimetableCourse[]>(coursesByTab.custom);
  const [systemCourses] = useState<TimetableCourse[]>(coursesByTab.system);
  const [gradReqCourses] = useState<TimetableCourse[]>(coursesByTab.graduation);

  const tabCourses: Record<CourseTab, TimetableCourse[]> = {
    custom: userCourses,
    system: systemCourses,
    graduation: gradReqCourses,
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

          <div className="grid grid-cols-2 lg:grid-cols-[2fr_1.2fr] gap-6 w-full">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                월~금 · 1~9교시
              </div>
              <TimetableGrid
                days={DAYS}
                startPeriod={START_PERIOD}
                endPeriod={END_PERIOD}
                courses={tabCourses[activeTab]}
                hoveredCourse={hoveredCourse}
              />
            </div>

            <div className="space-y-3">
              <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as CourseTab)}>
                <TabsList className="grid grid-cols-3 w-full mb-3">
                  <TabsTrigger value="custom">사용자 지정</TabsTrigger>
                  <TabsTrigger value="system">시스템 기반</TabsTrigger>
                  <TabsTrigger value="graduation">졸업요건 기반</TabsTrigger>
                </TabsList>

                {(Object.keys(tabCourses) as CourseTab[]).map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <ScrollArea className="max-h-[460px] rounded-lg border bg-card p-4">
                      <div className="space-y-3">
                        {tabCourses[tab].length === 0 ? (
                          <p className="py-6 text-center text-sm text-muted-foreground">등록된 강의가 없습니다.</p>
                        ) : (
                          tabCourses[tab].map((course) => (
                            <Card
                              key={course.id}
                              className="shadow-sm cursor-pointer"
                              onMouseEnter={() => setHoveredCourse(course)}
                              onMouseLeave={() => setHoveredCourse(null)}
                            >
                              <CardContent className="pt-3 pb-3 px-3 flex items-start gap-3">
                                <span
                                  className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${course.colorClass}`}
                                  aria-hidden
                                />
                                <div className="space-y-1">
                                  <p className="text-sm font-medium leading-tight">{course.name}</p>
                                  <p className="text-xs text-muted-foreground">{course.professor}</p>
                                  <p className="text-xs text-muted-foreground">{course.time}</p>
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
            <Button onClick={() => setIsOpen(false)}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
