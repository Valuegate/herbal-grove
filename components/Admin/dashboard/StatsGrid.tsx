"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import StatCard from "./StatCard";
import {
  FileText,
  Leaf,
  Database,
  Clock3,
} from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

export default function StatsGrid() {
  const { darkMode } = useUIStateContext();
  const stats = useQuery(api.dashboard.getDashboardStats);
  console.log("Dashboard stats:", stats);

  if (!stats) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-32 animate-pulse rounded-2xl ${
              darkMode
                ? "bg-neutral-800"
                : "bg-gray-100"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Documents"
        value={stats.totalDocuments}
        icon={<FileText size={24} />}
      />

      <StatCard
        title="Herbs"
        value={stats.totalHerbs}
        icon={<Leaf size={24} />}
      />

      <StatCard
        title="Pending"
        value={stats.pendingDocuments}
        icon={<Clock3 size={24} />}
      />
    </div>
  );
}