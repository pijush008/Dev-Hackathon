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
    name: "Dr. Amara Okafor",
    role: "Rural Health Physician, Kansas",
    content:
      "CareCompass has transformed how I reach patients in underserved areas. The AI symptom checker helps triage before appointments, and the teleconsultation works even on poor connections. It's like having a digital health worker in every village.",
    initials: "AO",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Maria Santos",
    role: "Patient, New Mexico",
    content:
      "I live 45 minutes from the nearest clinic. Being able to check my symptoms at home and share the report with my doctor has saved me so many unnecessary trips. The medication reminders are a lifesaver for my mom's prescriptions.",
    initials: "MS",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "James Whitefeather",
    role: "Community Health Worker, Montana",
    content:
      "The crisis detection feature has helped me identify two patients who needed immediate intervention. Having 988 and Crisis Text Line resources built right in means I can act fast when someone is struggling.",
    initials: "JW",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Sarah Kim",
    role: "Mental Health Counselor, Oregon",
    content:
      "I recommend CareCompass to all my clients between sessions. The mood tracker helps them build self-awareness, and the support groups give them community when they need it most. The safety plan feature is clinically sound.",
    initials: "SK",
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
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
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
            Trusted by patients & providers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Hear from the people using CareCompass to bridge the healthcare gap
            in their communities.
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
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div className="absolute right-4 top-4 text-emerald-500/10">
                <Quote className="size-10" />
              </div>

              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.content}&rdquo;
              </p>

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
