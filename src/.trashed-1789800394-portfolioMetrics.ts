import type {
  Holding,
  HoldingMetrics,
  PortfolioMetrics,
  AssetClass,
} from "@/types/portfolio";

/**
 * All functions in this module are pure: same input always produces the
 * same output, no I/O, no mutation of arguments. This is the single
 * source of truth for portfolio math — UI components and any AI
 * explanation layer must consume these results, never recompute them.
 */

export function calculateMarketValue(holding: Holding): number {
  return holding.quantity * holding.currentPrice;
}

export function calculateCostBasis(holding: Holding): number {
  return holding.quantity * holding.avgCost;
}

export function calculateUnrealizedPnl(holding: Holding): number {
  return calculateMarketValue(holding) - calculateCostBasis(holding);
}

export function calculateUnrealizedPnlPct(holding: Holding): number {
  const costBasis = calculateCostBasis(holding);
  if (costBasis === 0) return 0;
  return (calculateUnrealizedPnl(holding) / costBasis) * 100;
}

export function calculateDayChangePct(holding: Holding): number {
  const history = holding.history;
  if (history.length < 2) return 0;
  const prev = history[history.length - 2].close;
  const last = history[history.length - 1].close;
  if (prev === 0) return 0;
  return ((last - prev) / prev) * 100;
}

export function calculateHoldingMetrics(
  holding: Holding,
  portfolioTotalValue: number
): HoldingMetrics {
  const marketValue = calculateMarketValue(holding);
  const costBasis = calculateCostBasis(holding);
  const unrealizedPnl = calculateUnrealizedPnl(holding);
  const unrealizedPnlPct = calculateUnrealizedPnlPct(holding);
  const weightPct = portfolioTotalValue === 0 ? 0 : (marketValue / portfolioTotalValue) * 100;
  const dayChangePct = calculateDayChangePct(holding);

  return {
    holding,
    marketValue,
    costBasis,
    unrealizedPnl,
    unrealizedPnlPct,
    weightPct,
    dayChangePct,
  };
}

export function calculateAllocationByAssetClass(
  holdings: Holding[],
  totalValue: number
): { assetClass: AssetClass; value: number; pct: number }[] {
  const byClass = new Map<AssetClass, number>();

  for (const holding of holdings) {
    const value = calculateMarketValue(holding);
    byClass.set(holding.assetClass, (byClass.get(holding.assetClass) ?? 0) + value);
  }

  return Array.from(byClass.entries())
    .map(([assetClass, value]) => ({
      assetClass,
      value,
      pct: totalValue === 0 ? 0 : (value / totalValue) * 100,
    }))
    .sort((a, b) => b.value - a.value);
}

export function calculatePortfolioMetrics(holdings: Holding[]): PortfolioMetrics {
  const totalMarketValue = holdings.reduce((sum, h) => sum + calculateMarketValue(h), 0);
  const totalCostBasis = holdings.reduce((sum, h) => sum + calculateCostBasis(h), 0);
  const totalUnrealizedPnl = totalMarketValue - totalCostBasis;
  const totalUnrealizedPnlPct =
    totalCostBasis === 0 ? 0 : (totalUnrealizedPnl / totalCostBasis) * 100;

  const holdingMetrics = holdings
    .map((h) => calculateHoldingMetrics(h, totalMarketValue))
    .sort((a, b) => b.marketValue - a.marketValue);

  // Portfolio day change = value-weighted average of holding day changes.
  const dayChangePct =
    totalMarketValue === 0
      ? 0
      : holdingMetrics.reduce(
          (sum, hm) => sum + hm.dayChangePct * (hm.marketValue / totalMarketValue),
          0
        );

  return {
    totalMarketValue,
    totalCostBasis,
    totalUnrealizedPnl,
    totalUnrealizedPnlPct,
    dayChangePct,
    holdings: holdingMetrics,
    allocationByAssetClass: calculateAllocationByAssetClass(holdings, totalMarketValue),
  };
}
