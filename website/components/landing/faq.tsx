"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How does the free trial work?",
    answer:
      "You get full access to the Pro plan for 14 days with no credit card required. At the end of your trial, you can choose a plan that fits your needs or downgrade to the free Starter plan.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle. Your data is always preserved.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "Starter plans include email support with a 24-hour response time. Pro plans get priority support with a 4-hour response time. Enterprise plans include 24/7 phone support with a dedicated account manager.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We are SOC 2 compliant and use end-to-end encryption for all data in transit and at rest. We also offer SSO/SAML for enterprise plans and maintain comprehensive audit logs.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel anytime from your account settings. Your access continues until the end of your billing period, and you can export your data at any time.",
  },
  {
    question: "Do you offer custom pricing for large teams?",
    answer:
      "Yes, our Enterprise plan is fully customizable. Contact our sales team for a personalized quote that matches your infrastructure, compliance, and support requirements.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Everything you need to know about our platform.
          </p>
        </div>

        <div className="mt-12 space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border bg-card transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium outline-none"
                >
                  {faq.question}
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
        </div>
      </div>
    </section>
  );
}
