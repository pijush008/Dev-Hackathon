"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/dashboard/user-menu";
import { NotificationDropdown } from "@/components/dashboard/notifications";
import { SearchInput } from "@/components/dashboard/search-input";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </Button>

      <SearchInput className="hidden w-full max-w-xs md:flex lg:max-w-sm" />

      <div className="ml-auto flex items-center gap-1">
        <motion.div
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
        </motion.div>

        <NotificationDropdown />

        <UserMenu />
      </div>
    </header>
  );
}
