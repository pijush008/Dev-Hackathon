"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/lib/actions/auth";
import { useAuth } from "@/hooks/useAuth";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, displayName, email, initials, loading } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="size-8 animate-pulse rounded-full bg-muted" />
    );
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-8 w-8 rounded-full"
        onClick={() => setOpen(!open)}
        aria-label="User menu"
        aria-expanded={open}
      >
        {user?.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={displayName ?? "User"}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <div className="size-full rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">
              {initials}
            </span>
          </div>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-popover text-popover-foreground shadow-lg border ring-1 ring-border"
          >
            <div className="p-2">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{displayName ?? "User"}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
              <Separator />
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => setOpen(false)}
              >
                <User className="size-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => setOpen(false)}
              >
                <Settings className="size-4" />
                Settings
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => setOpen(false)}
              >
                <Shield className="size-4" />
                Privacy & Security
              </Link>
              <Separator />
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent hover:text-destructive rounded-md"
                onClick={async () => {
                  await signOut();
                }}
              >
                <LogOut className="size-4" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
