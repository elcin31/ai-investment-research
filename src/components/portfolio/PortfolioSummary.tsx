import type { PortfolioMetrics } from "@/types/portfolio";
import { StatTile } from "@/components/ui/StatTile";
import { formatCurrency } from "@/lib/utils/format";

interface PortfolioSummaryProps {
  metrics: PortfolioMetrics;
}

export function PortfolioSummary({ metrics }: PortfolioSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatTile
        label="Стоимость портфеля"
        value={formatCurrency(metrics.totalMarketValue)}
        deltaPct={metrics.dayChangePct}
        className="col-span-2"
      />
      <StatTile
        label="Нереализ. P&L"
        value={formatCurrency(metrics.totalUnrealizedPnl)}
        deltaPct={metrics.totalUnrealizedPnlPct}
      />
      <StatTile
        label="Изменение за день"
        value={`${metrics.dayChangePct >= 0 ? "+" : ""}${metrics.dayChangePct.toFixed(2)}%`}
        deltaPct={undefined}
      />
    </div>
  );
}
