"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Paperclip,
  X,
  Maximize2,
  Minimize2,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AIChatWindowProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSend?: (message: string) => void;
}

const mockMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your AI health assistant. I can help you understand your symptoms, medication information, or general health questions. How can I help you today?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    role: "user",
    content: "I've been having persistent headaches for the past week. Should I be concerned?",
    timestamp: "10:31 AM",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Persistent headaches lasting a week or more should be evaluated by a healthcare professional. While most headaches are not serious, they can sometimes indicate underlying conditions. I'd recommend:\n\n1. Schedule an appointment with your doctor\n2. Keep a headache diary (frequency, intensity, triggers)\n3. Stay hydrated and maintain regular sleep\n\nWould you like me to help you book an appointment with a neurologist?",
    timestamp: "10:31 AM",
  },
];

const suggestions = [
  "Check my latest blood test results",
  "What are the side effects of Ibuprofen?",
  "Book an appointment with a cardiologist",
  "Explain my prescription",
];

export function AIChatWindow({
  isOpen: initialOpen = false,
  onClose,
  onSend,
}: AIChatWindowProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    onSend?.(input);

    // Simulate AI typing
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Thank you for your question. Based on the information you've provided, I'd recommend consulting with your healthcare provider for a personalized assessment. In the meantime, here are some general guidelines...",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-50 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/25 transition-shadow hover:shadow-2xl hover:shadow-primary/30"
          >
            <Stethoscope className="size-6" />
            {/* AI indicator */}
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : 520,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "fixed bottom-6 left-6 z-50 flex w-[calc(100%-3rem)] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl sm:w-96",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Bot className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Health Assistant</h3>
                  <p className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                >
                  {isMinimized ? (
                    <Maximize2 className="size-4" />
                  ) : (
                    <Minimize2 className="size-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onClose?.();
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-2.5",
                        msg.role === "user" && "flex-row-reverse",
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-full",
                          msg.role === "assistant"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {msg.role === "assistant" ? (
                          <Sparkles className="size-3.5" />
                        ) : (
                          <User className="size-3.5" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                          msg.role === "assistant"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground",
                        )}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2.5"
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Sparkles className="size-3.5" />
                      </div>
                      <div className="flex items-center gap-1 rounded-xl bg-muted px-3.5 py-3">
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {messages.length <= 2 && (
                  <div className="border-t px-4 pt-3">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Suggested
                    </p>
                    <div className="flex flex-wrap gap-1.5">
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
                  </div>
                )}

                {/* Input */}
                <div className="border-t p-3">
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                      <Paperclip className="size-4" />
                    </button>
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask about your health..."
                      className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="rounded-lg bg-primary p-2 text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
                    >
                      <Send className="size-4" />
                    </button>
                  </div>
                  <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                    AI-generated advice. Always consult a healthcare professional.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
