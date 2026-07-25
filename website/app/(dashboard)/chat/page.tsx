"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Stethoscope,
  FileText,
  Pill,
  Sparkles,
  Bot,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { HealthChat } from "@/components/healthcare/health-chat";
import { SymptomChecker } from "@/components/healthcare/symptom-checker";
import { ReportExplainer } from "@/components/healthcare/report-explainer";
import { MedicationGuidance } from "@/components/healthcare/medication-guidance";
import { WellnessSuggestions } from "@/components/healthcare/wellness-suggestions";
import { AIDisclaimer } from "@/components/healthcare/ai-disclaimer";
import { AIErrorBoundary } from "@/components/healthcare/ai-error-boundary";
import Link from "next/link";

const tabs = [
  { value: "chat", label: "Health Chat", icon: MessageSquare },
  { value: "symptoms", label: "Symptom Checker", icon: Stethoscope },
  { value: "reports", label: "Report Explainer", icon: FileText },
  { value: "medications", label: "Medications", icon: Pill },
  { value: "wellness", label: "Wellness", icon: Sparkles },
];

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Header */}
      <div className="shrink-0 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="size-8">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
              <Bot className="size-4.5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">AI Health Assistant</h1>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Powered by AI — Always verify with a professional
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto px-4 lg:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto w-full justify-start gap-0.5 rounded-none border-b bg-transparent p-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "relative flex items-center gap-1.5 rounded-none border-b-2 border-transparent px-3 py-2.5 text-xs font-medium text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AIErrorBoundary fallbackTitle="AI feature unavailable" fallbackMessage="The AI service is temporarily unavailable. Please try again later.">
          {activeTab === "chat" && (
            <div className="mx-auto h-full max-w-3xl">
              <HealthChat />
            </div>
          )}

          {activeTab === "symptoms" && (
            <div className="mx-auto max-w-2xl p-4 lg:p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Symptom Checker</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Describe your symptoms and get AI-powered analysis with recommendations.
                </p>
              </div>
              <SymptomChecker />
            </div>
          )}

          {activeTab === "reports" && (
            <div className="mx-auto max-w-2xl p-4 lg:p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Report Explainer</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Paste your medical report and get a plain-language explanation of the results.
                </p>
              </div>
              <ReportExplainer />
            </div>
          )}

          {activeTab === "medications" && (
            <div className="mx-auto max-w-2xl p-4 lg:p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Medication Guidance</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get information about medications, side effects, interactions, and proper usage.
                </p>
              </div>
              <MedicationGuidance />
            </div>
          )}

          {activeTab === "wellness" && (
            <div className="mx-auto max-w-2xl p-4 lg:p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Wellness Suggestions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Explore evidence-based tips for mental health, nutrition, exercise, sleep, and more.
                </p>
              </div>
              <WellnessSuggestions />
            </div>
          )}
        </AIErrorBoundary>
      </div>
    </div>
  );
}
