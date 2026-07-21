"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  BarChart3,
  Users,
  Globe,
  Code2,
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
    title: "Lightning Fast",
    description:
      "Edge-optimized infrastructure delivers sub-100ms response times globally.",
    icon: Zap,
    className: "sm:col-span-2 sm:row-span-1",
    gradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    title: "Enterprise Security",
    description:
      "SOC 2 compliant with end-to-end encryption and advanced threat detection.",
    icon: Shield,
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    title: "Advanced Analytics",
    description:
      "Real-time dashboards and custom reports to track every metric that matters.",
    icon: BarChart3,
    gradient: "from-blue-500/10 to-indigo-500/10",
  },
  {
    title: "Team Collaboration",
    description:
      "Work together in real-time with granular permissions and audit logs.",
    icon: Users,
    gradient: "from-violet-500/10 to-purple-500/10",
  },
  {
    title: "Global Scale",
    description:
      "Deploy to 30+ regions worldwide with automatic failover and load balancing.",
    icon: Globe,
    className: "sm:col-span-2",
    gradient: "from-cyan-500/10 to-sky-500/10",
  },
  {
    title: "API First",
    description:
      "RESTful and GraphQL APIs with SDKs for every major language and framework.",
    icon: Code2,
    gradient: "from-rose-500/10 to-pink-500/10",
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
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
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
            Everything you need to scale
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            From prototyping to production, our platform has the tools to
            support your journey at every stage.
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
                className={`group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ${feature.className ?? ""}`}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl border bg-background/50 text-primary backdrop-blur-sm">
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
