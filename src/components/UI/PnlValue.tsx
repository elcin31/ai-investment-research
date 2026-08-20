import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPct } from "@/lib/utils/format";

interface PnlValueProps {
  pct: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function PnlValue({ pct, size = "md", showIcon = true, className }: PnlValueProps) {
  const isPositive = pct > 0;
  const isNegative = pct < 0;
  const isFlat = pct === 0;

  const sizeClasses = {
    sm: "text-xs gap-0.5",
    md: "text-sm gap-1",
    lg: "text-lg gap-1",
  };

  const Icon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Minus;

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono tabular-nums",
        sizeClasses[size],
        isPositive && "text-primary",
        isNegative && "text-danger",
        isFlat && "text-textSecondary",
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />}
      {formatPct(pct)}
    </span>
  );
}
