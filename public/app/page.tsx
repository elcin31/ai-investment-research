import { getDefaultPortfolio } from "@/lib/data/dataService";
import { calculatePortfolioMetrics } from "@/lib/calculations/portfolioMetrics";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { AllocationBar } from "@/components/portfolio/AllocationBar";
import { HoldingsList } from "@/components/portfolio/HoldingsList";

export default async function Home() {
  const portfolio = await getDefaultPortfolio();
  const metrics = calculatePortfolioMetrics(portfolio.holdings);

  return (
    <div className="min-h-screen pb-24">
      <AppHeader portfolioName={portfolio.name} />

      <main className="flex flex-col gap-4 px-4 py-4">
        <PortfolioSummary metrics={metrics} />
        <AllocationBar allocation={metrics.allocationByAssetClass} />
        <HoldingsList holdings={metrics.holdings} />
      </main>

      <BottomNav />
    </div>
  );
}
