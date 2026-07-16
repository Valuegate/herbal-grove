"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Shield } from "lucide-react";

import { useUIStateContext } from "@/components/UIStateContext";
import HerbOfTheDay from "@/components/dashboard/herboftheday";
import ActivityHistoryCard from "@/components/activityhistory/activitysection";

export default function Dashboard() {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const userName = user?.firstName || user?.fullName || "User";
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h2
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-[#2b7a2d]"
            }`}
          >
            Welcome Back, {userName}
          </h2>

          <p
            className={`text-sm ${
              darkMode ? "text-neutral-400" : "text-gray-500"
            }`}
          >
            Let&apos;s find the right balance for your wellness today.
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              darkMode
                ? "bg-neutral-800 hover:bg-neutral-700 text-white"
                : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <Shield size={18} />
            Switch to Admin
          </Link>
        )}
      </div>

      <HerbOfTheDay darkMode={darkMode} />

      <ActivityHistoryCard darkMode={darkMode} />
    </>
  );
}