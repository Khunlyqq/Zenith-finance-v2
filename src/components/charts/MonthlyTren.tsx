"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface MonthlyTrenProps {
  data: {
    month: string;
    income: number;
    expense: number;
  }[];
}

const chartConfig = {
  income: {
    label: "Pemasukan",
    color: "#86d2e5",
  },
  expense: {
    label: "Pengeluaran",
    color: "#ffb870",
  },
} satisfies ChartConfig;

export default function MonthlyTren({ data }: MonthlyTrenProps) {
  return (
    <div className="w-full h-[320px] mt-8">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          barGap={12}
        >
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86d2e5" stopOpacity={1} />
              <stop offset="60%" stopColor="#86d2e5" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#86d2e5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffb870" stopOpacity={1} />
              <stop offset="60%" stopColor="#ffb870" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ffb870" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          {/* Minimalist Axis - No Grid Lines */}
          <CartesianGrid vertical={false} horizontal={false} />
          
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={15}
            axisLine={false}
            className="text-[10px] font-black uppercase tracking-[0.2em] fill-[#899295]"
          />
          
          <ChartTooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }}
            content={<ChartTooltipContent indicator="line" className="glass-panel border-white/10" />}
          />
          
          <Bar 
            dataKey="income" 
            fill="url(#incomeGrad)" 
            radius={[6, 6, 0, 0]} 
            barSize={24}
            animationDuration={1500}
            className="filter drop-shadow-[0_0_8px_rgba(134,210,229,0.3)]"
          />
          <Bar 
            dataKey="expense" 
            fill="url(#expenseGrad)" 
            radius={[6, 6, 0, 0]} 
            barSize={24}
            animationDuration={1500}
            className="filter drop-shadow-[0_0_8px_rgba(255,184,112,0.3)]"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
