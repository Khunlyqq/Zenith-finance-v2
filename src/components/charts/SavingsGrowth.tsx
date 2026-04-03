"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface SavingsGrowthProps {
  data: {
    month: string;
    balance: number;
  }[];
}

const chartConfig = {
  balance: {
    label: "Saldo Tabungan",
    color: "#86d2e5",
  },
} satisfies ChartConfig;

export default function SavingsGrowth({ data }: SavingsGrowthProps) {
  return (
    <div className="w-full h-24 mt-4">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#86d2e5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#86d2e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} horizontal={false} />
          <XAxis hide dataKey="month" />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" hideLabel className="glass-panel border-white/10" />}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#86d2e5"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#growthGrad)"
            animationDuration={2000}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

