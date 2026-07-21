"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Moon,
  Footprints,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  data: number[];
}

interface HealthStatisticsProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  {
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    trend: "stable",
    trendValue: "0%",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-500/10",
    data: [68, 72, 70, 74, 71, 73, 72],
  },
  {
    label: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    trend: "down",
    trendValue: "-3%",
    icon: Activity,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    data: [125, 122, 120, 121, 119, 120, 120],
  },
  {
    label: "Blood Sugar",
    value: "95",
    unit: "mg/dL",
    trend: "up",
    trendValue: "+2%",
    icon: Droplets,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    data: [90, 92, 94, 93, 96, 94, 95],
  },
  {
    label: "Body Temp",
    value: "98.6",
    unit: "°F",
    trend: "stable",
    trendValue: "0%",
    icon: Thermometer,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    data: [98.4, 98.6, 98.5, 98.7, 98.6, 98.5, 98.6],
  },
  {
    label: "Sleep",
    value: "7.5",
    unit: "hrs",
    trend: "up",
    trendValue: "+12%",
    icon: Moon,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    data: [6.2, 6.5, 7.0, 7.2, 7.4, 7.3, 7.5],
  },
  {
    label: "Steps",
    value: "8,432",
    unit: "steps",
    trend: "up",
    trendValue: "+8%",
    icon: Footprints,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    data: [6500, 7200, 7800, 8100, 7900, 8200, 8432],
  },
];

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 32;
  const width = 64;
  const step = width / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={color}
      />
    </svg>
  );
}

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="size-3 text-emerald-500" />;
    case "down":
      return <TrendingDown className="size-3 text-red-500" />;
    default:
      return <Minus className="size-3 text-muted-foreground" />;
  }
};

export function HealthStatistics({ stats = defaultStats }: HealthStatisticsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Card className="group overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl",
                        stat.bg,
                      )}
                    >
                      <Icon className={cn("size-5", stat.color)} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold tracking-tight">
                          {stat.value}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {stat.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <MiniChart data={stat.data} color={stat.color} />
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <TrendIcon trend={stat.trend} />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      stat.trend === "up" && "text-emerald-500",
                      stat.trend === "down" && "text-red-500",
                      stat.trend === "stable" && "text-muted-foreground",
                    )}
                  >
                    {stat.trendValue}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    vs last week
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
