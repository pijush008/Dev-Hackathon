"use client";

import { useState, useCallback } from "react";
import {
  uploadReport,
  getReports,
  getReport,
  deleteReport,
  reanalyzeReport,
  getHealthSummary,
} from "@/lib/actions/reports";
import type { ReportUploadInput } from "@/lib/validations/report";

export interface MedicalReport {
  id: string;
  patient_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number | null;
  report_date: string | null;
  uploaded_by: string | null;
  ai_summary: any;
  created_at: string;
}

export function useReports() {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    const res = await getReports();
    setLoading(false);
    if (res.success && res.data) setReports(res.data as MedicalReport[]);
    return res;
  }, []);

  const upload = useCallback(async (file: File, metadata: ReportUploadInput) => {
    setUploading(true);
    const res = await uploadReport(file, metadata);
    setUploading(false);
    if (res.success) {
      // Refresh the list
      const listRes = await getReports();
      if (listRes.success && listRes.data) setReports(listRes.data as MedicalReport[]);
    }
    return res;
  }, []);

  const remove = useCallback(async (reportId: string, fileUrl: string) => {
    const res = await deleteReport(reportId, fileUrl);
    if (res.success) {
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    }
    return res;
  }, []);

  const reanalyze = useCallback(async (reportId: string) => {
    const res = await reanalyzeReport(reportId);
    if (res.success && res.data) {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, ai_summary: res.data } : r))
      );
    }
    return res;
  }, []);

  return { reports, loading, uploading, loadReports, upload, remove, reanalyze };
}

export function useReportDetail() {
  const [report, setReport] = useState<MedicalReport | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDetail = useCallback(async (reportId: string) => {
    setLoading(true);
    const res = await getReport(reportId);
    setLoading(false);
    if (res.success && res.data) setReport(res.data as MedicalReport);
    return res;
  }, []);

  return { report, loading, loadDetail };
}

export function useHealthSummary() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    const res = await getHealthSummary();
    setLoading(false);
    if (res.success && res.data) setSummary(res.data);
    return res;
  }, []);

  return { summary, loading, loadSummary };
}
