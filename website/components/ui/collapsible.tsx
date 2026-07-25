"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollapsibleProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  title?: string;
  direction?: "vertical" | "horizontal";
}

export function Collapsible({
  isOpen,
  onToggle,
  children,
  title,
  direction = "vertical",
}: CollapsibleProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {title && (
        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-2 hover:bg-muted/50"
          onClick={onToggle}
        >
          <span className="font-medium">{title}</span>
          {direction === "vertical" ? (
            isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
          ) : (
            isOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />
          )}
        </Button>
      )}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}