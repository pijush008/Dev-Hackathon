"use client";

import { useState } from "react";
import { Search, Command } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm transition-all",
        focused
          ? "border-ring ring-1 ring-ring/20 bg-background"
          : "border-transparent hover:bg-muted",
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <kbd className="pointer-events-none hidden items-center gap-0.5 rounded-md border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
        <Command className="size-2.5" />K
      </kbd>
    </div>
  );
}
