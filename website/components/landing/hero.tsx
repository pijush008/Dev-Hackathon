"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:pt-32 sm:pb-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_50%)]" />
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3.5 py-1 text-xs font-medium text-muted-foreground"
        >
          <Sparkles className="size-3.5 text-primary" />
          Now in public beta
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Build faster.
          <br />
          <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Ship smarter.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          The all-in-one platform to build, deploy, and scale your SaaS.
          Stop wasting time on infrastructure and focus on what matters.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link
            href="/auth/signup"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Get started free
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="#features"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-base font-medium text-foreground transition-colors hover:bg-muted"
          >
            See features
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            14-day free trial
          </span>
          <span className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            Cancel anytime
          </span>
        </motion.div>
      </div>
    </section>
  );
}
