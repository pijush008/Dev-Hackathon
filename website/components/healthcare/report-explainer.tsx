"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Loader2,
  Upload,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResultCard, FindingBadge, ActionList } from "@/components/healthcare/ai-result-card";
import { AIDisclaimer } from "@/components/healthcare/ai-disclaimer";
import { useReportExplainer } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

const reportTypes = [
  "Blood Test",
  "Lipid Panel",
  "Thyroid",
  "X-Ray",
  "MRI",
  "General",
];

export function ReportExplainer() {
  const { result, loading, explain, clear } = useReportExplainer();
  const [text, setText] = useState("");
  const [reportType, setReportType] = useState("General");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await explain(text, reportType);
  };

  return (
    <div className="space-y-4">
      {/* Report type selector */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Report Type</label>
        <div className="flex flex-wrap gap-1.5">
          {reportTypes.map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                reportType === type
                  ? "border-primary bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Paste area */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Paste Report Content
        </label>
        <Textarea
          placeholder={"Paste your medical report text here...\n\nFor example:\nHemoglobin: 14.2 g/dL (Range: 13.5-17.5)\nWBC: 7,500 /uL (Range: 4,500-11,000)\nGlucose: 105 mg/dL (Range: 70-100)"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[140px] font-mono text-sm resize-none"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        className="w-full gap-1.5"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileText className="size-4" />
        )}
        {loading ? "Explaining..." : "Explain Report"}
      </Button>

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
            {/* Summary */}
            <ResultCard title="Summary" icon={FileText} iconBg="bg-violet-500/10" iconColor="text-violet-600 dark:text-violet-400">
              <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
            </ResultCard>

            {/* Key Findings */}
            {result.keyFindings?.length > 0 && (
              <ResultCard title="Key Findings" icon={ChevronRight} iconBg="bg-blue-500/10" iconColor="text-blue-600 dark:text-blue-400">
                <div className="space-y-2.5">
                  {result.keyFindings.map((finding: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="rounded-lg bg-muted/50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">{finding.term}</h5>
                        <FindingBadge status={finding.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{finding.explanation}</p>
                    </motion.div>
                  ))}
                </div>
              </ResultCard>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <ResultCard title="Recommendations" icon={ChevronRight} iconBg="bg-emerald-500/10" iconColor="text-emerald-600 dark:text-emerald-400">
                <ActionList items={result.recommendations} />
              </ResultCard>
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
