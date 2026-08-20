import type { AssetClass } from "@/types/portfolio";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { assetClassLabels, assetClassColors } from "@/lib/utils/assetClass";
import { formatCompactCurrency, formatNumber } from "@/lib/utils/format";

interface AllocationBarProps {
  allocation: { assetClass: AssetClass; value: number; pct: number }[];
}

export function AllocationBar({ allocation }: AllocationBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Распределение по классам активов</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {allocation.map((a) => (
            <div
              key={a.assetClass}
              style={{
                width: `${a.pct}%`,
                backgroundColor: assetClassColors[a.assetClass],
              }}
              className="h-full first:rounded-l-full last:rounded-r-full"
            />
          ))}
        </div>

        <ul className="flex flex-col gap-2.5">
          {allocation.map((a) => (
            <li key={a.assetClass} className="flex items-center gap-2.5 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: assetClassColors[a.assetClass] }}
              />
              <span className="flex-1 text-textPrimary">
                {assetClassLabels[a.assetClass]}
              </span>
              <span className="font-mono tabular-nums text-textSecondary">
                {formatCompactCurrency(a.value)}
              </span>
              <span className="font-mono tabular-nums text-textPrimary w-12 text-right">
                {formatNumber(a.pct, 1)}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
