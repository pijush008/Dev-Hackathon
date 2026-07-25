"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIDisclaimerProps {
  variant?: "compact" | "full";
  className?: string;
}

export function AIDisclaimer({ variant = "compact", className }: AIDisclaimerProps) {
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2 rounded-lg bg-amber-500/5 border border-amber-500/20 px-3 py-2 text-[11px] text-amber-700 dark:text-amber-400", className)}>
        <AlertTriangle className="size-3.5 shrink-0" />
        <span>
          AI-generated information. Not a substitute for professional medical advice.{" "}
          <span className="font-semibold">Always consult a qualified healthcare provider.</span>
        </span>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-amber-500/20 bg-amber-500/5 p-4", className)}>
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
          <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            Medical Disclaimer
          </h4>
          <p className="text-xs leading-relaxed text-amber-600/80 dark:text-amber-400/80">
            This AI assistant provides general health information for educational purposes only.
            It is <strong>not</strong> intended to diagnose, treat, cure, or prevent any disease or
            medical condition. Always seek the advice of a qualified healthcare provider with any
            questions you may have regarding a medical condition. Never disregard professional
            medical advice or delay in seeking it because of information provided by this tool.
          </p>
        </div>
      </div>
    </div>
  );
}
