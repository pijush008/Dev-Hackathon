"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Loader2, AlertTriangle, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResultCard, ActionList } from "@/components/healthcare/ai-result-card";
import { AIDisclaimer } from "@/components/healthcare/ai-disclaimer";
import { useMedicationGuidance } from "@/hooks/useChat";

const quickQuestions = [
  "What are the side effects of Metformin?",
  "Can I take Ibuprofen with Lisinopril?",
  "How should I store my medication?",
  "What happens if I miss a dose?",
  "Should I take vitamins with my prescription?",
];

export function MedicationGuidance() {
  const { result, loading, ask, clear } = useMedicationGuidance();
  const [question, setQuestion] = useState("");

  const handleSubmit = async (q?: string) => {
    const text = q || question;
    if (!text.trim()) return;
    setQuestion(text);
    await ask(text);
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask about medications, dosages, interactions..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1"
        />
        <Button
          onClick={() => handleSubmit()}
          disabled={loading || !question.trim()}
          size="icon"
          className="size-9 shrink-0"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Pill className="size-4" />}
        </Button>
      </div>

      {/* Quick questions */}
      {!result && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Common Questions
          </p>
          <div className="space-y-1.5">
            {quickQuestions.map((q, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleSubmit(q)}
                className="flex w-full items-center gap-2 rounded-lg border bg-card p-2.5 text-left text-xs text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
              >
                <Pill className="size-3 shrink-0 text-primary" />
                {q}
                <ChevronRight className="ml-auto size-3 shrink-0" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

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
            {/* Main advice */}
            <ResultCard title="Guidance" icon={Pill} iconBg="bg-blue-500/10" iconColor="text-blue-600 dark:text-blue-400">
              <p className="text-sm leading-relaxed text-muted-foreground">{result.advice}</p>
            </ResultCard>

            {/* Key Points */}
            {result.keyPoints?.length > 0 && (
              <ResultCard title="Key Points" icon={Shield} iconBg="bg-emerald-500/10" iconColor="text-emerald-600 dark:text-emerald-400">
                <ActionList items={result.keyPoints} />
              </ResultCard>
            )}

            {/* Actionable Steps */}
            {result.actionableSteps?.length > 0 && (
              <ResultCard title="Actionable Steps" icon={ChevronRight} iconBg="bg-violet-500/10" iconColor="text-violet-600 dark:text-violet-400">
                <ActionList items={result.actionableSteps} />
              </ResultCard>
            )}

            {/* Precautions */}
            {result.precautions?.length > 0 && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                  <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400">Precautions</h4>
                </div>
                <ActionList items={result.precautions} icon={AlertTriangle} />
              </div>
            )}

            <AIDisclaimer variant="full" />

            <Button variant="outline" size="sm" onClick={clear} className="w-full">
              Ask Another Question
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
