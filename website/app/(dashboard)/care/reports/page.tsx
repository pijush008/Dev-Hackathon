"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  BarChart3,
  ArrowLeft,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportUploader } from "@/components/healthcare/report-uploader";
import { ReportList } from "@/components/healthcare/report-list";
import { ReportAnalysis } from "@/components/healthcare/report-analysis";
import { HealthSummaryCard } from "@/components/healthcare/health-summary-card";
import { useReports, useHealthSummary, type MedicalReport } from "@/hooks/useReports";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const { reports, loading, uploading, loadReports, upload, remove, reanalyze } = useReports();
  const { summary, loading: summaryLoading, loadSummary } = useHealthSummary();
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<MedicalReport | null>(null);
  const [activeTab, setActiveTab] = useState("reports");

  useEffect(() => {
    loadReports();
    loadSummary();
  }, [loadReports, loadSummary]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await remove(deleteConfirm.id, deleteConfirm.file_url);
    setDeleteConfirm(null);
    if (selectedReport?.id === deleteConfirm.id) setSelectedReport(null);
  };

  const handleReanalyze = async (reportId: string) => {
    await reanalyze(reportId);
    loadSummary();
  };

  // Report detail view
  if (selectedReport) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <ReportAnalysis
          report={selectedReport}
          onBack={() => setSelectedReport(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Medical Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload, manage, and get AI-powered insights from your medical reports.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto w-full justify-start gap-0.5 rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="upload"
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Upload className="size-3.5" />
            Upload
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <FileText className="size-3.5" />
            Reports
            {reports.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                {reports.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="summary"
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <BarChart3 className="size-3.5" />
            Summary
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="mt-6">
          <div className="mx-auto max-w-xl">
            <ReportUploader onUpload={upload} uploading={uploading} />
          </div>
        </TabsContent>

        {/* Reports List Tab */}
        <TabsContent value="reports" className="mt-6">
          <ReportList
            reports={reports}
            loading={loading}
            onView={setSelectedReport}
            onDelete={setDeleteConfirm}
            onReanalyze={handleReanalyze}
          />
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="mt-6">
          {summary && summary.stats ? (
            <div className="mx-auto max-w-xl">
              <HealthSummaryCard stats={summary.stats} hasAbnormal={summary.hasAbnormal} />

              {/* Recent reports with findings */}
              {summary.reports && summary.reports.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-semibold">Recent Reports</h3>
                  {summary.reports.slice(0, 5).map((report: any) => (
                    <div
                      key={report.id}
                      className="flex items-center gap-3 rounded-xl border bg-card p-3"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{report.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {report.ai_summary?.keyFindings?.some((f: any) => f.status === "abnormal") && (
                        <AlertTriangle className="size-4 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
              <BarChart3 className="size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No data yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Upload reports to see your health summary.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-x-4 bottom-8 z-50 mx-auto max-w-sm overflow-hidden rounded-2xl border bg-card p-5 shadow-2xl sm:inset-x-auto"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10">
                  <AlertTriangle className="size-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Delete Report</h3>
                  <p className="text-xs text-muted-foreground">
                    This will permanently delete &quot;{deleteConfirm.title}&quot;.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete} className="flex-1">
                  Delete
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
