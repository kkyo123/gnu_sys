import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { TimetableCourse, Weekday } from '@/types/mypage';
import { TimetableGrid } from './TimetableGrid';

interface TimetableProps {
  days: Record<Weekday, string>;
  startHour: number;
  slotCount: number;
  slotHeight: number;
  courses: TimetableCourse[];
}

export const Timetable: React.FC<TimetableProps> = ({ days, startHour, slotCount, slotHeight, courses }) => {
  const timeSlots = Array.from({ length: slotCount }, (_, i) => startHour + i);
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 pb-5">
        <div className="flex justify-center">
          <TimetableGrid days={days} timeSlots={timeSlots} slotHeight={slotHeight} courses={courses} />
        </div>
      </CardContent>
    </Card>
  );
};
