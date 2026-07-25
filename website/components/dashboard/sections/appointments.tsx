"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  ChevronRight,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: "in-person" | "video" | "follow-up";
  status: "upcoming" | "completed" | "cancelled";
  location?: string;
}

const appointments: Appointment[] = [
  {
    id: "1",
    doctor: "Dr. Sarah Chen",
    specialty: "Cardiologist",
    date: "Tomorrow",
    time: "10:30 AM",
    type: "in-person",
    status: "upcoming",
    location: "Heart Care Clinic, Room 204",
  },
  {
    id: "2",
    doctor: "Dr. Marcus Rivera",
    specialty: "Primary Care",
    date: "Jul 28",
    time: "2:00 PM",
    type: "video",
    status: "upcoming",
  },
  {
    id: "3",
    doctor: "Dr. Priya Sharma",
    specialty: "Endocrinologist",
    date: "Aug 3",
    time: "11:00 AM",
    type: "in-person",
    status: "upcoming",
    location: "Diabetes Center, Floor 3",
  },
];

const statusStyles = {
  upcoming: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const typeIcons = {
  "in-person": MapPin,
  video: Video,
  "follow-up": Calendar,
};

export function Appointments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">Appointments</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {appointments.length} upcoming
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
          Book New
        </Button>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {appointments.map((apt, i) => {
          const TypeIcon = typeIcons[apt.type];
          return (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="group rounded-xl border bg-card p-3.5 transition-all hover:shadow-md hover:shadow-primary/5"
            >
              <div className="flex items-start gap-3">
                {/* Doctor avatar */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <User className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">{apt.doctor}</h4>
                        <Badge
                          variant="secondary"
                          className={cn("text-[10px] px-1.5 py-0", statusStyles[apt.status])}
                        >
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                    </div>
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <TypeIcon className="size-4" />
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {apt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {apt.time}
                    </span>
                    {apt.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {apt.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
          View all appointments
          <ChevronRight className="size-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
