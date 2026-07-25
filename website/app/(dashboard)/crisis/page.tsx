"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Shield, Phone, Plus, Trash2, AlertTriangle, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getEmergencyContacts, addEmergencyContact, deleteEmergencyContact, getSafetyPlan, saveSafetyPlan } from "@/lib/actions/safety-plan";
import { cn } from "@/lib/utils";

export default function CrisisPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", relationship: "" });
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planForm, setPlanForm] = useState({
    warningSigns: [""],
    copingStrategies: [""],
    reasonsToLive: [""],
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [c, p] = await Promise.all([getEmergencyContacts(), getSafetyPlan()]);
    if (c.success) setContacts(c.data);
    if (p.success && p.data) setPlan(p.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAddContact = async () => {
    if (!contactForm.name || !contactForm.phone) return;
    setSaving(true);
    await addEmergencyContact(contactForm);
    setContactForm({ name: "", phone: "", relationship: "" });
    setShowContactForm(false);
    setSaving(false);
    load();
  };

  const handleDeleteContact = async (id: string) => {
    await deleteEmergencyContact(id);
    load();
  };

  const handleSavePlan = async () => {
    setSaving(true);
    await saveSafetyPlan({
      warningSigns: planForm.warningSigns.filter(Boolean),
      copingStrategies: planForm.copingStrategies.filter(Boolean),
      socialContacts: contacts.slice(0, 3).map((c) => ({ name: c.name, phone: c.phone, relationship: c.relationship })),
      professionalContacts: [{ name: "Crisis Hotline", phone: "988", type: "hotline" }],
      reasonsToLive: planForm.reasonsToLive.filter(Boolean),
    });
    setSaving(false);
    setShowPlanForm(false);
    load();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Emergency & Safety</h1>
        <p className="text-sm text-muted-foreground">Manage emergency contacts and your safety plan.</p>
      </div>

      {/* Crisis Hotlines */}
      <Card className="border-red-500/20 bg-red-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-red-700 dark:text-red-400">
            <AlertTriangle className="size-4" />
            Crisis Hotlines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a href="tel:988" className="flex items-center gap-3 rounded-lg bg-white/50 p-3 text-sm font-medium transition-colors hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/30">
            <Phone className="size-4 text-red-600" />
            988 Suicide & Crisis Lifeline
          </a>
          <a href="sms:741741&body=HELLO" className="flex items-center gap-3 rounded-lg bg-white/50 p-3 text-sm font-medium transition-colors hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/30">
            <Phone className="size-4 text-red-600" />
            Text HOME to 741741 (Crisis Text Line)
          </a>
          <a href="tel:911" className="flex items-center gap-3 rounded-lg bg-white/50 p-3 text-sm font-medium transition-colors hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/30">
            <Phone className="size-4 text-red-600" />
            911 Emergency Services
          </a>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Emergency Contacts</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowContactForm(!showContactForm)}>
            <Plus className="mr-1 size-3.5" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {showContactForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2 pb-2">
              <Input placeholder="Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
              <Input placeholder="Phone" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
              <Input placeholder="Relationship" value={contactForm.relationship} onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })} />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowContactForm(false)} className="flex-1">Cancel</Button>
                <Button size="sm" onClick={handleAddContact} disabled={saving} className="flex-1">Save</Button>
              </div>
            </motion.div>
          )}
          {contacts.length === 0 && !showContactForm && (
            <p className="py-4 text-center text-xs text-muted-foreground">No emergency contacts added yet.</p>
          )}
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-xl border p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Heart className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{c.name}</span>
                  {c.is_primary && <Badge variant="secondary" className="text-[10px]">Primary</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{c.relationship} · {c.phone}</p>
              </div>
              <a href={`tel:${c.phone}`} className="text-primary hover:underline">
                <Phone className="size-4" />
              </a>
              <button onClick={() => handleDeleteContact(c.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Safety Plan */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="size-4" />
            Safety Plan
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowPlanForm(!showPlanForm)}>
            {plan ? "Edit" : "Create"}
          </Button>
        </CardHeader>
        <CardContent>
          {showPlanForm ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Warning Signs (one per line)</label>
                <textarea
                  value={planForm.warningSigns.join("\n")}
                  onChange={(e) => setPlanForm({ ...planForm, warningSigns: e.target.value.split("\n") })}
                  rows={3}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  placeholder="e.g. Feeling hopeless&#10;e.g. Isolating from others"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Coping Strategies (one per line)</label>
                <textarea
                  value={planForm.copingStrategies.join("\n")}
                  onChange={(e) => setPlanForm({ ...planForm, copingStrategies: e.target.value.split("\n") })}
                  rows={3}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  placeholder="e.g. Deep breathing&#10;e.g. Call a friend"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Reasons to Live (one per line)</label>
                <textarea
                  value={planForm.reasonsToLive.join("\n")}
                  onChange={(e) => setPlanForm({ ...planForm, reasonsToLive: e.target.value.split("\n") })}
                  rows={3}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  placeholder="e.g. My family&#10;e.g. My goals"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPlanForm(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleSavePlan} disabled={saving} className="flex-1">{saving ? "Saving..." : "Save Plan"}</Button>
              </div>
            </motion.div>
          ) : plan ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground">Warning Signs</h4>
                <ul className="mt-1 space-y-1">
                  {(plan.warning_signs ?? []).map((s: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="size-3 text-amber-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-muted-foreground">Coping Strategies</h4>
                <ul className="mt-1 space-y-1">
                  {(plan.coping_strategies ?? []).map((s: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Shield className="size-3 text-emerald-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              {plan.reasons_to_live?.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground">Reasons to Live</h4>
                  <ul className="mt-1 space-y-1">
                    {plan.reasons_to_live.map((r: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Heart className="size-3 text-rose-500" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center">
              <Shield className="mx-auto size-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm font-medium">No safety plan yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Create a safety plan to help during difficult moments.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
