"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { useUIStateContext } from "@/components/UIStateContext";
import StatsGrid from "./dashboard/StatsGrid";
import RecentUploads from "./dashboard/Uploads";
import QuickActions from "./dashboard/QuickAction";

export default function AdminDashboard() {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const userName = user?.firstName || user?.fullName || "Admin";

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h2
            className={`text-3xl font-extrabold ${
              darkMode ? "text-white" : "text-[#2B7A2D]"
            }`}
          >
            Welcome Back, {userName}
          </h2>

          <p
            className={`text-sm ${
              darkMode ? "text-neutral-400" : "text-gray-500"
            }`}
          >
            Manage HerbaGrove&apos;s knowledge base.
          </p>
        </div>

        <Link
          href="/dashboard"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            darkMode
              ? "bg-neutral-800 hover:bg-neutral-700 text-white"
              : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
          }`}
        >
          Switch to User View
          <ArrowRight size={16} />
        </Link>
      </div>

      <StatsGrid />

      <RecentUploads />

      <QuickActions />
    </>
  );
}