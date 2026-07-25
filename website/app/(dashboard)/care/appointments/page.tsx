"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Plus,
  X,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAppointments, bookAppointment, cancelAppointment } from "@/lib/actions/appointments";

const statusStyles: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
  "in-progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "no-show": "bg-red-500/10 text-red-600 dark:text-red-400",
};

const typeIcons: Record<string, typeof MapPin> = {
  "in-person": MapPin,
  video: Video,
  "follow-up": Calendar,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    providerName: "",
    scheduledAt: "",
    type: "in-person",
    reason: "",
    location: "",
  });
  const [saving, setSaving] = useState(false);

  const loadAppointments = useCallback(async () => {
    const res = await getAppointments();
    if (res.success) setAppointments([...res.data]);
    setLoading(false);
  }, []);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  const handleBook = async () => {
    if (!form.scheduledAt || !form.providerName) return;
    setSaving(true);
    await bookAppointment({
      providerId: "00000000-0000-0000-0000-000000000000", // placeholder — in production, select from provider list
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      type: form.type,
      reason: form.reason || undefined,
    });
    setForm({ providerName: "", scheduledAt: "", type: "in-person", reason: "", location: "" });
    setShowForm(false);
    setSaving(false);
    loadAppointments();
  };

  const handleCancel = async (id: string) => {
    await cancelAppointment(id);
    loadAppointments();
  };

  const upcoming = appointments.filter((a) => ["scheduled", "confirmed"].includes(a.status));
  const past = appointments.filter((a) => ["completed", "cancelled", "no-show"].includes(a.status));

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">Schedule and manage your healthcare visits.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1 size-4" />
          Book
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="space-y-3 pt-6">
              <Input
                placeholder="Provider name"
                value={form.providerName}
                onChange={(e) => setForm({ ...form, providerName: e.target.value })}
              />
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                <option value="in-person">In-person</option>
                <option value="video">Video</option>
                <option value="follow-up">Follow-up</option>
              </select>
              <Input
                placeholder="Reason for visit (optional)"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
              <Input
                placeholder="Location (optional)"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleBook}
                  disabled={saving || !form.scheduledAt || !form.providerName}
                  className="flex-1"
                >
                  {saving ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading appointments...</div>
      ) : appointments.length === 0 && !showForm ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Calendar className="size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium">No appointments yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Book your first appointment to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Upcoming ({upcoming.length})
              </h2>
              {upcoming.map((apt, i) => {
                const TypeIcon = typeIcons[apt.type] || MapPin;
                const provider = apt.providers;
                return (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <User className="size-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-semibold">{provider?.name || "Provider"}</h4>
                                  <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", statusStyles[apt.status])}>
                                    {apt.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {provider?.specialties?.[0] || "Healthcare Provider"}
                                </p>
                              </div>
                              <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <TypeIcon className="size-4" />
                              </div>
                            </div>
                            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {formatDate(apt.scheduled_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {formatTime(apt.scheduled_at)}
                              </span>
                              {apt.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="size-3" />
                                  {apt.location}
                                </span>
                              )}
                            </div>
                            {apt.reason && (
                              <p className="mt-2 text-xs text-muted-foreground">{apt.reason}</p>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancel(apt.id)}
                              className="mt-2 h-7 text-xs text-destructive hover:text-destructive"
                            >
                              <X className="mr-1 size-3" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {past.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Past ({past.length})
              </h2>
              {past.map((apt, i) => {
                const provider = apt.providers;
                return (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="opacity-60">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                            <User className="size-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium">{provider?.name || "Provider"}</h4>
                              <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", statusStyles[apt.status])}>
                                {apt.status}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              {formatDate(apt.scheduled_at)} at {formatTime(apt.scheduled_at)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
