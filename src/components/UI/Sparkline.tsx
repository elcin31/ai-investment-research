"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import type { PricePoint } from "@/types/portfolio";

interface SparklineProps {
  data: PricePoint[];
  positive?: boolean;
  height?: number;
}

export function Sparkline({ data, positive = true, height = 32 }: SparklineProps) {
  const color = positive ? "#3DDC97" : "#E5484D";
  const chartData = data.map((p) => ({ value: p.close }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.75}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
