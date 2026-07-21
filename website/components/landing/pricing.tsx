"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$19",
    description: "Perfect for individuals and small projects.",
    features: [
      "Up to 5 projects",
      "10GB storage",
      "Basic analytics",
      "Email support",
      "API access",
    ],
    cta: "Get started",
  },
  {
    name: "Pro",
    price: "$79",
    description: "For growing teams that need more power.",
    highlighted: true,
    features: [
      "Unlimited projects",
      "100GB storage",
      "Advanced analytics",
      "Priority support",
      "Team collaboration",
      "Custom domains",
      "Audit logs",
    ],
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom needs.",
    features: [
      "Unlimited everything",
      "Dedicated infrastructure",
      "Custom integrations",
      "24/7 phone support",
      "SLA guarantee",
      "SSO / SAML",
      "On-premise option",
    ],
    cta: "Contact sales",
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
  return (
    <section id="pricing" className="relative px-4 py-20 sm:py-28">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
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
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            No hidden fees. No surprises. Pay only for what you need.
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
                  ? "border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                  : "hover:shadow-lg hover:shadow-primary/5"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/25">
                  Most popular
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
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
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="size-3 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={
                  tier.name === "Enterprise"
                    ? "mailto:sales@example.com"
                    : "/auth/signup"
                }
                className={`mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-medium transition-all ${
                  tier.highlighted
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
