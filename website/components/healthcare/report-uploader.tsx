"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudUpload,
  FileText,
  Image,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { REPORT_TYPE_LABELS, type ReportUploadInput } from "@/lib/validations/report";
import { cn } from "@/lib/utils";

interface ReportUploaderProps {
  onUpload: (file: File, metadata: ReportUploadInput) => Promise<any>;
  uploading: boolean;
}

interface StagedFile {
  file: File;
  preview?: string;
  error?: string;
}

export function ReportUploader({ onUpload, uploading }: ReportUploaderProps) {
  const [staged, setStaged] = useState<StagedFile | null>(null);
  const [metadata, setMetadata] = useState<ReportUploadInput>({
    title: "",
    reportType: "other",
    description: "",
    reportDate: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setUploadResult(null);
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "webp", "tiff", "bmp"].includes(ext || "");
    const isPdf = ext === "pdf";

    if (!isImage && !isPdf) {
      setStaged({ file, error: "Only PDF and image files are accepted." });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setStaged({ file, error: "File exceeds 20MB limit." });
      return;
    }

    const preview = isImage ? URL.createObjectURL(file) : undefined;
    setStaged({ file, preview });

    // Auto-fill title from filename
    if (!metadata.title) {
      const name = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setMetadata((prev) => ({ ...prev, title: name }));
    }
  }, [metadata.title]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSubmit = async () => {
    if (!staged || staged.error || !metadata.title.trim()) return;
    const result = await onUpload(staged.file, metadata);
    if (result?.success) {
      setUploadResult({ success: true, message: "Report uploaded and analyzed successfully!" });
      setStaged(null);
      setMetadata({ title: "", reportType: "other", description: "", reportDate: "" });
    } else {
      setUploadResult({ success: false, message: result?.error || "Upload failed." });
    }
  };

  const removeStaged = () => {
    if (staged?.preview) URL.revokeObjectURL(staged.preview);
    setStaged(null);
    setUploadResult(null);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone or staged file */}
      {!staged ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all",
            dragActive
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.tiff,.bmp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <motion.div
            animate={dragActive ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
            className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10"
          >
            <CloudUpload className={cn("size-7", dragActive ? "text-primary" : "text-muted-foreground")} />
          </motion.div>
          <p className="text-sm font-semibold">
            {dragActive ? "Drop your report here" : "Drag & drop or click to upload"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, JPEG, PNG, WebP, TIFF, BMP — Max 20MB
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border bg-card p-4"
        >
          <div className="flex items-start gap-3">
            {/* Preview or icon */}
            {staged.preview ? (
              <img
                src={staged.preview}
                alt="Preview"
                className="size-16 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-muted">
                <FileText className="size-7 text-muted-foreground" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="truncate text-sm font-medium">{staged.file.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {(staged.file.size / 1024 / 1024).toFixed(1)} MB
                    {staged.error && (
                      <span className="ml-2 text-red-500">{staged.error}</span>
                    )}
                  </p>
                </div>
                <button onClick={removeStaged} className="rounded p-1 text-muted-foreground hover:bg-muted">
                  <X className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Metadata form (shown when file is staged) */}
      {staged && !staged.error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-3"
        >
          <Input
            placeholder="Report title (e.g., Annual Blood Test)"
            value={metadata.title}
            onChange={(e) => setMetadata((prev) => ({ ...prev, title: e.target.value }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={metadata.reportType}
              onChange={(e) => setMetadata((prev) => ({ ...prev, reportType: e.target.value as any }))}
              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            >
              {Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <Input
              type="date"
              placeholder="Report date"
              value={metadata.reportDate}
              onChange={(e) => setMetadata((prev) => ({ ...prev, reportDate: e.target.value }))}
            />
          </div>

          <Textarea
            placeholder="Notes (optional)"
            value={metadata.description}
            onChange={(e) => setMetadata((prev) => ({ ...prev, description: e.target.value }))}
            className="min-h-[60px] resize-none text-sm"
          />

          <Button
            onClick={handleSubmit}
            disabled={uploading || !metadata.title.trim()}
            className="w-full gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading & Analyzing...
              </>
            ) : (
              <>
                <CloudUpload className="size-4" />
                Upload & Analyze
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Result message */}
      <AnimatePresence>
        {uploadResult && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm",
              uploadResult.success
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-red-500/10 text-red-700 dark:text-red-400"
            )}
          >
            {uploadResult.success ? (
              <CheckCircle2 className="size-4 shrink-0" />
            ) : (
              <AlertCircle className="size-4 shrink-0" />
            )}
            {uploadResult.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
