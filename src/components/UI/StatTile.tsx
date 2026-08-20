import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { PnlValue } from "@/components/ui/PnlValue";
import { cn } from "@/lib/utils/cn";

interface StatTileProps {
  label: string;
  value: string;
  deltaPct?: number;
  sparkline?: ReactNode;
  className?: string;
}

export function StatTile({ label, value, deltaPct, sparkline, className }: StatTileProps) {
  return (
    <Card className={cn("p-4 flex flex-col gap-2", className)}>
      <span className="text-xs uppercase tracking-wider text-textSecondary">
        {label}
      </span>
      <div className="flex items-end justify-between gap-2">
        <span className="font-mono tabular-nums text-2xl font-semibold text-textPrimary leading-none">
          {value}
        </span>
        {deltaPct !== undefined && <PnlValue pct={deltaPct} size="sm" />}
      </div>
      {sparkline && <div className="mt-1">{sparkline}</div>}
    </Card>
  );
}
