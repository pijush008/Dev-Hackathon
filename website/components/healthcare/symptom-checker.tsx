"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Plus,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultCard, UrgencyBadge, LikelihoodBadge, ActionList } from "@/components/healthcare/ai-result-card";
import { AIDisclaimer } from "@/components/healthcare/ai-disclaimer";
import { useSymptomCheck } from "@/hooks/useChat";
import type { SymptomInput } from "@/lib/ai/functions";
import { cn } from "@/lib/utils";

const severityOptions = ["mild", "moderate", "severe", "very-severe"] as const;

export function SymptomChecker() {
  const { result, loading, check, clear } = useSymptomCheck();
  const [symptoms, setSymptoms] = useState<SymptomInput[]>([
    { name: "", severity: "moderate", duration: "", description: "" },
  ]);

  const addSymptom = () => {
    setSymptoms((prev) => [...prev, { name: "", severity: "moderate", duration: "", description: "" }]);
  };

  const removeSymptom = (i: number) => {
    setSymptoms((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateSymptom = (i: number, field: keyof SymptomInput, value: string) => {
    setSymptoms((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  };

  const handleSubmit = async () => {
    const valid = symptoms.filter((s) => s.name.trim());
    if (valid.length === 0) return;
    await check(valid);
  };

  return (
    <div className="space-y-4">
      {/* Symptom inputs */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {symptoms.map((symptom, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border bg-card p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Symptom {i + 1}</span>
                  {symptoms.length > 1 && (
                    <button onClick={() => removeSymptom(i)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
                <Input
                  placeholder="e.g., Headache, Chest pain, Fatigue"
                  value={symptom.name}
                  onChange={(e) => updateSymptom(i, "name", e.target.value)}
                  className="h-9 text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={symptom.severity}
                    onChange={(e) => updateSymptom(i, "severity", e.target.value)}
                    className="h-9 rounded-lg border bg-background px-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                  >
                    {severityOptions.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Duration (e.g., 3 days)"
                    value={symptom.duration}
                    onChange={(e) => updateSymptom(i, "duration", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <Textarea
                  placeholder="Additional details (optional)"
                  value={symptom.description || ""}
                  onChange={(e) => updateSymptom(i, "description", e.target.value)}
                  className="min-h-[60px] text-sm resize-none"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={addSymptom} className="gap-1.5">
          <Plus className="size-3.5" />
          Add Symptom
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={loading || symptoms.every((s) => !s.name.trim())}
          className="gap-1.5"
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Stethoscope className="size-3.5" />}
          {loading ? "Analyzing..." : "Check Symptoms"}
        </Button>
      </div>

      <AIDisclaimer variant="compact" />

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Urgency */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Analysis Results</h4>
              <UrgencyBadge urgency={result.urgency} />
            </div>

            {/* Possible conditions */}
            {result.possibleConditions?.length > 0 && (
              <ResultCard title="Possible Conditions" icon={Stethoscope} iconBg="bg-blue-500/10" iconColor="text-blue-600 dark:text-blue-400">
                <div className="space-y-3">
                  {result.possibleConditions.map((cond: any, i: number) => (
                    <div key={i} className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">{cond.name}</h5>
                        <LikelihoodBadge level={cond.likelihood} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{cond.description}</p>
                    </div>
                  ))}
                </div>
              </ResultCard>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <ResultCard title="Recommendations" icon={CheckCircle2} iconBg="bg-emerald-500/10" iconColor="text-emerald-600 dark:text-emerald-400">
                <ActionList items={result.recommendations} />
              </ResultCard>
            )}

            {/* When to seek help */}
            {result.whenToSeekHelp && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <h5 className="text-sm font-semibold text-amber-700 dark:text-amber-400">When to Seek Help</h5>
                  <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-400/80">{result.whenToSeekHelp}</p>
                </div>
              </div>
            )}

            <AIDisclaimer variant="full" />

            <Button variant="outline" size="sm" onClick={clear} className="w-full">
              Clear Results
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
