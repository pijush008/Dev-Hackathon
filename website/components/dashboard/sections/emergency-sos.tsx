"use client";

import { useState, useEffect, useCallback } from "react";
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
  Contact,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getEmergencyContacts } from "@/lib/actions/safety-plan";
import Link from "next/link";

const emergencyNumbers = [
  { label: "Emergency Services", number: "911", icon: Siren, color: "text-red-500" },
  { label: "Crisis Hotline", number: "988", icon: Heart, color: "text-rose-500" },
  { label: "Poison Control", number: "1-800-222-1222", icon: AlertTriangle, color: "text-amber-500" },
];

const quickActions = [
  { label: "Call 911", icon: Phone, color: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20", href: "tel:911" },
  { label: "Share Location", icon: MapPin, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20", href: null },
  { label: "Alert Contacts", icon: Users, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20", href: null },
  { label: "Safety Plan", icon: Shield, color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20", href: "/crisis" },
];

export function EmergencySOS() {
  const [expanded, setExpanded] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadContacts = useCallback(async () => {
    const res = await getEmergencyContacts();
    if (res.success) setContacts([...res.data]);
    setLoading(false);
  }, []);

  useEffect(() => { loadContacts(); }, [loadContacts]);

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
            const Wrapper = action.href ? "a" : "button";
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Wrapper
                  {...(action.href ? { href: action.href } : { onClick: () => {} })}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl p-4 transition-colors",
                    action.color
                  )}
                >
                  <Icon className="size-6" />
                  <span className="text-xs font-bold">{action.label}</span>
                </Wrapper>
              </motion.div>
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

        {/* User's personal emergency contacts */}
        {!loading && contacts.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Your Contacts
            </p>
            {contacts.slice(0, 3).map((c) => (
              <a
                key={c.id}
                href={`tel:${c.phone}`}
                className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2.5 text-sm transition-colors hover:bg-primary/10"
              >
                <span className="flex items-center gap-2.5">
                  <Contact className="size-4 text-primary" />
                  <span className="font-medium">{c.name}</span>
                </span>
                <span className="text-[10px] text-muted-foreground">{c.relationship}</span>
              </a>
            ))}
          </div>
        )}

        <Link href="/crisis">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            Manage contacts & safety plan
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
