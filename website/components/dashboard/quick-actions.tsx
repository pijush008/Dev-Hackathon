"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Upload,
  Users,
  CreditCard,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  href: string;
}

const actions: QuickAction[] = [
  {
    title: "Create Project",
    description: "Start a new project",
    icon: Plus,
    color: "from-blue-500 to-blue-600",
    href: "/dashboard/projects/new",
  },
  {
    title: "Invite Team",
    description: "Add team members",
    icon: Users,
    color: "from-violet-500 to-violet-600",
    href: "/dashboard/users/invite",
  },
  {
    title: "Upgrade Plan",
    description: "Go premium today",
    icon: CreditCard,
    color: "from-amber-500 to-orange-500",
    href: "/dashboard/billing",
  },
  {
    title: "Import Data",
    description: "Bulk import from CSV",
    icon: Upload,
    color: "from-emerald-500 to-emerald-600",
    href: "/dashboard/import",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3"
        >
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.a
                key={action.title}
                href={action.href}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent/50"
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                    action.color,
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </motion.a>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}
