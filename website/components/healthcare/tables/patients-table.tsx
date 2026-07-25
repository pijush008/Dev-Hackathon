"use client";

import { Phone, Mail, MoreHorizontal } from "lucide-react";
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

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  bloodGroup: string;
  status: "active" | "critical" | "inactive";
  lastVisit: string;
}

interface PatientsTableProps {
  data: Patient[];
  onView?: (patient: Patient) => void;
  onCall?: (patient: Patient) => void;
  onEmail?: (patient: Patient) => void;
}

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  critical: {
    label: "Critical",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/50",
  },
};

const avatarColors = [
  "from-blue-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-sky-500",
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function PatientsTable({ data, onView, onCall, onEmail }: PatientsTableProps) {
  const table = useTable({
    data,
    searchKeys: ["name", "email", "phone", "bloodGroup"],
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
          searchPlaceholder="Search patients..."
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
                    Patient
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="age"
                    onToggle={table.toggleSort}
                  >
                    Age
                  </SortableHeader>
                </TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="bloodGroup"
                    onToggle={table.toggleSort}
                  >
                    Blood Group
                  </SortableHeader>
                </TableHead>
                <TableHead>Contact</TableHead>
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
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="lastVisit"
                    onToggle={table.toggleSort}
                  >
                    Last Visit
                  </SortableHeader>
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No patients found.
                  </TableCell>
                </TableRow>
              ) : (
                table.paginatedData.map((p) => {
                  const s = statusConfig[p.status];
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getColor(p.name)} text-[10px] font-bold text-white`}
                          >
                            {getInitials(p.name)}
                          </div>
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{p.age}</TableCell>
                      <TableCell>{p.gender}</TableCell>
                      <TableCell>
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium">
                          {p.bloodGroup}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="size-3" /> {p.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="size-3" /> {p.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.className}`}>
                          <span className={`size-1 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {p.lastVisit}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView?.(p)}
                        >
                          <MoreHorizontal className="size-3.5" />
                        </Button>
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
            <p className="py-8 text-center text-sm text-muted-foreground">No patients found.</p>
          ) : (
            table.paginatedData.map((p) => {
              const s = statusConfig[p.status];
              return (
                <div key={p.id} className="rounded-xl border p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getColor(p.name)} text-[10px] font-bold text-white`}
                      >
                        {getInitials(p.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.age} yrs · {p.gender} · {p.bloodGroup}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.className}`}>
                      <span className={`size-1 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="size-3" /> {p.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="size-3" /> {p.email}
                    </span>
                  </div>
                  <div className="flex gap-2 border-t pt-2.5">
                    <button
                      onClick={() => onCall?.(p)}
                      className="flex-1 rounded-lg bg-emerald-500/10 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      Call
                    </button>
                    <button
                      onClick={() => onEmail?.(p)}
                      className="flex-1 rounded-lg bg-primary/10 py-1.5 text-xs font-medium text-primary"
                    >
                      Email
                    </button>
                    <button
                      onClick={() => onView?.(p)}
                      className="flex-1 rounded-lg border py-1.5 text-xs font-medium"
                    >
                      View
                    </button>
                  </div>
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
