// DEBUG: 테스트용 강의 리스트 테이블 컴포넌트 (필요 시 삭제)
import type { TimetableCourseStandard } from '@/types/mypage';

interface CourseDebugTableProps {
  title?: string;
  courses: TimetableCourseStandard[];
}

export const CourseDebugTable: React.FC<CourseDebugTableProps> = ({ title = '강의 리스트', courses }) => {
  if (!courses.length) {
    return (
      <div className="rounded border border-dashed border-muted-foreground/30 p-3 text-sm text-muted-foreground">
        {title}: 표시할 강의가 없습니다.
      </div>
    );
  }

  return (
    <div className="rounded border border-dashed border-muted-foreground/30 p-3 text-sm">
      <div className="mb-2 font-semibold">{title}</div>
      <div className="overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b">
              <th className="py-2 pr-2">ID</th>
              <th className="py-2 pr-2">강의명</th>
              <th className="py-2 pr-2">교수명</th>
              <th className="py-2 pr-2">학점</th>
              <th className="py-2 pr-2">요일</th>
              <th className="py-2 pr-2">교시</th>
              <th className="py-2 pr-2">색상</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="py-1 pr-2 align-top">{c.id}</td>
                <td className="py-1 pr-2 align-top">{c.name}</td>
                <td className="py-1 pr-2 align-top">{c.professor}</td>
                <td className="py-1 pr-2 align-top">{c.credits}</td>
                <td className="py-1 pr-2 align-top">{['월', '화', '수', '목', '금'][c.day] ?? c.day}</td>
                <td className="py-1 pr-2 align-top">
                  {c.periodStart}~{c.periodStart + c.periodDuration - 1}교시
                </td>
                <td className="py-1 pr-2 align-top">{c.colorClass}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

