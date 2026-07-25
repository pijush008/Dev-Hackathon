"use client";

import { motion } from "framer-motion";
import {
  FileText,
  ArrowLeft,
  Calendar,
  HardDrive,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  Shield,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResultCard, FindingBadge, ActionList } from "@/components/healthcare/ai-result-card";
import { AIDisclaimer } from "@/components/healthcare/ai-disclaimer";
import type { MedicalReport } from "@/hooks/useReports";
import { REPORT_TYPE_LABELS } from "@/lib/validations/report";
import { cn } from "@/lib/utils";

interface ReportAnalysisProps {
  report: MedicalReport;
  onBack: () => void;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Not specified";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ReportAnalysis({ report, onBack }: ReportAnalysisProps) {
  const summary = report.ai_summary as any;
  const hasAbnormal = summary?.keyFindings?.some((f: any) => f.status === "abnormal");
  const hasBorderline = summary?.keyFindings?.some((f: any) => f.status === "borderline");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 -ml-2">
          <ArrowLeft className="size-4" />
          Back to Reports
        </Button>

        <div className="flex items-start gap-4">
          <div className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-2xl",
            report.file_type === "pdf" ? "bg-red-500/10" : "bg-blue-500/10"
          )}>
            {report.file_type === "pdf" ? (
              <FileText className="size-7 text-red-500" />
            ) : (
              <FileText className="size-7 text-blue-500" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight">{report.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {formatDate(report.report_date || report.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="size-3.5" />
                {formatBytes(report.file_size)}
              </span>
              <Badge variant="secondary" className="text-[10px]">
                {REPORT_TYPE_LABELS[report.file_type] || report.file_type}
              </Badge>
            </div>
          </div>
          <a
            href={report.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="size-3.5" />
              Open File
            </Button>
          </a>
        </div>
      </div>

      {/* Risk Assessment Banner */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center gap-3 rounded-xl border p-4",
            hasAbnormal
              ? "border-red-500/20 bg-red-500/5"
              : hasBorderline
              ? "border-amber-500/20 bg-amber-500/5"
              : "border-emerald-500/20 bg-emerald-500/5"
          )}
        >
          <div className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            hasAbnormal ? "bg-red-500/10" : hasBorderline ? "bg-amber-500/10" : "bg-emerald-500/10"
          )}>
            {hasAbnormal ? (
              <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
            ) : hasBorderline ? (
              <Info className="size-5 text-amber-600 dark:text-amber-400" />
            ) : (
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div>
            <h3 className={cn(
              "text-sm font-semibold",
              hasAbnormal ? "text-red-700 dark:text-red-400" : hasBorderline ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"
            )}>
              {hasAbnormal
                ? "Abnormal findings detected — consult your doctor"
                : hasBorderline
                ? "Some borderline values — monitor and follow up"
                : "All findings within normal range"}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {summary.keyFindings?.length || 0} findings analyzed
            </p>
          </div>
        </motion.div>
      )}

      {/* AI Analysis or No Analysis */}
      {summary ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Summary */}
          <ResultCard
            title="Summary"
            icon={FileText}
            iconBg="bg-violet-500/10"
            iconColor="text-violet-600 dark:text-violet-400"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">{summary.summary}</p>
          </ResultCard>

          {/* Key Findings */}
          {summary.keyFindings?.length > 0 && (
            <ResultCard
              title="Key Findings"
              icon={ChevronRight}
              iconBg="bg-blue-500/10"
              iconColor="text-blue-600 dark:text-blue-400"
            >
              <div className="space-y-2.5">
                {summary.keyFindings.map((finding: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.04 }}
                    className={cn(
                      "rounded-lg p-3",
                      finding.status === "abnormal" ? "bg-red-500/5 border border-red-500/10" : "bg-muted/50"
                    )}
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
          {summary.recommendations?.length > 0 && (
            <ResultCard
              title="Recommendations"
              icon={Shield}
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-600 dark:text-emerald-400"
            >
              <ActionList items={summary.recommendations} />
            </ResultCard>
          )}

          <AIDisclaimer variant="full" />
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
            <Sparkles className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-3 text-sm font-medium">No AI analysis available</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            This report hasn&apos;t been analyzed yet. Try re-analyzing from the report list.
          </p>
        </div>
      )}

      {/* Description */}
      {report.description && (
        <div className="rounded-xl bg-muted/30 p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
          <p className="text-sm">{report.description}</p>
        </div>
      )}
    </div>
  );
}
