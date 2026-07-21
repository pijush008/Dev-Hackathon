"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  initials: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "CTO, TechFlow",
    content:
      "This platform cut our deployment time by 80%. The developer experience is unmatched — we went from idea to production in days, not months.",
    initials: "SC",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Marcus Rivera",
    role: "Founder, ScaleUp",
    content:
      "We evaluated a dozen solutions before choosing this one. The security features and global infrastructure made it a no-brainer for our enterprise clients.",
    initials: "MR",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Emily Larsson",
    role: "Engineering Lead, DataPulse",
    content:
      "The API-first design and SDKs meant we were integrated in under a day. The analytics dashboard gives us insights we never had before.",
    initials: "EL",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "James Okonkwo",
    role: "VP Product, Nexus",
    content:
      "Switching to this platform was the best decision we made this quarter. Our team productivity increased by 40% almost overnight.",
    initials: "JO",
    color: "from-amber-500 to-orange-500",
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
    <section id="testimonials" className="relative px-4 py-20 sm:py-28">
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
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Trusted by industry leaders
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            See what our customers are saying about their experience.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid gap-4 sm:grid-cols-2"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Quote icon */}
              <div className="absolute right-4 top-4 text-primary/10">
                <Quote className="size-10" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3 border-t pt-5">
                <div
                  className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-xs font-bold text-white`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
