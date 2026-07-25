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
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Vital {
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  trendLabel: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  data: number[];
}

const vitals: Vital[] = [
  {
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    trend: "stable",
    trendLabel: "Normal range",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    data: [68, 72, 70, 74, 71, 73, 72],
  },
  {
    label: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    trend: "down",
    trendLabel: "Improved",
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
    trendLabel: "+2%",
    icon: Droplets,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    data: [90, 92, 94, 93, 96, 94, 95],
  },
  {
    label: "Temperature",
    value: "98.6",
    unit: "°F",
    trend: "stable",
    trendLabel: "Normal",
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
    trendLabel: "+12% better",
    icon: Moon,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    data: [6.2, 6.5, 7.0, 7.2, 7.4, 7.3, 7.5],
  },
  {
    label: "Steps Today",
    value: "8,432",
    unit: "steps",
    trend: "up",
    trendLabel: "Goal 80%",
    icon: Footprints,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    data: [6500, 7200, 7800, 8100, 7900, 8200, 8432],
  },
];

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 28;
  const w = 56;
  const step = w / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
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

const TrendBadge = ({ trend, label }: { trend: Vital["trend"]; label: string }) => (
  <span className={cn(
    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
    trend === "up" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    trend === "down" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    trend === "stable" && "bg-muted text-muted-foreground",
  )}>
    {trend === "up" && <TrendingUp className="size-3" />}
    {trend === "down" && <TrendingDown className="size-3" />}
    {trend === "stable" && <Minus className="size-3" />}
    {label}
  </span>
);

export function HealthOverview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Health Overview</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
          View All
          <ArrowUpRight className="size-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {vitals.map((vital, i) => {
            const Icon = vital.icon;
            return (
              <motion.div
                key={vital.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
              >
                <div className="group rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:shadow-primary/5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex size-10 items-center justify-center rounded-xl", vital.bg)}>
                        <Icon className={cn("size-5", vital.color)} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{vital.label}</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold tracking-tight">{vital.value}</span>
                          <span className="text-xs text-muted-foreground">{vital.unit}</span>
                        </div>
                      </div>
                    </div>
                    <SparkLine data={vital.data} color={vital.color} />
                  </div>
                  <div className="mt-3">
                    <TrendBadge trend={vital.trend} label={vital.trendLabel} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
