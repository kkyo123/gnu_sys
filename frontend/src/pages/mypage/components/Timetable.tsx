import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { TimetableCourse, Weekday } from '../../../types/mypage';

interface TimetableProps {
  days: Record<Weekday, string>;
  startHour: number;
  slotCount: number;
  slotHeight: number;
  courses: TimetableCourse[];
}

const slotOffsetPx = (start: number, startHour: number, slotHeight: number) => (start - startHour) * slotHeight;
const blockHeightPx = (duration: number, slotHeight: number) => duration * slotHeight;

export const Timetable: React.FC<TimetableProps> = ({ days, startHour, slotCount, slotHeight, courses }) => {
  const timeSlots = Array.from({ length: slotCount }, (_, i) => i + startHour);

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 pb-5">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-6 gap-2 mb-3">
              <div className="text-center text-sm text-muted-foreground"></div>
              {Object.values(days).map((day) => (
                <div key={day} className="text-center text-sm py-3 bg-[#F7F7F9] rounded-lg">
                  {day}
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="grid grid-cols-6 gap-2">
                <div className="space-y-2">
                  {timeSlots.map((hour) => (
                    <div key={hour} className="h-16 text-xs text-muted-foreground flex items-center justify-center">
                      {hour}:00
                    </div>
                  ))}
                </div>

                {Object.keys(days).map((dayKey) => {
                  const day = Number(dayKey) as Weekday;
                  return (
                    <div key={day} className="relative space-y-2">
                      {timeSlots.map((hour) => (
                        <div key={hour} className="h-16 border border-gray-200 rounded-lg bg-white"></div>
                      ))}
                      {courses
                        .filter((course) => course.day === day)
                        .map((course) => (
                          <div
                            key={course.id}
                            className={`absolute left-0 right-0 ${course.color} text-white text-xs p-2 rounded-lg shadow-md`}
                            style={{
                              top: `${slotOffsetPx(course.startTime, startHour, slotHeight)}px`,
                              height: `${blockHeightPx(course.duration, slotHeight)}px`,
                            }}
                            title={`${course.name}\n${course.professor}\n${course.startTime}:00 - ${course.startTime + course.duration}:00`}
                          >
                            <div className="line-clamp-1">{course.name}</div>
                            <div className="text-[10px] opacity-90 line-clamp-1">{course.professor}</div>
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
