"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Image,
  X,
  CheckCircle2,
  AlertCircle,
  CloudUpload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "image" | "other";
  status: "uploading" | "done" | "error";
  progress?: number;
}

interface ReportUploadProps {
  onUpload?: (files: File[]) => void;
  accept?: string;
  maxSizeMB?: number;
  maxFiles?: number;
}

const mockFiles: UploadedFile[] = [
  { id: "1", name: "blood-test-results.pdf", size: "245 KB", type: "pdf", status: "done" },
  { id: "2", name: "x-ray-chest.png", size: "1.2 MB", type: "image", status: "done" },
  { id: "3", name: "prescription-jan.pdf", size: "89 KB", type: "pdf", status: "uploading", progress: 67 },
];

function getFileIcon(type: UploadedFile["type"]) {
  switch (type) {
    case "pdf":
      return <FileText className="size-4 text-red-500" />;
                    case "image":
                      return <Image className="size-4 text-blue-500" />;
    default:
      return <FileText className="size-4 text-muted-foreground" />;
  }
}

export function ReportUpload({
  onUpload,
  maxSizeMB = 10,
  maxFiles = 5,
}: ReportUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        onUpload?.(droppedFiles);
      }
    },
    [onUpload],
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upload Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/50",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.dicom"
            className="hidden"
            onChange={(e) => {
              const selected = Array.from(e.target.files ?? []);
              if (selected.length > 0) onUpload?.(selected);
            }}
          />
          <motion.div
            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10"
          >
            <CloudUpload
              className={cn(
                "size-6 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground",
              )}
            />
          </motion.div>
          <p className="text-sm font-medium">
            {isDragging
              ? "Drop files here"
              : "Drag & drop or click to upload"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, JPEG, PNG, DICOM up to {maxSizeMB}MB · Max {maxFiles} files
          </p>
        </div>

        {/* File list */}
        <div className="space-y-2">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{file.size}</span>
                      {file.status === "done" && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-3" />
                          Uploaded
                        </span>
                      )}
                      {file.status === "error" && (
                        <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                          <AlertCircle className="size-3" />
                          Failed
                        </span>
                      )}
                    </div>
                    {file.status === "uploading" && file.progress !== undefined && (
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
