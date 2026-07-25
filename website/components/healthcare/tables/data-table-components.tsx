"use client";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableToolbarProps {
  search: string;
  onSearchChange: (s: string) => void;
  searchPlaceholder?: string;
  totalItems: number;
  children?: React.ReactNode;
}

function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  totalItems,
  children,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {totalItems} result{totalItems !== 1 ? "s" : ""}
        </span>
        {children}
      </div>
    </div>
  );
}

interface SortableHeaderProps<T> {
  sortKey: keyof T | null;
  sortDir: "asc" | "desc";
  columnKey: keyof T;
  onToggle: (key: keyof T) => void;
  children: React.ReactNode;
  className?: string;
}

function SortableHeader<T>({
  sortKey,
  sortDir,
  columnKey,
  onToggle,
  children,
  className,
}: SortableHeaderProps<T>) {
  const isActive = sortKey === columnKey;
  return (
    <button
      onClick={() => onToggle(columnKey)}
      className={cn(
        "inline-flex items-center gap-1 text-left text-xs font-medium uppercase tracking-wider transition-colors hover:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground",
        className,
      )}
    >
      {children}
      <span className="flex flex-col">
        <span
          className={cn(
            "size-0 border-l-[3px] border-r-[3px] border-b-[4px] border-l-transparent border-r-transparent",
            isActive && sortDir === "asc"
              ? "border-b-foreground"
              : "border-b-muted-foreground/40",
          )}
        />
        <span
          className={cn(
            "-mt-1 size-0 border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent",
            isActive && sortDir === "desc"
              ? "border-t-foreground"
              : "border-t-muted-foreground/40",
          )}
        />
      </span>
    </button>
  );
}

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  pageSize: number;
  onPageSizeChange: (s: number) => void;
  totalItems: number;
}

function DataTablePagination({
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}: DataTablePaginationProps) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Showing {totalItems > 0 ? start : 0}–{end} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-8 rounded-md border bg-transparent px-2 text-xs"
        >
          {[5, 10, 20, 50].map((s) => (
            <option key={s} value={s}>
              {s} / page
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="size-3" />
          </Button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            return (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DataTableToolbar, SortableHeader, DataTablePagination };
