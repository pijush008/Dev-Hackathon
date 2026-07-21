"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  AlertTriangle,
  MapPin,
  Heart,
  X,
  Siren,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyButtonProps {
  onCall?: () => void;
  onShareLocation?: () => void;
  onAlertContacts?: () => void;
}

const emergencyContacts = [
  { label: "Emergency Services", number: "911", icon: Siren },
  { label: "Poison Control", number: "1-800-222-1222", icon: AlertTriangle },
  { label: "Crisis Hotline", number: "988", icon: Heart },
];

export function EmergencyButton({
  onCall,
  onShareLocation,
  onAlertContacts,
}: EmergencyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const handleEmergency = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 2000);
  };

  return (
    <>
      {/* Emergency Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/30 transition-all hover:bg-red-700",
          isPulsing && "animate-pulse",
        )}
      >
        <Phone className="size-6" />
        {/* Pulse ring */}
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-20" />
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md overflow-hidden rounded-2xl border border-red-500/20 bg-card shadow-2xl shadow-red-500/10 sm:inset-x-auto"
            >
              {/* Red header */}
              <div className="flex items-center justify-between bg-red-600 px-5 py-4">
                <div className="flex items-center gap-2.5 text-white">
                  <AlertTriangle className="size-5" />
                  <h3 className="text-base font-bold">Emergency SOS</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-white/80 hover:bg-white/20"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onCall?.();
                      handleEmergency();
                    }}
                    className="flex flex-col items-center gap-2 rounded-xl bg-red-500/10 p-4 text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
                  >
                    <Phone className="size-7" />
                    <span className="text-xs font-bold">Call 911</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onShareLocation}
                    className="flex flex-col items-center gap-2 rounded-xl bg-amber-500/10 p-4 text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
                  >
                    <MapPin className="size-7" />
                    <span className="text-xs font-bold">Share Location</span>
                  </motion.button>
                </div>

                {/* Alert contacts */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onAlertContacts}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-red-500/30 bg-red-500/5 p-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
                >
                  <Heart className="size-4" />
                  Alert Emergency Contacts
                </motion.button>

                {/* Emergency contacts list */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Emergency Numbers
                  </p>
                  <div className="space-y-1.5">
                    {emergencyContacts.map((contact) => {
                      const ContactIcon = contact.icon;
                      return (
                        <a
                          key={contact.number}
                          href={`tel:${contact.number}`}
                          className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                        >
                          <span className="flex items-center gap-2.5">
                            <ContactIcon className="size-4 text-muted-foreground" />
                            {contact.label}
                          </span>
                          <span className="font-mono font-semibold text-primary">
                            {contact.number}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
