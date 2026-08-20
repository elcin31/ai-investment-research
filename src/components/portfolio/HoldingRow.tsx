import type { HoldingMetrics } from "@/types/portfolio";
import { PnlValue } from "@/components/ui/PnlValue";
import { Sparkline } from "@/components/ui/Sparkline";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { assetClassLabels } from "@/lib/utils/assetClass";

interface HoldingRowProps {
  metrics: HoldingMetrics;
}

export function HoldingRow({ metrics }: HoldingRowProps) {
  const { holding, marketValue, unrealizedPnlPct, weightPct, dayChangePct } = metrics;

  return (
    <div className="flex items-center gap-3 py-3.5 px-4 min-h-[64px] active:bg-surfaceAlt transition-colors rounded-xl">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-textPrimary">{holding.ticker}</span>
          <Badge tone="neutral">{assetClassLabels[holding.assetClass]}</Badge>
        </div>
        <p className="text-sm text-textSecondary truncate mt-0.5">{holding.name}</p>
        <p className="text-xs text-textSecondary mt-1 font-mono tabular-nums">
          {formatNumber(holding.quantity, holding.quantity < 10 ? 2 : 0)} ×{" "}
          {formatCurrency(holding.currentPrice)}
        </p>
      </div>

      <div className="w-16 shrink-0 hidden xs:block">
        <Sparkline data={holding.history} positive={dayChangePct >= 0} />
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0 min-w-[92px]">
        <span className="font-mono tabular-nums font-semibold text-textPrimary">
          {formatCurrency(marketValue)}
        </span>
        <PnlValue pct={unrealizedPnlPct} size="sm" />
        <span className="text-xs text-textSecondary font-mono tabular-nums">
          {formatNumber(weightPct, 1)}%
        </span>
      </div>
    </div>
  );
}
