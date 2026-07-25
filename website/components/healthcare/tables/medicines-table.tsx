"use client";

import { Pill, Clock, MoreHorizontal, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useTable } from "./use-table";
import {
  DataTableToolbar,
  SortableHeader,
  DataTablePagination,
} from "./data-table-components";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  duration: string;
  withFood: "before" | "after" | "any";
  status: "active" | "completed" | "missed" | "paused";
  notes?: string;
}

interface MedicinesTableProps {
  data: Medicine[];
  onView?: (medicine: Medicine) => void;
  onMarkTaken?: (medicine: Medicine) => void;
  onSnooze?: (medicine: Medicine) => void;
}

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: CheckCircle2,
  },
  missed: {
    label: "Missed",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: AlertTriangle,
  },
  paused: {
    label: "Paused",
    className: "bg-muted text-muted-foreground",
    icon: Pill,
  },
};

export function MedicinesTable({ data, onView, onMarkTaken, onSnooze }: MedicinesTableProps) {
  const table = useTable({
    data,
    searchKeys: ["name", "dosage", "frequency", "duration"],
    defaultSortKey: "name",
    defaultSortDir: "asc",
    pageSize: 10,
  });

  return (
    <Card className="overflow-hidden">
      <div className="space-y-4 p-4">
        <DataTableToolbar
          search={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search medicines..."
          totalItems={table.totalItems}
        />

        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="name"
                    onToggle={table.toggleSort}
                  >
                    Medicine
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="dosage"
                    onToggle={table.toggleSort}
                  >
                    Dosage
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="frequency"
                    onToggle={table.toggleSort}
                  >
                    Frequency
                  </SortableHeader>
                </TableHead>
                <TableHead>Time</TableHead>
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="duration"
                    onToggle={table.toggleSort}
                  >
                    Duration
                  </SortableHeader>
                </TableHead>
                <TableHead>With Food</TableHead>
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="status"
                    onToggle={table.toggleSort}
                  >
                    Status
                  </SortableHeader>
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No medicines found.
                  </TableCell>
                </TableRow>
              ) : (
                table.paginatedData.map((m) => {
                  const s = statusConfig[m.status];
                  const StatusIcon = s.icon;
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                            <Pill className="size-4" />
                          </div>
                          <div>
                            <p className="font-medium">{m.name}</p>
                            {m.notes && (
                              <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                                {m.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{m.dosage}</TableCell>
                      <TableCell className="text-xs text-muted-foreground capitalize">
                        {m.frequency.replace(/-/g, " ")}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" /> {m.time}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.duration}</TableCell>
                      <TableCell className="text-xs capitalize text-muted-foreground">
                        {m.withFood === "any" ? "Any time" : `${m.withFood} food`}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.className}`}>
                          <StatusIcon className="size-3" />
                          {s.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {m.status === "active" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onMarkTaken?.(m)}
                                title="Mark Taken"
                              >
                                <CheckCircle2 className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onSnooze?.(m)}
                                title="Snooze"
                              >
                                <Clock className="size-3.5" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView?.(m)}
                          >
                            <MoreHorizontal className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 md:hidden">
          {table.paginatedData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No medicines found.</p>
          ) : (
            table.paginatedData.map((m) => {
              const s = statusConfig[m.status];
              const StatusIcon = s.icon;
              return (
                <div key={m.id} className="rounded-xl border p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                        <Pill className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{m.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.dosage} · {m.frequency.replace(/-/g, " ")}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.className}`}>
                      <StatusIcon className="size-3" />
                      {s.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> {m.time}
                    </span>
                    <span>{m.duration}</span>
                    <span className="capitalize">
                      {m.withFood === "any" ? "Any time" : `${m.withFood} food`}
                    </span>
                  </div>
                  {m.status === "active" && (
                    <div className="flex gap-2 border-t pt-2.5">
                      <button
                        onClick={() => onMarkTaken?.(m)}
                        className="flex-1 rounded-lg bg-emerald-500/10 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                      >
                        Mark Taken
                      </button>
                      <button
                        onClick={() => onSnooze?.(m)}
                        className="rounded-lg border px-3 py-1.5 text-xs font-medium"
                      >
                        Snooze
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <DataTablePagination
          page={table.page}
          totalPages={table.totalPages}
          onPageChange={table.setPage}
          pageSize={table.pageSize}
          onPageSizeChange={table.setPageSize}
          totalItems={table.totalItems}
        />
      </div>
    </Card>
  );
}
