"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  AlertTriangle,
  MapPin,
  Heart,
  X,
  Siren,
  Shield,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const emergencyNumbers = [
  { label: "Emergency Services", number: "911", icon: Siren, color: "text-red-500" },
  { label: "Crisis Hotline", number: "988", icon: Heart, color: "text-rose-500" },
  { label: "Poison Control", number: "1-800-222-1222", icon: AlertTriangle, color: "text-amber-500" },
];

const quickActions = [
  { label: "Call 911", icon: Phone, color: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20" },
  { label: "Share Location", icon: MapPin, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20" },
  { label: "Alert Contacts", icon: Users, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20" },
  { label: "Safety Plan", icon: Shield, color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20" },
];

export function EmergencySOS() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden border-red-500/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-red-500/10">
            <Siren className="size-4 text-red-500" />
          </div>
          <CardTitle className="text-base font-semibold">Emergency SOS</CardTitle>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="gap-1.5"
        >
          <Phone className="size-3.5" />
          SOS
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Quick action grid */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl p-4 transition-colors",
                  action.color
                )}
              >
                <Icon className="size-6" />
                <span className="text-xs font-bold">{action.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Emergency numbers */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Emergency Numbers
          </p>
          {emergencyNumbers.map((contact) => {
            const Icon = contact.icon;
            return (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-2.5">
                  <Icon className={cn("size-4", contact.color)} />
                  {contact.label}
                </span>
                <span className="font-mono text-xs font-semibold text-primary">
                  {contact.number}
                </span>
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
