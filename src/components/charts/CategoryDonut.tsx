"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface CategoryDonutProps {
  data: {
    category: string;
    amount: number;
    fill: string;
    label?: string;
    color?: string;
  }[];
}

const defaultChartConfig = {
  amount: {
    label: "Jumlah",
  },
} satisfies ChartConfig;

export default function CategoryDonut({ data }: CategoryDonutProps) {
  const totalAmount = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.amount, 0);
  }, [data]);

  // Dynamic config based on passed data
  const dynamicConfig = React.useMemo(() => {
    const config: any = { ...defaultChartConfig };
    data.forEach((item) => {
      config[item.category] = {
        label: item.label || item.category,
        color: item.color || "#86d2e5",
      };
    });
    return config as ChartConfig;
  }, [data]);

  return (
    <div className="flex flex-col h-full">
      <ChartContainer
        config={dynamicConfig}
        className="mx-auto aspect-square h-[220px]"
      >
        <PieChart>
          <defs>
            {data.map((item, idx) => (
              <linearGradient key={idx} id={`${item.category}Grad`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={item.color || "#86d2e5"} />
                <stop offset="100%" stopColor={`${item.color}cc` || "#006778"} />
              </linearGradient>
            ))}
          </defs>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel className="glass-panel border-white/10" />}
          />
          <Pie
            data={data.map(item => ({ ...item, fill: `url(#${item.category}Grad)` }))}
            dataKey="amount"
            nameKey="category"
            innerRadius={80}
            outerRadius={95}
            strokeWidth={0}
            paddingAngle={2}
            cornerRadius={6}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <g>
                      <text
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 10}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-[#899295] text-[10px] font-black uppercase tracking-[0.2em]"
                      >
                        TOTAL
                      </text>
                      <text
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 16}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white text-2xl font-black tracking-tighter"
                      >
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(totalAmount).replace("Rp", "")}
                      </text>
                    </g>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      
      <div className="space-y-2 mt-6">
        {data.map((item) => (
          <div key={item.category} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl transition-all group">
            <div className="flex items-center gap-4">
              <div 
                className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" 
                style={{ background: item.color || "#86d2e5" }}
              ></div>
              <span className="text-xs font-bold text-[#bec8cb]">{item.label || item.category}</span>
            </div>
            <span className="text-xs font-black text-white">
              {totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0}%
            </span>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-8 text-[#899295] text-[10px] font-bold uppercase tracking-widest italic opacity-50">
            Belum ada data pengeluaran...
          </div>
        )}
      </div>
    </div>
  );
}

