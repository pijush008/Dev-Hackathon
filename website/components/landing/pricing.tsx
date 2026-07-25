"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { CheckoutModal } from "@/components/payments/checkout-modal";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  action?: "checkout" | "signup" | "mailto";
}

const tiers: PricingTier[] = [
  {
    name: "Community",
    price: "Free",
    description: "Essential health tools for individuals and families.",
    features: [
      "AI symptom checker (5 uses/month)",
      "Medication reminders",
      "Crisis resource directory",
      "Community support groups",
      "Basic health dashboard",
    ],
    cta: "Get started free",
    action: "signup",
  },
  {
    name: "Pro",
    price: "\u20B9749",
    description: "Full access for individuals who need comprehensive care.",
    highlighted: true,
    features: [
      "Unlimited symptom checks",
      "Medical report upload & AI analysis",
      "Teleconsultation booking",
      "Mental health tracking",
      "Safety plan management",
      "Priority AI responses",
      "Ad-free experience",
    ],
    cta: "Subscribe now",
    action: "checkout",
  },
  {
    name: "Clinic",
    price: "Custom",
    description: "For clinics, NGOs, and rural health programs.",
    features: [
      "Multi-provider dashboard",
      "Patient management (up to 500)",
      "Bulk medication management",
      "Custom crisis protocols",
      "API access & integrations",
      "Dedicated support & SLA",
      "HIPAA compliance tools",
      "White-label option",
    ],
    cta: "Contact us",
    action: "mailto",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function Pricing() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleCheckout = (planName: string) => {
    setSelectedPlan(planName.toLowerCase());
    setCheckoutOpen(true);
  };

  return (
    <section id="pricing" className="relative px-4 py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            <Sparkles className="size-3.5" />
            Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Healthcare that fits your budget
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Start free. Upgrade when you need more. No hidden fees, no surprises
            — because your health shouldn&apos;t have a paywall.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid gap-6 lg:grid-cols-3"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={item}
              className={`relative flex flex-col rounded-2xl border bg-card p-7 transition-all duration-300 ${
                tier.highlighted
                  ? "border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]"
                  : "hover:shadow-lg hover:shadow-primary/5"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white shadow-lg shadow-emerald-600/25">
                  Most popular
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && tier.price !== "Free" && (
                    <span className="text-sm text-muted-foreground">/mo</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              {tier.action === "checkout" ? (
                <button
                  onClick={() => handleCheckout(tier.name)}
                  className={`mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-medium transition-all ${
                    tier.highlighted
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:bg-emerald-700"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {tier.cta}
                </button>
              ) : tier.action === "mailto" ? (
                <a
                  href="mailto:support@carecompass.app"
                  className={`mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-medium transition-all ${
                    tier.highlighted
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:bg-emerald-700"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {tier.cta}
                </a>
              ) : (
                <Link
                  href="/auth/signup"
                  className={`mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-medium transition-all ${
                    tier.highlighted
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:bg-emerald-700"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {tier.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        plan={selectedPlan}
        price="\u20B9749"
      />
    </section>
  );
}
