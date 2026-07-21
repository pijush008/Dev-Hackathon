"use client";

import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  Video,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DoctorCardProps {
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  rating: number;
  reviewCount: number;
  experience: string;
  availableSlots: number;
  nextAvailable: string;
  avatarUrl?: string;
  isAvailable?: boolean;
  onBook?: () => void;
  onVideo?: () => void;
  onMessage?: () => void;
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

export function DoctorCard({
  name,
  specialty,
  hospital,
  location,
  rating,
  reviewCount,
  experience,
  availableSlots,
  nextAvailable,
  avatarUrl,
  isAvailable = true,
  onBook,
  onVideo,
  onMessage,
}: DoctorCardProps) {
  const color = getColor(specialty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={name}
                  className="size-16 rounded-2xl object-cover ring-2 ring-border"
                />
              ) : (
                <div
                  className={`flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-lg font-bold text-white`}
                >
                  {getInitials(name)}
                </div>
              )}
              {isAvailable && (
                <div className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-card bg-emerald-500" />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{name}</h3>
                  <p className="text-xs font-medium text-primary">{specialty}</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1">
                  <Star className="size-3 fill-primary text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    {rating}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({reviewCount})
                  </span>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3" />
                  {hospital} · {location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3" />
                  {experience} experience
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3" />
                  {isAvailable
                    ? `${availableSlots} slots available`
                    : `Next: ${nextAvailable}`}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2 border-t pt-3">
            <button
              onClick={onBook}
              disabled={!isAvailable}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="size-3" />
              Book Now
            </button>
            <button
              onClick={onVideo}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Video className="size-3" />
            </button>
            <button
              onClick={onMessage}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <MessageSquare className="size-3" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
