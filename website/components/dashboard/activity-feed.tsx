"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: string;
  user: string;
  initials: string;
  action: string;
  target: string;
  time: string;
  color: string;
}

const activities: Activity[] = [
  {
    id: "1",
    user: "Sarah Chen",
    initials: "SC",
    action: "created a new project",
    target: "Marketing Dashboard",
    time: "2 min ago",
    color: "bg-blue-500",
  },
  {
    id: "2",
    user: "Alex Rivera",
    initials: "AR",
    action: "completed billing setup",
    target: "Enterprise plan",
    time: "15 min ago",
    color: "bg-emerald-500",
  },
  {
    id: "3",
    user: "Jordan Kim",
    initials: "JK",
    action: "invited team member",
    target: "jamie@example.com",
    time: "1 hour ago",
    color: "bg-violet-500",
  },
  {
    id: "4",
    user: "Morgan Davis",
    initials: "MD",
    action: "deployed",
    target: "v2.4.1 to production",
    time: "3 hours ago",
    color: "bg-amber-500",
  },
  {
    id: "5",
    user: "Casey Taylor",
    initials: "CT",
    action: "updated settings",
    target: "Notification preferences",
    time: "5 hours ago",
    color: "bg-rose-500",
  },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <button className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            View all
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-medium text-white ${activity.color}`}
                >
                  {activity.initials}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
