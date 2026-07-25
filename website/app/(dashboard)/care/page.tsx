"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Pill, Clock, CheckCircle2, Plus, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getMedications, addMedication, logMedicationTaken, deleteMedication } from "@/lib/actions/medications";
import { cn } from "@/lib/utils";

const frequencies = [
  { value: "once_daily", label: "Once daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_times", label: "3 times daily" },
  { value: "as_needed", label: "As needed" },
];

export default function CarePage() {
  const [meds, setMeds] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "once_daily", notes: "" });
  const [saving, setSaving] = useState(false);

  const loadMeds = useCallback(async () => {
    const res = await getMedications();
    if (res.success) setMeds([...res.data]);
  }, []);

  useEffect(() => { loadMeds(); }, [loadMeds]);

  const handleAdd = async () => {
    if (!form.name || !form.dosage) return;
    setSaving(true);
    await addMedication(form);
    setForm({ name: "", dosage: "", frequency: "once_daily", notes: "" });
    setShowForm(false);
    setSaving(false);
    loadMeds();
  };

  const handleTaken = async (id: string) => {
    await logMedicationTaken(id, "taken");
    loadMeds();
  };

  const handleDelete = async (id: string) => {
    await deleteMedication(id);
    loadMeds();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medications</h1>
          <p className="text-sm text-muted-foreground">Manage your medications and track adherence.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1 size-4" />
          Add
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="space-y-3 pt-6">
              <Input placeholder="Medication name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Dosage (e.g. 500mg)" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                {frequencies.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <Input placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleAdd} disabled={saving || !form.name || !form.dosage} className="flex-1">
                  {saving ? "Adding..." : "Add Medication"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {meds.length === 0 && !showForm && (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Pill className="size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium">No medications yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Add your first medication to get reminders.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {meds.map((med, i) => (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Pill className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">{med.name}</h4>
                    <Badge variant="secondary" className="text-[10px]">{med.dosage}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{frequencies.find((f) => f.value === med.frequency)?.label ?? med.frequency}</span>
                    {med.status === "active" && (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-[10px]">Active</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => handleTaken(med.id)} className="gap-1 text-xs">
                    <CheckCircle2 className="size-3.5" />
                    Taken
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(med.id)} className="size-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
