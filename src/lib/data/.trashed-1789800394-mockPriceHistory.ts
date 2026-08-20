import type { PricePoint } from "@/types/portfolio";

/**
 * Simple deterministic pseudo-random generator (mulberry32) so that mock
 * price history is stable across server and client renders — avoids
 * hydration mismatches, which a Math.random() based generator would cause.
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function generatePriceHistory(
  ticker: string,
  startPrice: number,
  days: number = 30,
  dailyVolatility: number = 0.018
): PricePoint[] {
  const rand = mulberry32(seedFromString(ticker));
  const points: PricePoint[] = [];
  let price = startPrice;

  const today = new Date("2026-08-20T00:00:00Z");

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Slight upward drift + noise, clamped so mock data stays plausible.
    const drift = 0.0004;
    const noise = (rand() - 0.5) * 2 * dailyVolatility;
    price = Math.max(price * (1 + drift + noise), 0.01);

    points.push({
      date: date.toISOString().slice(0, 10),
      close: Math.round(price * 100) / 100,
    });
  }

  // Force the last point to equal startPrice-adjusted "current" value by
  // leaving generation as-is; callers that need an exact current price
  // should read holding.currentPrice separately, history is for trend only.
  return points;
}
