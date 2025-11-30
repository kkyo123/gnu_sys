import type { ReactNode } from 'react';

export interface Course {
  id: string;
  name: string;
  professor: string;
  credits: number;
  time: string; // 예: "화1,2,3"
  color: string; // 블록 배경색(hex)
}

export interface TimetableProps {
  hoveredCourse: Course | null;
  selectedCourses: Course[];
}

// 시간 문자열 파싱 (요일/교시)
function parseTime(timeStr: string): { day: number; periods: number[] } | null {
  const dayMap: Record<string, number> = { 월: 1, 화: 2, 수: 3, 목: 4, 금: 5 };
  const dayChar = timeStr[0];
  const periodsStr = timeStr.slice(1);
  const periods = periodsStr.split(',').map((p) => Number.parseInt(p, 10));
  if (!dayMap[dayChar] || periods.some(Number.isNaN)) return null;
  return { day: dayMap[dayChar], periods };
}

function Cell({ children }: { children: ReactNode }) {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[40px] py-[28px] relative size-full">
          {children}
        </div>
      </div>
    </div>
  );
}

function TimeCell({ label, isHeader }: { label: string; isHeader?: boolean }) {
  return (
    <div className={`basis-0 ${isHeader ? 'bg-white' : 'bg-[#f3f3f3]'} grow min-h-px min-w-px relative rounded-[10px] shrink-0 w-full`}>
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[40px] py-[28px] relative size-full">
          <p className={`font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] ${isHeader ? 'text-white' : 'text-black'} text-nowrap whitespace-pre`}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyCell() {
  return (
    <div className="basis-0 bg-[rgba(243,243,243,0.1)] grow min-h-px min-w-px relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[40px] py-[28px] relative size-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-[rgba(0,0,0,0)] text-nowrap whitespace-pre">
            text
          </p>
        </div>
      </div>
    </div>
  );
}

function TimeTableArea({ hoveredCourse, selectedCourses }: TimetableProps) {
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  const renderCourseBlock = (course: Course, isHovered: boolean) => {
    const timeInfo = parseTime(course.time);
    if (!timeInfo) return null;

    const { day, periods } = timeInfo;
    const cellHeight = 64;
    const gap = 10;
    const headerHeight = 64;
    const padding = 7;
    const startPeriod = Math.min(...periods);
    const periodCount = periods.length;
    const top = padding + headerHeight + gap + (startPeriod - 1) * (cellHeight + gap);
    const height = periodCount * cellHeight + (periodCount - 1) * gap;
    const columnWidth = 83;
    const left = 6 + columnWidth + 5 + (day - 1) * (columnWidth + 5);

    return (
      <div
        key={course.id}
        className="absolute rounded-[10px] flex items-center justify-center transition-opacity duration-200"
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: `${columnWidth}px`,
          height: `${height}px`,
          backgroundColor: course.color,
          opacity: isHovered ? 0.5 : 1,
          pointerEvents: 'none',
        }}
      >
        <div className="text-white text-center px-2">
          <p className="font-['Inter:Bold',sans-serif] font-bold text-[13px] leading-tight">{course.name}</p>
          <p className="font-['Inter:Regular',sans-serif] text-[11px] mt-1">{course.professor}</p>
        </div>
      </div>
    );
  };

  // 시간표그리드 !!!!!!!!!!!!!!!!!!!!!!!!!
  return (
    <div className="bg-white relative rounded-[15px] shrink-0 w-[549px]">
      <div className="box-border content-stretch flex gap-[5px] items-start justify-center overflow-clip p-[5px] relative rounded-[inherit] w-[549px]">
        <div className="basis-0 bg-white grow h-[744px] min-h-px min-w-px relative shrink-0">
          <div className="overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex flex-col gap-[10px] h-[744px] items-start px-[6px] py-[7px] relative w-full"> {/*//시간표시*/}
              <Cell>
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[15px] text-nowrap text-black whitespace-pre">
                  TIME
                </p>
              </Cell>
              {times.map((time, i) => (
                <TimeCell key={i} label={time} className="text-black" />
              ))}
            </div>
          </div>
        </div>

        {days.map((day) => (
          <div key={day} className="basis-0 bg-white grow h-[744px] min-h-px min-w-px relative shrink-0">
            <div className="overflow-clip rounded-[inherit] size-full">
              <div className="box-border content-stretch flex flex-col gap-[10px] h-[744px] items-start px-[6px] py-[7px] relative w-full">
                <TimeCell label={day} isHeader />
                {times.map((_, i) => (
                  <EmptyCell key={i} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCourses.map((course) => renderCourseBlock(course, false))}
      {hoveredCourse && !selectedCourses.find((c) => c.id === hoveredCourse.id) && renderCourseBlock(hoveredCourse, true)}

      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[15px]" />
    </div>
  );
}

export function TimetableOnly({ hoveredCourse, selectedCourses }: TimetableProps) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0">
      <div className="content-stretch flex gap-[438px] h-[24px] items-center relative shrink-0 w-full">
        <p className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[20px] text-black text-nowrap whitespace-pre">
          시간표 미리보기
        </p>
      </div>
      <TimeTableArea hoveredCourse={hoveredCourse} selectedCourses={selectedCourses} />
    </div>
  );
}
