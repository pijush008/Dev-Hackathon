"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  User,
  Bot,
  Trash2,
  Phone,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIDisclaimer } from "@/components/healthcare/ai-disclaimer";
import { useChat, type CrisisInfo } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

const suggestions = [
  "How can I manage anxiety?",
  "Tips for better sleep",
  "What foods boost immunity?",
  "How to start a meditation habit?",
];

function CrisisAlert({ crisis }: { crisis: CrisisInfo }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10">
          <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
            We care about your safety
          </h4>
          <p className="text-[11px] text-red-600/70 dark:text-red-400/70">
            It sounds like you may be going through a difficult time.
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <a
          href="tel:988"
          className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-500/20 dark:text-red-400"
        >
          <Phone className="size-4" />
          Call 988 Suicide & Crisis Lifeline
        </a>
        <a
          href="sms:741741&body=HELLO"
          className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-500/20 dark:text-red-400"
        >
          <Heart className="size-4" />
          Text HOME to 741741 (Crisis Text Line)
        </a>
      </div>
      <p className="text-[10px] text-red-600/60 dark:text-red-400/60">
        You are not alone. Help is available 24/7.
      </p>
    </motion.div>
  );
}

export function HealthChat() {
  const { messages, loading, crisis, send, clear } = useChat();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, crisis]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const msg = input;
    setInput("");
    await send(msg);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {messages.length === 0 && !crisis && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <Bot className="size-7 text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">Health Chat Assistant</h3>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Ask me about health topics, wellness tips, or general medical information.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); }}
                    className="rounded-full border bg-muted/50 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-2.5", msg.role === "user" && "flex-row-reverse")}
            >
              <div className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full",
                msg.role === "assistant" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {msg.role === "assistant" ? <Sparkles className="size-3.5" /> : <User className="size-3.5" />}
              </div>
              <div className={cn(
                "max-w-[80%] whitespace-pre-line rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                msg.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {crisis && <CrisisAlert crisis={crisis} />}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-3.5" />
              </div>
              <div className="flex items-center gap-1 rounded-xl bg-muted px-3.5 py-3">
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/40" />
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about your health..."
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            disabled={loading}
          />
          {messages.length > 0 && (
            <Button variant="ghost" size="icon" onClick={clear} className="size-9 shrink-0 text-muted-foreground">
              <Trash2 className="size-4" />
            </Button>
          )}
          <Button
            size="icon"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="size-9 shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </div>
        <AIDisclaimer variant="compact" />
      </div>
    </div>
  );
}
