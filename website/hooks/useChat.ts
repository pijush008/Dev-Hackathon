"use client";

import { useState, useCallback, useRef } from "react";
import {
  checkSymptoms,
  explainReport,
  getMedicationGuidance,
  getWellnessSuggestions,
  sendChatMessage,
} from "@/lib/actions/chat";
import type { SymptomInput } from "@/lib/ai/functions";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface CrisisInfo {
  crisisDetected: boolean;
  riskLevel: string;
  indicators: string[];
  recommendedAction: string;
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Chat Hook ──────────────────────────────────────────────────────────────

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState<CrisisInfo | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  const send = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: now(),
    };
    setMessages((prev) => {
      messagesRef.current = [...prev, userMsg];
      return [...prev, userMsg];
    });
    setLoading(true);
    setCrisis(null);

    const history = messagesRef.current.map((m) => ({ role: m.role, content: m.content }));
    const result = await sendChatMessage(content, history);
    setLoading(false);

    if (result.success && result.data) {
      if (result.data.crisis) {
        setCrisis(result.data.crisis as CrisisInfo);
        return;
      }
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: (result.data as { content: string }).content,
        timestamp: now(),
      };
      setMessages((prev) => {
        messagesRef.current = [...prev, aiMsg];
        return [...prev, aiMsg];
      });
    }
  }, []);

  const clear = useCallback(() => {
    messagesRef.current = [];
    setMessages([]);
    setCrisis(null);
  }, []);

  return { messages, loading, crisis, send, clear };
}

// ─── Symptom Check Hook ─────────────────────────────────────────────────────

export function useSymptomCheck() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const check = useCallback(async (symptoms: SymptomInput[], patientInfo?: { age?: number; gender?: string; medicalHistory?: string }) => {
    setLoading(true);
    const res = await checkSymptoms(symptoms, patientInfo);
    setLoading(false);
    if (res.success && res.data) setResult(res.data);
    return res;
  }, []);

  const clear = useCallback(() => setResult(null), []);

  return { result, loading, check, clear };
}

// ─── Report Explainer Hook ──────────────────────────────────────────────────

export function useReportExplainer() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const explain = useCallback(async (reportText: string, reportType?: string) => {
    setLoading(true);
    const res = await explainReport(reportText, reportType);
    setLoading(false);
    if (res.success && res.data) setResult(res.data);
    return res;
  }, []);

  const clear = useCallback(() => setResult(null), []);

  return { result, loading, explain, clear };
}

// ─── Medication Guidance Hook ───────────────────────────────────────────────

export function useMedicationGuidance() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const ask = useCallback(async (question: string, context?: { medications?: string[]; conditions?: string[] }) => {
    setLoading(true);
    const res = await getMedicationGuidance(question, context);
    setLoading(false);
    if (res.success && res.data) setResult(res.data);
    return res;
  }, []);

  const clear = useCallback(() => setResult(null), []);

  return { result, loading, ask, clear };
}

// ─── Wellness Suggestions Hook ──────────────────────────────────────────────

export function useWellness() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getSuggestions = useCallback(async (topic: string, context?: { age?: number; conditions?: string[] }) => {
    setLoading(true);
    const res = await getWellnessSuggestions(topic, context);
    setLoading(false);
    if (res.success && res.data) setResult(res.data);
    return res;
  }, []);

  const clear = useCallback(() => setResult(null), []);

  return { result, loading, getSuggestions, clear };
}
