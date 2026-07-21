"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const values = [40, 65, 45, 80, 55, 90, 70];
const maxValue = Math.max(...values);

export function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Revenue Overview</CardTitle>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" />
              This year
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-48">
          {values.map((value, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(value / maxValue) * 100}%` }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary/40 hover:from-primary hover:to-primary/60 transition-colors cursor-pointer"
              />
              <span className="text-[11px] text-muted-foreground">
                {months[i]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
