"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Heart,
  Shield,
  ChevronRight,
  Brain,
  Dumbbell,
  Apple,
  Moon,
  Droplets,
  SmilePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResultCard, ActionList } from "@/components/healthcare/ai-result-card";
import { AIDisclaimer } from "@/components/healthcare/ai-disclaimer";
import { useWellness } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

interface Topic {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  prompt: string;
}

const topics: Topic[] = [
  { label: "Mental Health", icon: Brain, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10", prompt: "How can I improve my mental health and manage stress effectively?" },
  { label: "Exercise", icon: Dumbbell, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", prompt: "What are the best exercise routines for overall health and wellness?" },
  { label: "Nutrition", icon: Apple, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", prompt: "How can I improve my diet for better health and energy?" },
  { label: "Sleep", icon: Moon, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10", prompt: "How can I improve my sleep quality and establish healthy sleep habits?" },
  { label: "Hydration", icon: Droplets, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10", prompt: "How much water should I drink daily and how does hydration affect health?" },
  { label: "Stress Relief", icon: SmilePlus, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", prompt: "What are effective techniques for stress relief and relaxation?" },
];

export function WellnessSuggestions() {
  const { result, loading, getSuggestions, clear } = useWellness();
  const [customTopic, setCustomTopic] = useState("");

  const handleTopicClick = async (topic: Topic) => {
    await getSuggestions(topic.prompt);
  };

  const handleCustom = async () => {
    if (!customTopic.trim()) return;
    await getSuggestions(customTopic);
    setCustomTopic("");
  };

  return (
    <div className="space-y-4">
      {/* Topic grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {topics.map((topic, i) => {
          const Icon = topic.icon;
          return (
            <motion.button
              key={topic.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTopicClick(topic)}
              disabled={loading}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-all hover:shadow-md hover:shadow-primary/5",
                loading && "opacity-50"
              )}
            >
              <div className={cn("flex size-10 items-center justify-center rounded-xl", topic.bg)}>
                <Icon className={cn("size-5", topic.color)} />
              </div>
              <span className="text-xs font-medium">{topic.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Custom topic */}
      <div className="flex gap-2">
        <input
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCustom()}
          placeholder="Or type your own wellness topic..."
          className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        />
        <Button
          onClick={handleCustom}
          disabled={loading || !customTopic.trim()}
          size="sm"
          className="gap-1.5"
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
          Get Tips
        </Button>
      </div>

      <AIDisclaimer variant="compact" />

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <ResultCard title="Wellness Advice" icon={Heart} iconBg="bg-rose-500/10" iconColor="text-rose-600 dark:text-rose-400">
              <p className="text-sm leading-relaxed text-muted-foreground">{result.advice}</p>
            </ResultCard>

            {result.keyPoints?.length > 0 && (
              <ResultCard title="Key Points" icon={Shield} iconBg="bg-emerald-500/10" iconColor="text-emerald-600 dark:text-emerald-400">
                <ActionList items={result.keyPoints} />
              </ResultCard>
            )}

            {result.actionableSteps?.length > 0 && (
              <ResultCard title="Actionable Steps" icon={ChevronRight} iconBg="bg-blue-500/10" iconColor="text-blue-600 dark:text-blue-400">
                <ActionList items={result.actionableSteps} />
              </ResultCard>
            )}

            {result.precautions?.length > 0 && (
              <ResultCard title="Precautions" icon={Shield} iconBg="bg-amber-500/10" iconColor="text-amber-600 dark:text-amber-400">
                <ActionList items={result.precautions} />
              </ResultCard>
            )}

            <AIDisclaimer variant="full" />

            <Button variant="outline" size="sm" onClick={clear} className="w-full">
              Explore Another Topic
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
