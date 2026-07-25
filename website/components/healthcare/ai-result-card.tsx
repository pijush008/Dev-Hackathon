"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  children: React.ReactNode;
  className?: string;
}

export function ResultCard({ title, icon: Icon, iconColor, iconBg, children, className }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("overflow-hidden rounded-xl border bg-card shadow-sm", className)}
    >
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={cn("flex size-7 items-center justify-center rounded-lg", iconBg || "bg-primary/10")}>
              <Icon className={cn("size-4", iconColor || "text-primary")} />
            </div>
          )}
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  );
}

// ─── Urgency Badge ──────────────────────────────────────────────────────────

const urgencyConfig = {
  low: { label: "Low Urgency", icon: Info, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  medium: { label: "Moderate", icon: AlertCircle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  high: { label: "High Urgency", icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" },
  emergency: { label: "Seek Emergency Care", icon: Shield, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
};

export function UrgencyBadge({ urgency }: { urgency: string }) {
  const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.medium;
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", config.bg, config.color)}>
      <Icon className="size-3.5" />
      {config.label}
    </span>
  );
}

// ─── Likelihood Badge ───────────────────────────────────────────────────────

const likelihoodConfig = {
  low: { label: "Low", color: "text-muted-foreground" },
  medium: { label: "Possible", color: "text-amber-600 dark:text-amber-400" },
  high: { label: "Likely", color: "text-orange-600 dark:text-orange-400" },
};

export function LikelihoodBadge({ level }: { level: string }) {
  const config = likelihoodConfig[level as keyof typeof likelihoodConfig] || likelihoodConfig.low;
  return (
    <span className={cn("text-[10px] font-semibold uppercase tracking-wider", config.color)}>
      {config.label}
    </span>
  );
}

// ─── Finding Status Badge ───────────────────────────────────────────────────

const findingConfig = {
  normal: { label: "Normal", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  abnormal: { label: "Abnormal", color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
  borderline: { label: "Borderline", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
};

export function FindingBadge({ status }: { status: string }) {
  const config = findingConfig[status as keyof typeof findingConfig] || findingConfig.normal;
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium", config.bg, config.color)}>
      {config.label}
    </span>
  );
}

// ─── Action List ────────────────────────────────────────────────────────────

export function ActionList({ items, icon: Icon }: { items: string[]; icon?: LucideIcon }) {
  const ItemIcon = Icon || ChevronRight;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-start gap-2 text-sm text-foreground"
        >
          <ItemIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}
