"use client";

import { ArrowRight, Sparkles, Play } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:pt-36 sm:pb-28">
      {/* Animated gradient background - pure CSS, no JS */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
        <div
          className="absolute inset-0 animate-gradient-shift opacity-30 dark:opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.15), transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.1), transparent 50%), radial-gradient(circle at 40% 80%, hsl(var(--primary) / 0.08), transparent 50%)",
            backgroundSize: "200% 200%",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground) / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Floating orbs - pure CSS animation */}
      <div className="animate-float-slow absolute left-[15%] top-[20%] size-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="animate-float-slower absolute right-[10%] top-[30%] size-96 rounded-full bg-primary/8 blur-3xl" />

      <div className="mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
          <Sparkles className="size-3.5" />
          Now in public beta
          <ArrowRight className="size-3" />
        </div>

        {/* Heading */}
        <h1 className="animate-fade-in-up text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" style={{ animationDelay: "0.1s" }}>
          Build faster.
          <br />
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Ship smarter.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl" style={{ animationDelay: "0.2s" }}>
          The all-in-one platform to build, deploy, and scale your SaaS.
          Stop wasting time on infrastructure and focus on what matters.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/auth/signup"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
          >
            Get started free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#features"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-8 text-base font-medium text-foreground backdrop-blur-sm transition-all hover:bg-muted"
          >
            <Play className="size-4" />
            See how it works
          </Link>
        </div>

        {/* Trust badges */}
        <div className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground" style={{ animationDelay: "0.4s" }}>
          <span className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            14-day free trial
          </span>
          <span className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            Cancel anytime
          </span>
        </div>

        {/* Dashboard preview */}
        <div className="animate-fade-in-up-delayed relative mt-16 mx-auto max-w-4xl" style={{ animationDelay: "0.5s" }}>
          <div className="relative rounded-2xl border bg-card p-2 shadow-2xl shadow-primary/5">
            <div className="rounded-xl bg-muted/50 p-4 sm:p-6">
              {/* Fake dashboard UI */}
              <div className="flex items-center gap-2 mb-4">
                <div className="size-3 rounded-full bg-red-400" />
                <div className="size-3 rounded-full bg-yellow-400" />
                <div className="size-3 rounded-full bg-green-400" />
                <div className="ml-4 h-2 w-24 rounded-full bg-muted-foreground/20" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { w: "w-full", h: "h-20" },
                  { w: "w-full", h: "h-20" },
                  { w: "w-full", h: "h-20" },
                ].map((card, i) => (
                  <div
                    key={i}
                    className={`${card.w} ${card.h} rounded-lg bg-background/50 border border-border/50`}
                  />
                ))}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="h-32 rounded-lg bg-background/50 border border-border/50" />
                <div className="h-32 rounded-lg bg-background/50 border border-border/50" />
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent blur-2xl" />
        </div>
      </div>
    </section>
  );
}
