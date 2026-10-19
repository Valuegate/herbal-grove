"use client";

import { useUser } from "@clerk/nextjs";
import { useUIStateContext } from "@/components/UIStateContext";
import StatsGrid from "@/components/Admin/dashboard/StatsGrid";
import Uploads from "@/components/Admin/dashboard/Uploads";
import QuickActions from "@/components/Admin/dashboard/QuickAction";

export default function AdminDashboard() {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const userName = user?.firstName || user?.fullName || "Admin";

  return (
    <>
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
          Manage HerbaGrove's knowledge base.
        </p>
      </div>

      <StatsGrid />

      <Uploads />

      <QuickActions />
    </>
  );
}