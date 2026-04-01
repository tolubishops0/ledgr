"use client";
import { formatCurrency } from "@ledgr/utils";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface SpendingPieClientProps {
  data: {
    id: string;
    name: string;
    amount: number;
    color: string;
    icon?: React.ReactNode;
  }[];
}

export function SpendingPieClient({ data }: SpendingPieClientProps) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          isAnimationActive
          animationDuration={800}
        >
          {data.map((entry) => (
            <Cell key={entry.id} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(Number(value) || 0)}
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
