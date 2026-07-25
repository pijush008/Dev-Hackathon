"use client";

import { ArrowRight, Heart, Shield, Activity } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:pt-36 sm:pb-28">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
        <div
          className="absolute inset-0 animate-gradient-shift opacity-30 dark:opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, hsl(142 71% 45% / 0.15), transparent 50%), radial-gradient(circle at 80% 20%, hsl(199 89% 48% / 0.1), transparent 50%), radial-gradient(circle at 40% 80%, hsl(262 83% 58% / 0.08), transparent 50%)",
            backgroundSize: "200% 200%",
          }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground) / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Floating health icons */}
      <div className="animate-float-slow absolute left-[10%] top-[15%] rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="animate-float-slower absolute right-[5%] top-[25%] size-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 backdrop-blur-sm">
          <Heart className="size-3.5 fill-emerald-500 text-emerald-500" />
          Bridging the healthcare gap for rural communities
        </div>

        {/* Heading */}
        <h1 className="animate-fade-in-up text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" style={{ animationDelay: "0.1s" }}>
          Healthcare for
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
            Everyone, Everywhere
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl" style={{ animationDelay: "0.2s" }}>
          AI-powered symptom checking, medication reminders, mental health support,
          and teleconsultation — designed for communities where healthcare access
          shouldn&apos;t depend on your zip code.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/auth/signup"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 text-base font-medium text-white shadow-lg shadow-emerald-600/25 transition-all hover:shadow-xl hover:shadow-emerald-600/30 hover:bg-emerald-700"
          >
            Start for free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#features"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-8 text-base font-medium text-foreground backdrop-blur-sm transition-all hover:bg-muted"
          >
            Explore features
          </Link>
        </div>

        {/* Trust signals */}
        <div className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground" style={{ animationDelay: "0.4s" }}>
          <span className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            HIPAA-aware design
          </span>
          <span className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            Works offline on mobile
          </span>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-in-up-delayed mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4" style={{ animationDelay: "0.5s" }}>
          {[
            { icon: Heart, label: "Lives touched", value: "10,000+" },
            { icon: Activity, label: "Symptoms checked", value: "50,000+" },
            { icon: Shield, label: "Crisis interventions", value: "1,200+" },
            { icon: ArrowRight, label: "Rural communities", value: "200+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border bg-card/50 px-4 py-5 text-center backdrop-blur-sm"
            >
              <stat.icon className="mx-auto mb-2 size-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Dashboard preview */}
        <div className="animate-fade-in-up-delayed relative mt-16 mx-auto max-w-4xl" style={{ animationDelay: "0.6s" }}>
          <div className="relative rounded-2xl border bg-card p-2 shadow-2xl shadow-emerald-500/5">
            <div className="rounded-xl bg-muted/50 p-4 sm:p-6">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 mb-4">
                <div className="size-3 rounded-full bg-red-400" />
                <div className="size-3 rounded-full bg-yellow-400" />
                <div className="size-3 rounded-full bg-green-400" />
                <div className="ml-4 h-2 w-32 rounded-full bg-muted-foreground/20" />
              </div>
              {/* Fake dashboard */}
              <div className="grid gap-3 sm:grid-cols-4">
                {[
                  { color: "bg-emerald-500/20", label: "Heart Rate", value: "72 bpm" },
                  { color: "bg-blue-500/20", label: "Blood Pressure", value: "120/80" },
                  { color: "bg-violet-500/20", label: "Sleep", value: "7.5 hrs" },
                  { color: "bg-amber-500/20", label: "Mood", value: "Good" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={`${card.color} rounded-lg border border-border/30 p-3`}
                  >
                    <p className="text-[10px] text-muted-foreground">{card.label}</p>
                    <p className="mt-1 text-sm font-semibold">{card.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="h-24 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                  <p className="text-[10px] font-medium text-emerald-600">AI Assistant</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">How can I help you today?</p>
                </div>
                <div className="h-24 rounded-lg bg-blue-500/5 border border-blue-500/10 p-3">
                  <p className="text-[10px] font-medium text-blue-600">Next Appointment</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Dr. Smith — Tomorrow 2pm</p>
                </div>
                <div className="h-24 rounded-lg bg-violet-500/5 border border-violet-500/10 p-3">
                  <p className="text-[10px] font-medium text-violet-600">Medication</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Take Lisinopril at 8am</p>
                </div>
              </div>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-b from-emerald-500/10 to-transparent blur-2xl" />
        </div>
      </div>
    </section>
  );
}
