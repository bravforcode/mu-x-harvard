"use client";

import { cn } from "@/lib/utils";

export default function MiniChart({
  data,
  color = "#4f6bed",
  height = 40,
  width = 120,
  className,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  className?: string;
}) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const barWidth = width / data.length - 2;

  return (
    <svg width={width} height={height} className={cn("block", className)}>
      {data.map((val, i) => {
        const barHeight = ((val - min) / range) * (height - 4) + 4;
        const isLast = i === data.length - 1;
        return (
          <rect
            key={i}
            x={i * (barWidth + 2) + 1}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={barWidth / 2}
            fill={isLast ? color : color + "40"}
          />
        );
      })}
    </svg>
  );
}
