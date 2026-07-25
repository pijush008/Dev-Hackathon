"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Is CareCompass a replacement for my doctor?",
    answer:
      "No. CareCompass is a decision-support tool, not a medical provider. Our AI symptom checker helps you understand when to seek care, and our teleconsultation connects you with licensed doctors. We never replace the patient-physician relationship.",
  },
  {
    question: "Is my health data private and secure?",
    answer:
      "Absolutely. We use end-to-end encryption, Supabase Row-Level Security on every table, and never sell your data. We're designed with HIPAA guidelines in mind. Your medical reports, mood logs, and chat history are visible only to you.",
  },
  {
    question: "Does it work in areas with poor internet?",
    answer:
      "Yes. CareCompass is a Progressive Web App (PWA) that works offline on mobile. The symptom checker and medication reminders work without a connection. Teleconsultation requires internet but is optimized for low-bandwidth scenarios.",
  },
  {
    question: "What happens if the AI detects a crisis?",
    answer:
      "Our two-pass crisis detection (keyword matching + LLM analysis) immediately displays crisis resources including the 988 Suicide & Crisis Lifeline, Crisis Text Line, and local emergency services. We never ignore a potential crisis — the system defaults to providing help.",
  },
  {
    question: "Is the Community plan really free?",
    answer:
      "Yes. The Community plan is free forever with no credit card required. It includes 5 AI symptom checks per month, medication reminders, crisis resources, support groups, and a basic health dashboard. We believe essential health tools shouldn't have a paywall.",
  },
  {
    question: "Can clinics and NGOs use CareCompass?",
    answer:
      "Yes. Our Clinic plan is designed for healthcare organizations, NGOs, and rural health programs. It includes patient management, bulk medication tracking, custom crisis protocols, API access, and HIPAA compliance tools. Contact us for pricing.",
  },
  {
    question: "How accurate is the AI symptom checker?",
    answer:
      "Our AI provides evidence-based guidance using clinical data, but it's not a diagnosis. It helps you understand urgency levels (emergency, urgent, routine) and suggests appropriate specialists. Always consult a healthcare professional for medical decisions.",
  },
  {
    question: "What mental health support is available?",
    answer:
      "CareCompass includes therapeutic AI chat, mood and anxiety tracking, safety plan management, and moderated community support groups for anxiety, depression, grief, addiction, chronic pain, and caregiver burnout. Crisis detection is always active.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative px-4 py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            <HelpCircle className="size-3.5" />
            FAQ
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Frequently asked questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Everything you need to know about using CareCompass for your
            healthcare journey.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 space-y-3"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "overflow-hidden rounded-xl border bg-card transition-all duration-300",
                  isOpen && "shadow-lg shadow-emerald-500/5",
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
