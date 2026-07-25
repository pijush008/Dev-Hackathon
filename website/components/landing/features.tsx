"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  Pill,
  Video,
  ShieldAlert,
  FileText,
  Users,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  gradient?: string;
}

const features: Feature[] = [
  {
    title: "AI Symptom Checker",
    description:
      "Describe your symptoms in natural language and get instant, evidence-based guidance on urgency, possible conditions, and which specialist to see.",
    icon: Stethoscope,
    className: "sm:col-span-2 sm:row-span-1",
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    title: "Medication Reminders",
    description:
      "Never miss a dose. Smart reminders adapt to your schedule, track adherence, and flag dangerous drug interactions before they happen.",
    icon: Pill,
    gradient: "from-blue-500/10 to-indigo-500/10",
  },
  {
    title: "Rural Teleconsultation",
    description:
      "Connect with licensed doctors via video — no matter how remote your village is. Low-bandwidth optimized for areas with poor connectivity.",
    icon: Video,
    gradient: "from-violet-500/10 to-purple-500/10",
  },
  {
    title: "Crisis Detection & Response",
    description:
      "Two-pass AI detection identifies mental health crises in real-time and connects you instantly to 988 Lifeline, Crisis Text Line, or emergency services.",
    icon: ShieldAlert,
    gradient: "from-rose-500/10 to-red-500/10",
  },
  {
    title: "Medical Report Analysis",
    description:
      "Upload lab results, X-rays, or prescriptions. Our AI explains medical jargon in plain language and tracks trends across your health history.",
    icon: FileText,
    className: "sm:col-span-2",
    gradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    title: "Community Support Groups",
    description:
      "Join moderated peer groups for anxiety, depression, chronic pain, grief, and more. You're not alone — find your people.",
    icon: Users,
    gradient: "from-cyan-500/10 to-sky-500/10",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="relative px-4 py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Everything you need for
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              better health decisions
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            From symptom checking to crisis response, CareCompass puts
            healthcare tools in the hands of people who need them most.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid gap-4 sm:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={item}
                className={`group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 ${feature.className ?? ""}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl border bg-background/50 text-emerald-600 dark:text-emerald-400 backdrop-blur-sm">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
