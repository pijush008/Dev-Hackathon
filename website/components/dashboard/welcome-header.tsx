"use client";

import { motion } from "framer-motion";

interface WelcomeHeaderProps {
  name: string;
  email: string;
  avatarUrl: string | null;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(email: string) {
  return email
    .split("@")[0]
    .split("+")[0]
    .slice(0, 2)
    .toUpperCase();
}

export function WelcomeHeader({ name, email, avatarUrl }: WelcomeHeaderProps) {
  const greeting = getGreeting();
  const initials = getInitials(email);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4"
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name}
          className="size-12 rounded-full ring-2 ring-border"
        />
      ) : (
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-primary-foreground ring-2 ring-border">
          {initials}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting}, {name}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>
    </motion.div>
  );
}
