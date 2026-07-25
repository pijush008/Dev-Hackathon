"use client";

import { MapPin, Clock, Star, MoreHorizontal } from "lucide-react";
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

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  rating: number;
  experience: string;
  availableSlots: number;
  isAvailable: boolean;
  avatarUrl?: string;
}

interface DoctorsTableProps {
  data: Doctor[];
  onView?: (doctor: Doctor) => void;
  onBook?: (doctor: Doctor) => void;
}

const specialtyColors: Record<string, string> = {
  Cardiology: "from-red-500 to-rose-500",
  Neurology: "from-violet-500 to-purple-500",
  Orthopedics: "from-blue-500 to-indigo-500",
  Pediatrics: "from-amber-500 to-orange-500",
  Dermatology: "from-pink-500 to-rose-500",
  "General Medicine": "from-emerald-500 to-teal-500",
  Surgery: "from-cyan-500 to-sky-500",
};

function getColor(specialty: string) {
  return specialtyColors[specialty] ?? "from-gray-500 to-slate-500";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DoctorsTable({ data, onView, onBook }: DoctorsTableProps) {
  const table = useTable({
    data,
    searchKeys: ["name", "specialty", "hospital", "location"],
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
          searchPlaceholder="Search doctors..."
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
                    Doctor
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="specialty"
                    onToggle={table.toggleSort}
                  >
                    Specialty
                  </SortableHeader>
                </TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="rating"
                    onToggle={table.toggleSort}
                  >
                    Rating
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="experience"
                    onToggle={table.toggleSort}
                  >
                    Experience
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="isAvailable"
                    onToggle={table.toggleSort}
                  >
                    Availability
                  </SortableHeader>
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No doctors found.
                  </TableCell>
                </TableRow>
              ) : (
                table.paginatedData.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getColor(d.specialty)} text-[10px] font-bold text-white`}>
                          {getInitials(d.name)}
                        </div>
                        <div>
                          <p className="font-medium">{d.name}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3" /> {d.location}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                        {d.specialty}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                      {d.hospital}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-xs font-medium">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {d.rating}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> {d.experience}
                      </span>
                    </TableCell>
                    <TableCell>
                      {d.isAvailable ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="size-1 rounded-full bg-emerald-500" />
                          {d.availableSlots} slots
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          Unavailable
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView?.(d)}
                        >
                          <MoreHorizontal className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 md:hidden">
          {table.paginatedData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No doctors found.</p>
          ) : (
            table.paginatedData.map((d) => (
              <div key={d.id} className="rounded-xl border p-3.5 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getColor(d.specialty)} text-xs font-bold text-white`}>
                      {getInitials(d.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{d.name}</p>
                      <p className="text-xs font-medium text-primary">{d.specialty}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {d.rating}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" /> {d.hospital}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {d.experience}
                  </span>
                </div>
                <div className="flex gap-2 border-t pt-2.5">
                  {d.isAvailable ? (
                    <button
                      onClick={() => onBook?.(d)}
                      className="flex-1 rounded-lg bg-primary py-1.5 text-xs font-medium text-primary-foreground"
                    >
                      Book ({d.availableSlots} slots)
                    </button>
                  ) : (
                    <span className="flex-1 rounded-lg bg-muted py-1.5 text-center text-xs font-medium text-muted-foreground">
                      Unavailable
                    </span>
                  )}
                  <button
                    onClick={() => onView?.(d)}
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
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
