import React from "react";
import { ChevronRight, Calendar } from "lucide-react";

// ---------------------------------------------------------------------
// Link 대체 (라우팅 기능 가정)
// ---------------------------------------------------------------------
const Link = ({
  to,
  className = "",
  children,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <a href={to} className={className} onClick={(e) => e.preventDefault()}>
    {children}
  </a>
);

// ---------------------------------------------------------------------
// Card / Badge UI 컴포넌트
// ---------------------------------------------------------------------
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-base font-bold leading-none tracking-tight ${className}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <p
    ref={ref}
    className={`text-xs text-muted-foreground ${className}`}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

const Badge = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={`inline-flex items-center rounded-full border px-3 py-0.5 text-[10px] font-semibold ${className}`}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------
// 레이더 차트 (SVG)
// ---------------------------------------------------------------------
interface CreditRadarItem {
  category: string;
  value: number;
}

const defaultCreditRadarData: CreditRadarItem[] = [
  { category: "전공필수", value: 0 },
  { category: "전공선택", value: 0 },
  { category: "핵심교양", value: 0 },
  { category: "균형교양", value: 0 },
  { category: "기초교양", value: 0 },
  { category: "인증제", value: 0 },
];

const MAX_VALUE = 15;
const NUM_AXES = defaultCreditRadarData.length;
const RADIUS = 70;
const CENTER = 120;

const polarToCartesian = (angle: number, radius: number) => {
  const x = CENTER + radius * Math.cos(angle);
  const y = CENTER + radius * Math.sin(angle);
  return { x, y };
};

const getPolygonPoints = (data: CreditRadarItem[], radiusScale = 1) => {
  let points = "";
  data.forEach((item, index) => {
    const angle = (index / NUM_AXES) * 2 * Math.PI - Math.PI / 2;
    const radius = ((item.value || 0) / MAX_VALUE) * RADIUS * radiusScale;
    const { x, y } = polarToCartesian(angle, radius);
    points += `${x},${y} `;
  });
  return points.trim();
};

const SimpleRadarChart: React.FC<{
  data: CreditRadarItem[];
  showArea: boolean;
}> = ({ data, showArea }) => {
  const axes = data.map((item, i) => {
    const angle = (i / NUM_AXES) * 2 * Math.PI - Math.PI / 2;
    const { x, y } = polarToCartesian(angle, RADIUS);
    return { x, y, angle, category: item.category };
  });

  type TextAnchor = "start" | "middle" | "end";

  return (
    <svg
      viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
      className="w-full h-full"
      style={{ maxWidth: "220px", maxHeight: "220px" }}
    >
      {[0.33, 0.66, 1].map((scale) => (
        <polygon
          key={scale}
          points={getPolygonPoints(
            defaultCreditRadarData.map((d) => ({
              ...d,
              value: MAX_VALUE,
            })),
            scale
          )}
          fill="none"
          stroke="#E4E4E4"
          strokeWidth={1}
        />
      ))}

      {axes.map((axis) => (
        <line
          key={axis.category}
          x1={CENTER}
          y1={CENTER}
          x2={axis.x}
          y2={axis.y}
          stroke="#E4E4E4"
          strokeWidth={1}
        />
      ))}

      {showArea && (
        <polygon
          points={getPolygonPoints(data)}
          fill="#4F46E5"
          fillOpacity={0.6}
          stroke="#4F46E5"
          strokeWidth={2}
        />
      )}

      {axes.map((axis) => {
        const textOffset = 1.2;
        const textX = CENTER + RADIUS * Math.cos(axis.angle) * textOffset;
        const textY = CENTER + RADIUS * Math.sin(axis.angle) * textOffset;

        let textAnchor: TextAnchor = "middle";
        if (Math.abs(axis.x - CENTER) > 20) {
          textAnchor = axis.x > CENTER ? "start" : "end";
        }

        return (
          <text
            key={axis.category}
            x={textX}
            y={textY + 4}
            textAnchor={textAnchor}
            fontSize={11}
            fill="#333"
          >
            {axis.category}
          </text>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------
// 시간표 / 서비스 업데이트 더미 데이터
// ---------------------------------------------------------------------
const timetable = [
  { day: "MON", time: "09:00", course: "자료구조", color: "bg-[#E8F2FF] text-[#1D4ED8]" },
  { day: "WED", time: "09:00", course: "자료구조", color: "bg-[#E8F2FF] text-[#1D4ED8]" },
  { day: "THU", time: "09:00", course: "물리학 개론", color: "bg-[#FFE0EB] text-[#C026D3]" },

  { day: "TUE", time: "10:00", course: "팀 프로젝트", color: "bg-[#FFF7E8] text-[#D97706]" },
  { day: "WED", time: "10:00", course: "선형대수학", color: "bg-[#F1E9FF] text-[#6D28D9]" },

  { day: "FRI", time: "11:00", course: "사회봉사", color: "bg-[#E6F0FF] text-[#1E40AF]" },

  { day: "MON", time: "13:00", course: "영어회화", color: "bg-[#E8FBEF] text-[#065F46]" },
  { day: "TUE", time: "13:00", course: "논리 및 사고", color: "bg-[#F7F7F7] text-[#4B5563]" },
  { day: "FRI", time: "13:00", course: "영어회화", color: "bg-[#E8FBEF] text-[#065F46]" },

  { day: "THU", time: "14:00", course: "웹프로그래밍", color: "bg-[#FFEFD9] text-[#9A3412]" },

  { day: "FRI", time: "15:00", course: "데이터베이스", color: "bg-[#F1E9FF] text-[#6D28D9]" },

  { day: "MON", time: "16:00", course: "채플", color: "bg-[#F5F5F5] text-[#4B5563]" },
];

const days = ["MON", "TUE", "WED", "THU", "FRI"];
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const serviceUpdates = [
  { id: 1, title: "2025학년도 2학기 시간표 등록 기능 오픈", date: "2025.08.15" },
  { id: 2, title: "AI 추천 강의 목록 기능 베타 테스트 시작", date: "2025.09.01" },
  { id: 3, title: "졸업 이수 학점 시뮬레이션 개선", date: "2025.09.20" },
];

// ---------------------------------------------------------------------
// Dashboard 메인 컴포넌트
// ---------------------------------------------------------------------
export default function Dashboard({
  userData,
}: {
  userData?: { creditRadarData?: CreditRadarItem[] };
}) {
  const hasUserRadar =
    userData?.creditRadarData &&
    userData.creditRadarData.length === NUM_AXES &&
    userData.creditRadarData.some((d) => d.value > 0);

  const radarData = hasUserRadar ? userData!.creditRadarData! : defaultCreditRadarData;
  const showArea = !!hasUserRadar;

  return (
    <div
      className="font-sans"
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F7F7",
        fontFamily: "sans-serif",
      }}
    >
      {/* 상단 메뉴와의 여백: 대시보드와 동일 수준 */}
      <main
        className="px-4 sm:px-6"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingTop: "48px",
          paddingBottom: "48px",
        }}
      >
        {/* 상단 카드 2개 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "2rem",
            alignItems: "stretch",
          }}
        >
          {/* 1. 학점 현황 카드 */}
          <Card className="flex h-[480px] flex-col rounded-[15px] border-[#E4E4E4] bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-bold">이번 학기 학점 현황</CardTitle>
              <CardDescription className="mt-1">
                2025학년도 2학기 성적 진행 상황
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-6 pb-6">
              <div className="h-[210px] flex items-center justify-center">
                <SimpleRadarChart data={radarData} showArea={showArea} />
              </div>

              <Link
                to="/requirements"
                className="mt-auto flex h-[40px] w-full items-center justify-center rounded-[20px] border border-[#D4D4D4] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                이수학점 자세히 보기
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          {/* 2. 시간표 카드 */}
          <Card className="flex h-[480px] flex-col rounded-[15px] border-[#E4E4E4] bg-white shadow-sm">
            <CardHeader className="pb-3">
              {/* 제목 + 우측 작은 설명 (주간 강의 일정) */}
              <div className="flex items-baseline justify-between">
                <CardTitle className="font-bold">이번 학기 시간표</CardTitle>
                <span className="text-[11px] text-muted-foreground">
                  주간 강의 일정
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4 pb-6">
              {/* 학기별 시간표 라벨이 시간표 바로 위에 붙도록 */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>학기별 시간표</span>
              </div>

              {/* 시간표 그리드 */}
              <div className="rounded-[15px] border border-[#E4E4E4] bg-white p-4">
                <div
                  className="grid"
                  style={{ gridTemplateColumns: "60px repeat(5, 1fr)", gap: "6px" }}
                >
                  {/* 좌상단 빈칸 */}
                  <div className="h-9" />
                  {/* 요일 */}
                  {days.map((day) => (
                    <div
                      key={day}
                      className="flex h-9 items-center justify-center rounded-[10px] bg-[#F5F5F5] text-xs font-semibold text-gray-700"
                    >
                      {day}
                    </div>
                  ))}

                  {/* 시간 + 각 칸 */}
                  {timeSlots.map((time) => (
                    <React.Fragment key={time}>
                      {/* 왼쪽 시간 표시 */}
                      <div className="flex h-[40px] items-center justify-end pr-2 text-xs font-semibold text-gray-500">
                        {time}
                      </div>

                      {days.map((day) => {
                        const classItem = timetable.find(
                          (t) => t.day === day && t.time === time
                        );

                        return (
                          <div
                            key={`${day}-${time}`}
                            className={`flex h-[40px] flex-col justify-center rounded-[10px] border px-2 py-1 ${
                              classItem
                                ? `${classItem.color} border-transparent shadow-sm hover:shadow-md cursor-pointer transition-shadow`
                                : "border-[#EDEDED] bg-[#F9F9F9] hover:bg-[#F2F2F2] transition-colors"
                            }`}
                          >
                            {classItem && (
                              <p className="truncate font-medium text-xs">
                                {classItem.course}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <Link
                to="/mypage"
                className="mt-auto flex h-[40px] w-full items-center justify-center rounded-[20px] border border-[#D4D4D4] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                시간표 편집하기
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* 3. 서비스 업데이트 카드 */}
        <div className="mt-8">
          <Card className="rounded-[15px] border-[#E4E4E4] bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-bold">서비스 업데이트</CardTitle>
              <CardDescription className="mt-1">
                UpGrade는 여러분의 대학생활을 응원합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="mx-auto w-full max-w-[720px] space-y-2 text-sm">
                {serviceUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="flex w-full items-center justify-between rounded-[12px] bg-gray-50/60 px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className="bg-[#E0E7FF] text-[#4F46E5] border-transparent">
                        업데이트
                      </Badge>
                      <span className="truncate text-sm text-gray-700">
                        {update.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {update.date}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
