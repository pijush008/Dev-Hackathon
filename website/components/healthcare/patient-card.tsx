"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Calendar, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PatientCardProps {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  bloodGroup: string;
  lastVisit: string;
  status: "active" | "critical" | "inactive";
  avatarUrl?: string;
  conditions?: string[];
  onCall?: () => void;
  onEmail?: () => void;
  onView?: () => void;
}

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  critical: {
    label: "Critical",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/50",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "from-blue-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-sky-500",
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function PatientCard({
  name,
  age,
  gender,
  phone,
  email,
  bloodGroup,
  lastVisit,
  status,
  avatarUrl,
  conditions = [],
  onCall,
  onEmail,
  onView,
}: PatientCardProps) {
  const s = statusConfig[status];
  const color = getColor(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/5">
        {/* Top accent bar */}
        <div
          className={`h-1 ${
            status === "critical"
              ? "bg-red-500"
              : status === "active"
                ? "bg-emerald-500"
                : "bg-muted-foreground/30"
          }`}
        />
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            {/* Avatar + Info */}
            <div className="flex items-start gap-3.5">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={name}
                  className="size-12 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <div
                  className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${color} text-sm font-bold text-white`}
                >
                  {getInitials(name)}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold truncate">{name}</h3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.className}`}
                  >
                    <span className={`size-1 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {age} yrs · {gender} · {bloodGroup}
                </p>
              </div>
            </div>
            <button className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
              <MoreVertical className="size-4" />
            </button>
          </div>

          {/* Conditions */}
          {conditions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {conditions.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Details */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Phone className="size-3" />
              {phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="size-3" />
              <span className="truncate">{email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3" />
              Last visit: {lastVisit}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2 border-t pt-3">
            <button
              onClick={onCall}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              <Phone className="size-3" />
              Call
            </button>
            <button
              onClick={onEmail}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <Mail className="size-3" />
              Email
            </button>
            <button
              onClick={onView}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              View
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
