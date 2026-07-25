"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 border-r bg-sidebar text-sidebar-foreground lg:hidden"
          >
            <div className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
                  C
                </div>
                <span className="text-sm font-semibold">CareCompass</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="size-8 rounded-lg hover:bg-accent"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </motion.button>
            </div>
            <Sidebar collapsed={false} onToggleCollapse={() => {}} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}