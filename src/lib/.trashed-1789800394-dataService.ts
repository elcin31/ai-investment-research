import type { Portfolio } from "@/types/portfolio";
import { mockPortfolio } from "@/lib/data/mockPortfolio";

/**
 * Single point of abstraction for all data access in the app.
 *
 * Today this returns mock data synchronously. When real market data is
 * wired in (e.g. via an Alpha Vantage or similar API), only this file
 * should need to change — callers already treat these as async calls,
 * so swapping the implementation won't ripple through components.
 */

export async function getPortfolio(portfolioId: string): Promise<Portfolio> {
  if (portfolioId !== mockPortfolio.id) {
    throw new Error(`Portfolio not found: ${portfolioId}`);
  }
  return mockPortfolio;
}

export async function getDefaultPortfolio(): Promise<Portfolio> {
  return mockPortfolio;
}
