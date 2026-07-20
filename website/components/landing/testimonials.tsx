"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "CTO, TechFlow",
    content:
      "This platform cut our deployment time by 80%. The developer experience is unmatched — we went from idea to production in days, not months.",
  },
  {
    name: "Marcus Rivera",
    role: "Founder, ScaleUp",
    content:
      "We evaluated a dozen solutions before choosing this one. The security features and global infrastructure made it a no-brainer for our enterprise clients.",
  },
  {
    name: "Emily Larsson",
    role: "Engineering Lead, DataPulse",
    content:
      "The API-first design and SDKs meant we were integrated in under a day. The analytics dashboard gives us insights we never had before.",
  },
  {
    name: "James Okonkwo",
    role: "VP Product, Nexus",
    content:
      "Switching to this platform was the best decision we made this quarter. Our team productivity increased by 40% almost overnight.",
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

export function Testimonials() {
  return (
    <section id="testimonials" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by industry leaders
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            See what our customers are saying about their experience.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-4 sm:grid-cols-2"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              className="flex flex-col rounded-xl border bg-card p-6"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
