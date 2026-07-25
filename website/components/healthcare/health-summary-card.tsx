"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HealthSummaryProps {
  stats: {
    total: number;
    withAI: number;
    abnormalFindings: number;
    recommendations: string[];
  };
  hasAbnormal: boolean;
}

export function HealthSummaryCard({ stats, hasAbnormal }: HealthSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Shield className="size-4 text-primary" />
          Health Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground">Total Reports</p>
          </div>
          <div className="rounded-xl bg-primary/5 p-3 text-center">
            <p className="text-2xl font-bold text-primary">{stats.withAI}</p>
            <p className="text-[10px] text-muted-foreground">AI Analyzed</p>
          </div>
          <div className={cn(
            "rounded-xl p-3 text-center",
            hasAbnormal ? "bg-red-500/5" : "bg-emerald-500/5"
          )}>
            <p className={cn("text-2xl font-bold", hasAbnormal ? "text-red-500" : "text-emerald-500")}>
              {stats.abnormalFindings}
            </p>
            <p className="text-[10px] text-muted-foreground">Abnormal</p>
          </div>
        </div>

        {/* Risk status */}
        <div className={cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm",
          hasAbnormal ? "bg-red-500/10 text-red-700 dark:text-red-400" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
        )}>
          {hasAbnormal ? (
            <AlertTriangle className="size-4 shrink-0" />
          ) : (
            <CheckCircle2 className="size-4 shrink-0" />
          )}
          <span className="font-medium">
            {hasAbnormal
              ? "Abnormal findings require attention"
              : "All recent reports look good"}
          </span>
        </div>

        {/* Top recommendations */}
        {stats.recommendations.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Key Recommendations
            </p>
            <ul className="space-y-1.5">
              {stats.recommendations.slice(0, 3).map((rec, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <TrendingUp className="mt-0.5 size-3 shrink-0 text-primary" />
                  {rec}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
