"use client";

import {
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  MoreHorizontal,
} from "lucide-react";
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

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: "in-person" | "video" | "follow-up";
  status: "upcoming" | "completed" | "cancelled" | "in-progress";
  location?: string;
}

interface AppointmentsTableProps {
  data: Appointment[];
  onView?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onJoin?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
}

const statusConfig = {
  upcoming: {
    label: "Upcoming",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500 animate-pulse",
  },
};

const typeConfig = {
  "in-person": { icon: MapPin, label: "In-Person" },
  video: { icon: Video, label: "Video" },
  "follow-up": { icon: Calendar, label: "Follow-Up" },
};

export function AppointmentsTable({
  data,
  onView,
  onCancel,
  onJoin,
  onReschedule,
}: AppointmentsTableProps) {
  const table = useTable({
    data,
    searchKeys: ["patientName", "doctorName", "specialty", "location"],
    defaultSortKey: "date",
    defaultSortDir: "desc",
    pageSize: 10,
  });

  return (
    <Card className="overflow-hidden">
      <div className="space-y-4 p-4">
        <DataTableToolbar
          search={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search appointments..."
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
                    columnKey="doctorName"
                    onToggle={table.toggleSort}
                  >
                    Doctor
                  </SortableHeader>
                </TableHead>
                <TableHead>Patient</TableHead>
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
                <TableHead>
                  <SortableHeader
                    sortKey={table.sortKey}
                    sortDir={table.sortDir}
                    columnKey="date"
                    onToggle={table.toggleSort}
                  >
                    Date & Time
                  </SortableHeader>
                </TableHead>
                <TableHead>Type</TableHead>
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
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                table.paginatedData.map((a) => {
                  const s = statusConfig[a.status];
                  const t = typeConfig[a.type];
                  const TypeIcon = t.icon;
                  return (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{a.doctorName}</p>
                          {a.location && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="size-3" /> {a.location}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-xs">
                          <User className="size-3 text-muted-foreground" />
                          {a.patientName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                          {a.specialty}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" /> {a.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" /> {a.time}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <TypeIcon className="size-3" />
                          {t.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.className}`}>
                          <span className={`size-1 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {(a.status === "upcoming" || a.status === "in-progress") && (
                            <>
                              {a.status === "in-progress" && a.type === "video" && (
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => onJoin?.(a)}
                                  title="Join Call"
                                >
                                  <Video className="size-3.5 text-emerald-500" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => onReschedule?.(a)}
                                title="Reschedule"
                              >
                                <Calendar className="size-3.5" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onView?.(a)}
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
            <p className="py-8 text-center text-sm text-muted-foreground">
              No appointments found.
            </p>
          ) : (
            table.paginatedData.map((a) => {
              const s = statusConfig[a.status];
              const t = typeConfig[a.type];
              const TypeIcon = t.icon;
              return (
                <div key={a.id} className="rounded-xl border p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold">{a.doctorName}</p>
                      <p className="text-xs font-medium text-primary">{a.specialty}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.className}`}>
                      <span className={`size-1 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="size-3" /> {a.patientName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" /> {a.date} · {a.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <TypeIcon className="size-3" /> {t.label}
                    </span>
                    {a.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" /> {a.location}
                      </span>
                    )}
                  </div>
                  {(a.status === "upcoming" || a.status === "in-progress") && (
                    <div className="flex gap-2 border-t pt-2.5">
                      {a.status === "in-progress" && a.type === "video" && (
                        <button
                          onClick={() => onJoin?.(a)}
                          className="flex-1 rounded-lg bg-emerald-500/10 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                        >
                          Join Call
                        </button>
                      )}
                      <button
                        onClick={() => onReschedule?.(a)}
                        className="flex-1 rounded-lg border py-1.5 text-xs font-medium"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => onCancel?.(a)}
                        className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400"
                      >
                        Cancel
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
