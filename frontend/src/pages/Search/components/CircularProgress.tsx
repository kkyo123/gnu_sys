import React from 'react';

interface CircularProgressProps {
  value: number;
  max: number;
  radius?: number;
  strokeWidth?: number;
  label: string;
  helper?: string;
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
  const safeValue = Math.min(Math.max(value, 0), max);
  const progress = max === 0 ? 0 : safeValue / max;
  const circumference = 2 * Math.PI * radius;
  const dash = `${progress * circumference} ${circumference}`;
  const strokeClass =
    tone === 'success' ? 'text-green-500' : tone === 'warning' ? 'text-amber-500' : 'text-primary';

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={dash}
          className={`${strokeClass} transition-all duration-500`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-semibold">{label}</div>
        {helper && <span className="text-sm text-muted-foreground">{helper}</span>}
      </div>
    </div>
  );
};
