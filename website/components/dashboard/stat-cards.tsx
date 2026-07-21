"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  FolderKanban,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
}

const stats: StatCard[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    trend: "up",
    icon: DollarSign,
    color: "from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1% from last month",
    trend: "up",
    icon: Users,
    color: "from-blue-500/20 to-blue-500/5 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Projects",
    value: "12",
    change: "+2 this week",
    trend: "up",
    icon: FolderKanban,
    color: "from-violet-500/20 to-violet-500/5 text-violet-600 dark:text-violet-400",
  },
  {
    title: "Growth Rate",
    value: "+12.5%",
    change: "Steady increase",
    trend: "up",
    icon: TrendingUp,
    color: "from-amber-500/20 to-amber-500/5 text-amber-600 dark:text-amber-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export function StatCards() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
        return (
          <motion.div key={stat.title} variants={cardVariants}>
            <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br opacity-50" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg bg-gradient-to-br",
                    stat.color,
                  )}
                >
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendIcon
                    className={cn(
                      "size-3",
                      stat.trend === "up"
                        ? "text-emerald-500"
                        : "text-red-500",
                    )}
                  />
                  <span>{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
