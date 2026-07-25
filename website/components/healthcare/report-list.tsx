"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Image,
  Eye,
  Trash2,
  RefreshCw,
  Calendar,
  HardDrive,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { REPORT_TYPE_LABELS } from "@/lib/validations/report";
import type { MedicalReport } from "@/hooks/useReports";
import { cn } from "@/lib/utils";

interface ReportListProps {
  reports: MedicalReport[];
  loading: boolean;
  onView: (report: MedicalReport) => void;
  onDelete: (report: MedicalReport) => void;
  onReanalyze: (reportId: string) => void;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRiskLevel(report: MedicalReport): "none" | "attention" | "concern" {
  if (!report.ai_summary || typeof report.ai_summary !== "object") return "none";
  const summary = report.ai_summary as any;
  if (summary.keyFindings?.some((f: any) => f.status === "abnormal")) return "concern";
  if (summary.keyFindings?.some((f: any) => f.status === "borderline")) return "attention";
  return "none";
}

const riskStyles = {
  none: { bg: "bg-emerald-500/10", color: "text-emerald-600 dark:text-emerald-400", label: "Normal" },
  attention: { bg: "bg-amber-500/10", color: "text-amber-600 dark:text-amber-400", label: "Attention" },
  concern: { bg: "bg-red-500/10", color: "text-red-600 dark:text-red-400", label: "Abnormal" },
};

export function ReportList({ reports, loading, onView, onDelete, onReanalyze }: ReportListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
          <FileText className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium">No reports yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Upload your first medical report to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reports.map((report, i) => {
        const risk = getRiskLevel(report);
        const riskStyle = riskStyles[risk];
        const hasAI = !!report.ai_summary;

        return (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="group rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:shadow-primary/5"
          >
            <div className="flex items-start gap-3">
              {/* File icon */}
              <div className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl",
                report.file_type === "pdf" ? "bg-red-500/10" : "bg-blue-500/10"
              )}>
                {report.file_type === "pdf" ? (
                  <FileText className="size-5 text-red-500" />
                ) : (
                  <Image className="size-5 text-blue-500" />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="truncate text-sm font-semibold">{report.title}</h4>
                      {risk !== "none" && (
                        <Badge variant="secondary" className={cn("text-[10px] px-1.5", riskStyle.bg, riskStyle.color)}>
                          {risk === "concern" && <AlertTriangle className="mr-0.5 size-3" />}
                          {riskStyle.label}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(report.report_date || report.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <HardDrive className="size-3" />
                        {formatBytes(report.file_size)}
                      </span>
                      <span className="capitalize">{report.file_type}</span>
                    </div>
                  </div>

                  {/* AI indicator */}
                  {hasAI && (
                    <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      <Sparkles className="size-3" />
                      AI Analyzed
                    </div>
                  )}
                </div>

                {/* AI summary preview */}
                {hasAI && report.ai_summary?.summary && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {report.ai_summary.summary}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-3 flex items-center gap-1.5 border-t pt-2.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(report)}
                    className="gap-1.5 text-xs"
                  >
                    <Eye className="size-3.5" />
                    View Analysis
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReanalyze(report.id)}
                    className="gap-1.5 text-xs text-muted-foreground"
                  >
                    <RefreshCw className="size-3.5" />
                    Re-analyze
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(report)}
                    className="ml-auto gap-1.5 text-xs text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
