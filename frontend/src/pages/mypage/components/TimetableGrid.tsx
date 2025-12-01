import React from 'react';
import type { TimetableCourse, Weekday } from '../../../types/mypage';

interface TimetableGridProps {
  days: Record<Weekday, string>;
  timeSlots: number[];
  slotHeight: number;
  courses: TimetableCourse[];
}

const TIME_COL_WIDTH = 70;
const DAY_COL_WIDTH = 110;
const GAP = 8;
const HEADER_HEIGHT = 48;
const PADDING = 8;
const dayKeyOrder: Weekday[] = [0, 1, 2, 3, 4];

export const TimetableGrid: React.FC<TimetableGridProps> = ({ days, timeSlots, slotHeight, courses }) => {
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
      <div className="absolute inset-0" aria-hidden="true">
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
          <div className="flex flex-col px-2" style={{ marginTop: GAP, gap: GAP }}>
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

        <div
          className="absolute top-0"
          style={{ left: TIME_COL_WIDTH + GAP + PADDING, right: PADDING, height: containerHeight }}
        >
          <div className="flex" style={{ height: HEADER_HEIGHT, marginBottom: GAP, gap: GAP }}>
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

          <div className="flex" style={{ gap: GAP }}>
            {dayKeyOrder.map((d) => (
              <div key={d} className="flex flex-col" style={{ width: DAY_COL_WIDTH, gap: GAP }}>
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

      <div className="absolute inset-0 pointer-events-none">
        {courseBlocks.map((course) => (
          <div
            key={course.id}
            className="absolute text-xs text-white p-2 rounded-md shadow"
            style={{
              top: course.top,
              left: course.left,
              width: DAY_COL_WIDTH,
              height: course.height,
              backgroundColor: course.color,
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
