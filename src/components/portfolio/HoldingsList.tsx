import type { HoldingMetrics } from "@/types/portfolio";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { HoldingRow } from "@/components/portfolio/HoldingRow";

interface HoldingsListProps {
  holdings: HoldingMetrics[];
}

export function HoldingsList({ holdings }: HoldingsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Позиции</CardTitle>
      </CardHeader>
      <div className="divide-y divide-border px-1 pb-1">
        {holdings.map((hm) => (
          <HoldingRow key={hm.holding.id} metrics={hm} />
        ))}
      </div>
    </Card>
  );
}
