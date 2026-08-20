import type { Holding, Portfolio } from "@/types/portfolio";
import { generatePriceHistory } from "@/lib/data/mockPriceHistory";

function buildHolding(
  params: Omit<Holding, "history">
): Holding {
  return {
    ...params,
    history: generatePriceHistory(params.ticker, params.currentPrice, 30),
  };
}

export const mockPortfolio: Portfolio = {
  id: "portfolio-1",
  name: "Основной портфель",
  baseCurrency: "USD",
  holdings: [
    buildHolding({
      id: "h1",
      ticker: "AAPL",
      name: "Apple Inc.",
      assetClass: "equity",
      quantity: 42,
      avgCost: 168.5,
      currentPrice: 231.2,
      currency: "USD",
    }),
    buildHolding({
      id: "h2",
      ticker: "MSFT",
      name: "Microsoft Corp.",
      assetClass: "equity",
      quantity: 18,
      avgCost: 340.1,
      currentPrice: 468.75,
      currency: "USD",
    }),
    buildHolding({
      id: "h3",
      ticker: "NVDA",
      name: "NVIDIA Corp.",
      assetClass: "equity",
      quantity: 25,
      avgCost: 98.4,
      currentPrice: 178.9,
      currency: "USD",
    }),
    buildHolding({
      id: "h4",
      ticker: "VXUS",
      name: "Vanguard Total Intl Stock ETF",
      assetClass: "equity",
      quantity: 150,
      avgCost: 58.2,
      currentPrice: 63.4,
      currency: "USD",
    }),
    buildHolding({
      id: "h5",
      ticker: "AGG",
      name: "iShares Core US Aggregate Bond",
      assetClass: "bond",
      quantity: 200,
      avgCost: 97.8,
      currentPrice: 99.1,
      currency: "USD",
    }),
    buildHolding({
      id: "h6",
      ticker: "BTC",
      name: "Bitcoin",
      assetClass: "crypto",
      quantity: 0.85,
      avgCost: 61200,
      currentPrice: 108500,
      currency: "USD",
    }),
    buildHolding({
      id: "h7",
      ticker: "GLD",
      name: "SPDR Gold Shares",
      assetClass: "alternative",
      quantity: 60,
      avgCost: 178.3,
      currentPrice: 241.6,
      currency: "USD",
    }),
    buildHolding({
      id: "h8",
      ticker: "CASH",
      name: "Денежные средства",
      assetClass: "cash",
      quantity: 12400,
      avgCost: 1,
      currentPrice: 1,
      currency: "USD",
    }),
  ],
};
