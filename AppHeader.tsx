import { LineChart } from "lucide-react";

interface AppHeaderProps {
  portfolioName: string;
}

export function AppHeader({ portfolioName }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-2.5 border-b border-border bg-background/95 px-4 py-3.5 backdrop-blur">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <LineChart className="h-4.5 w-4.5" strokeWidth={2.25} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-textPrimary">{portfolioName}</span>
        <span className="text-xs text-textSecondary">Investment Research</span>
      </div>
    </header>
  );
}
