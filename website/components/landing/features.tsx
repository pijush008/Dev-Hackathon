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
}

const features: Feature[] = [
  {
    title: "Lightning Fast",
    description:
      "Edge-optimized infrastructure delivers sub-100ms response times globally.",
    icon: Zap,
  },
  {
    title: "Enterprise Security",
    description:
      "SOC 2 compliant with end-to-end encryption and advanced threat detection.",
    icon: Shield,
  },
  {
    title: "Advanced Analytics",
    description:
      "Real-time dashboards and custom reports to track every metric that matters.",
    icon: BarChart3,
  },
  {
    title: "Team Collaboration",
    description:
      "Work together in real-time with granular permissions and audit logs.",
    icon: Users,
  },
  {
    title: "Global Scale",
    description:
      "Deploy to 30+ regions worldwide with automatic failover and load balancing.",
    icon: Globe,
  },
  {
    title: "API First",
    description:
      "RESTful and GraphQL APIs with SDKs for every major language and framework.",
    icon: Code2,
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to scale
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From prototyping to production, our platform has the tools to
            support your journey at every stage.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={item}
                className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg border bg-muted/50 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
