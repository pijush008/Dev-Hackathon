"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Bot, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";

const suggestions = [
  "Check my latest blood test",
  "Side effects of Ibuprofen?",
  "Book a cardiology visit",
];

export function AIAssistant() {
  const { messages, loading, send } = useChat();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const msg = input;
    setInput("");
    await send(msg);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="size-4" />
          </div>
          <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Online
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <ScrollArea className="max-h-[280px] pr-2">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="py-6 text-center">
                <p className="text-xs text-muted-foreground">Ask me anything about your health.</p>
              </div>
            )}
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}
              >
                <div className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full",
                  msg.role === "assistant" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {msg.role === "assistant" ? <Sparkles className="size-3" /> : <User className="size-3" />}
                </div>
                <div className={cn(
                  "max-w-[80%] whitespace-pre-line rounded-xl px-3 py-2 text-[13px] leading-relaxed",
                  msg.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Loader2 className="size-3 animate-spin" />
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-muted px-3 py-2.5">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/40" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        {messages.length <= 1 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="rounded-full border bg-muted/50 px-2.5 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your health..."
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            disabled={loading}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="size-9 shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          AI-generated advice. Always consult a professional.
        </p>
      </CardContent>
    </Card>
  );
}
