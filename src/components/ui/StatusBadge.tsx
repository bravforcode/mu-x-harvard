"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "done" | "active" | "pending" | "warning" | "critical" | "info";

const variantStyles: Record<BadgeVariant, string> = {
  done: "bg-success/10 text-success",
  active: "bg-primary/10 text-primary",
  pending: "bg-slate-100 text-slate-500",
  warning: "bg-warning/10 text-warning",
  critical: "bg-critical/10 text-critical",
  info: "bg-info/10 text-info",
};

export default function StatusBadge({
  variant,
  children,
  className,
  pulse = false,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full",
        variantStyles[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
