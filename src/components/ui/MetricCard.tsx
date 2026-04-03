"use client";

import { cn } from "@/lib/utils";

export default function MetricCard({
  value,
  label,
  icon,
  className,
  accentColor,
}: {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  accentColor?: string;
}) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-5 flex flex-col gap-1 transition-all hover:shadow-md hover:border-slate-200",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl font-extrabold text-slate-800 tracking-tight" style={accentColor ? { color: accentColor } : undefined}>
          {value}
        </span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
