"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FileText,
  Image,
  File,
  CheckCircle2,
  AlertCircle,
  CloudUpload,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReports, type MedicalReport } from "@/hooks/useReports";

const typeIcon: Record<string, React.ReactNode> = {
  pdf: <FileText className="size-4 text-red-500" />,
  image: <Image className="size-4 text-blue-500" />,
  other: <File className="size-4 text-violet-500" />,
};

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getReportRisk(report: MedicalReport): "normal" | "attention" | "abnormal" {
  if (!report.ai_summary) return "normal";
  const findings = report.ai_summary?.keyFindings;
  if (!Array.isArray(findings)) return "normal";
  if (findings.some((f: any) => f.status === "abnormal")) return "abnormal";
  if (findings.some((f: any) => f.status === "borderline")) return "attention";
  return "normal";
}

const riskConfig = {
  normal: { icon: CheckCircle2, color: "text-emerald-500", label: "Normal" },
  attention: { icon: AlertCircle, color: "text-amber-500", label: "Review" },
  abnormal: { icon: AlertCircle, color: "text-red-500", label: "Attention" },
};

export function MedicalReports() {
  const router = useRouter();
  const { reports, loading, loadReports } = useReports();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const displayReports = reports.slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Medical Reports</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs text-muted-foreground"
          onClick={() => router.push("/care/reports")}
        >
          View All
          <ChevronRight className="size-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
          onClick={() => router.push("/care/reports")}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-5 text-center transition-all",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <CloudUpload className={cn("size-5", isDragging ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isDragging ? "Drop files here" : "Upload reports"}
            </p>
            <p className="text-[11px] text-muted-foreground">PDF, JPEG, PNG up to 10MB</p>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                <div className="size-9 animate-pulse rounded-lg bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && displayReports.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 py-8 text-center">
            <FileText className="size-6 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">No reports yet</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Upload your first report to get started.</p>
          </div>
        )}

        {/* Report list */}
        {!loading && displayReports.length > 0 && (
          <div className="space-y-2">
            {displayReports.map((report, i) => {
              const risk = getReportRisk(report);
              const riskInfo = riskConfig[risk];
              const RiskIcon = riskInfo.icon;
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  className="group flex cursor-pointer items-center gap-3 rounded-xl border bg-card p-3 transition-all hover:bg-muted/50"
                  onClick={() => router.push("/care/reports")}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {typeIcon[report.file_type] || typeIcon.other}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-medium">{report.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{formatSize(report.file_size)}</span>
                      <span>·</span>
                      <span>{formatDate(report.report_date || report.created_at)}</span>
                      {report.ai_summary && (
                        <>
                          <span>·</span>
                          <span className={cn("flex items-center gap-1", riskInfo.color)}>
                            <RiskIcon className="size-3" />
                            {riskInfo.label}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {report.ai_summary && (
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="size-3 text-primary" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Report count */}
        {!loading && reports.length > 4 && (
          <p className="text-center text-[11px] text-muted-foreground">
            + {reports.length - 4} more report{reports.length - 4 !== 1 ? "s" : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
