import React from 'react';

interface CircularProgressProps {
  value: number; // 현재 값 (예: 이수 학점)
  max: number; // 최대 값 (예: 전체 필요 학점)
  radius?: number;
  strokeWidth?: number;
  label: string; // 중앙에 표시할 텍스트
  helper?: string; // 라벨 아래 보조 텍스트
  tone?: 'default' | 'success' | 'warning';
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  radius = 80,
  strokeWidth = 16,
  label,
  helper,
  tone = 'default',
}) => {
  // value를 0 ~ max 범위로 안전하게 클램프
  const safeMax = max <= 0 ? 1 : max;
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const progress = safeMax === 0 ? 0 : safeValue / safeMax;

  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - progress);

  const strokeColor =
    tone === 'success'
      ? '#22c55e' // tailwind green-500
      : tone === 'warning'
      ? '#666666ff' // tailwind amber-500
      : 'hsl(var(--primary))';

  const trackColor = 'hsl(var(--muted-foreground))';

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        {/* 배경 트랙 */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke={trackColor}
          strokeOpacity={0.2}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 진행도 */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-500"
          strokeLinecap="round"
        />
      </svg>

      {/* 중앙 텍스트 영역 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-semibold">{label}</div>
        {helper && (
          <span className="text-sm text-muted-foreground whitespace-pre-line">
            {helper}
          </span>
        )}
      </div>
    </div>
  );
};
