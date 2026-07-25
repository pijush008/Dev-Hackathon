"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Star,
  Phone,
  Video,
  MapPin,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getProviders } from "@/lib/actions/providers";

const typeLabels: Record<string, string> = {
  primary_care: "Primary Care",
  specialist: "Specialist",
  therapist: "Therapist",
  psychiatrist: "Psychiatrist",
  counselor: "Counselor",
  nurse: "Nurse",
  pharmacist: "Pharmacist",
  other: "Other",
};

const typeBadgeColors: Record<string, string> = {
  primary_care: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  specialist: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  therapist: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  psychiatrist: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  counselor: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  nurse: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  pharmacist: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  other: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loadProviders = useCallback(async () => {
    const res = await getProviders();
    if (res.success) setProviders([...res.data]);
    setLoading(false);
  }, []);

  useEffect(() => { loadProviders(); }, [loadProviders]);

  const filtered = providers.filter((p) => {
    const matchesSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.specialties?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === "all" || p.provider_type === filter;
    return matchesSearch && matchesFilter;
  });

  const types = ["all", ...new Set(providers.map((p) => p.provider_type))];

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Care Team</h1>
        <p className="text-sm text-muted-foreground">Find and connect with healthcare providers.</p>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {types.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={filter === t ? "default" : "outline"}
              onClick={() => setFilter(t)}
              className="shrink-0 text-xs"
            >
              {t === "all" ? "All" : typeLabels[t] || t}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading providers...</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Users className="size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium">
              {search || filter !== "all" ? "No matching providers" : "No providers available"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || filter !== "all"
                ? "Try adjusting your search or filters."
                : "Providers will appear here once they are added to the network."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((provider, i) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="transition-all hover:shadow-md hover:shadow-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {provider.avatar_url ? (
                        <img src={provider.avatar_url} alt={provider.name} className="size-12 rounded-xl object-cover" />
                      ) : (
                        <Users className="size-6" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold">{provider.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              variant="secondary"
                              className={cn("text-[10px] px-1.5 py-0", typeBadgeColors[provider.provider_type])}
                            >
                              {typeLabels[provider.provider_type] || provider.provider_type}
                            </Badge>
                            {provider.rating_avg > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Star className="size-3 fill-amber-400 text-amber-400" />
                                {Number(provider.rating_avg).toFixed(1)}
                                <span>({provider.rating_count})</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Specialties */}
                      {provider.specialties?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {provider.specialties.map((s: string) => (
                            <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Bio */}
                      {provider.bio && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{provider.bio}</p>
                      )}

                      {/* Capabilities */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {provider.telehealth && (
                          <span className="flex items-center gap-1">
                            <Video className="size-3" />
                            Video
                          </span>
                        )}
                        {provider.in_person && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            In-person
                          </span>
                        )}
                        {provider.languages?.length > 0 && (
                          <span className="text-muted-foreground/60">
                            {provider.languages.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
