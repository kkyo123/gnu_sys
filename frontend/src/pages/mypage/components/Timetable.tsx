import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import type { TimetableCourse, Weekday } from '../../../types/mypage';

interface TimetableProps {
  days: Record<Weekday, string>;
  startHour: number; // 예: 9
  slotCount: number; // 예: 9 (9~17시)
  slotHeight: number; // px per slot
  courses: TimetableCourse[];
}

const TIME_COL_WIDTH = 70;
const DAY_COL_WIDTH = 110;
const GAP = 8;
const HEADER_HEIGHT = 48;
const PADDING = 8;

const dayKeyOrder: Weekday[] = [0, 1, 2, 3, 4];

const TimetableGrid: React.FC<{
  days: Record<Weekday, string>;
  timeSlots: number[];
  slotHeight: number;
  courses: TimetableCourse[];
}> = ({ days, timeSlots, slotHeight, courses }) => {
  const containerHeight =
    PADDING * 2 +
    HEADER_HEIGHT +
    GAP +
    timeSlots.length * slotHeight +
    (timeSlots.length - 1) * GAP;

  const containerWidth =
    TIME_COL_WIDTH +
    GAP +
    dayKeyOrder.length * DAY_COL_WIDTH +
    (dayKeyOrder.length - 1) * GAP;

  const topForSlot = (slotIndex: number) => PADDING + HEADER_HEIGHT + GAP + slotIndex * (slotHeight + GAP);
  const leftForDay = (dayIndex: number) =>
    PADDING + TIME_COL_WIDTH + GAP + dayIndex * (DAY_COL_WIDTH + GAP);

  const courseBlocks = courses.map((course) => {
    // startTime은 시(hour) 기준이라면 slotIndex는 startTime - startHour로 변환
    const slotIndex = Math.max(0, course.startTime - timeSlots[0]);
    const top = topForSlot(slotIndex);
    const height = course.duration * slotHeight + (course.duration - 1) * GAP;
    const dayIndex = dayKeyOrder.indexOf(course.day);
    const left = leftForDay(dayIndex === -1 ? 0 : dayIndex);
    return { ...course, top, height, left };
  });

  return (
    <div
      className="relative bg-white rounded-lg shadow-sm border"
      style={{ height: containerHeight, width: containerWidth }}
    >
      {/* TIME column + day headers */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Time column */}
        <div
          className="absolute top-0 left-0"
          style={{ width: TIME_COL_WIDTH, height: containerHeight }}
        >
          <div
            className="flex items-center justify-center text-xs font-semibold bg-primary text-primary-foreground rounded-md"
            style={{ height: HEADER_HEIGHT, margin: PADDING }}
          >
            TIME
          </div>
          <div className="flex flex-col gap-2 px-2" style={{ marginTop: GAP }}>
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="flex items-center justify-center text-xs text-muted-foreground rounded-md bg-muted/40"
                style={{ height: slotHeight }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>
        </div>

        {/* Day columns */}
        <div
          className="absolute top-0"
          style={{ left: TIME_COL_WIDTH + GAP + PADDING, right: PADDING, height: containerHeight }}
        >
          <div className="flex gap-2" style={{ height: HEADER_HEIGHT, marginBottom: GAP }}>
            {dayKeyOrder.map((d) => (
              <div
                key={d}
                className="flex items-center justify-center text-sm font-medium bg-primary/90 text-primary-foreground rounded-md"
                style={{ width: DAY_COL_WIDTH }}
              >
                {days[d]}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {dayKeyOrder.map((d) => (
              <div key={d} className="flex flex-col gap-2" style={{ width: DAY_COL_WIDTH }}>
                {timeSlots.map((slot) => (
                  <div
                    key={`${d}-${slot}`}
                    className="border border-muted rounded-md bg-muted/20"
                    style={{ height: slotHeight }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course blocks */}
      <div className="absolute inset-0 pointer-events-none">
        {courseBlocks.map((course) => (
          <div
            key={course.id}
            className={`absolute text-xs text-white p-2 rounded-md shadow ${course.color}`}
            style={{
              top: course.top,
              left: course.left,
              width: DAY_COL_WIDTH,
              height: course.height,
            }}
          >
            <div className="font-semibold truncate">{course.name}</div>
            <div className="text-[11px] truncate">{course.professor}</div>
            <div className="text-[11px] truncate">
              {timeSlots[course.startTime - timeSlots[0]] ?? course.startTime}:00 · {course.duration}교시
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Timetable: React.FC<TimetableProps> = ({ days, startHour, slotCount, slotHeight, courses }) => {
  const timeSlots = Array.from({ length: slotCount }, (_, i) => startHour + i);
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            월~금 · 1~9교시
          </div>
        </div>
        <div className="flex justify-center">
          <TimetableGrid days={days} timeSlots={timeSlots} slotHeight={slotHeight} courses={courses} />
        </div>
      </CardContent>
    </Card>
  );
};
