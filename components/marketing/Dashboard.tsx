"use client";

import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import HerbOfTheDay from "@/components/dashboard/herboftheday";
import ActivityHistoryCard from "@/components/activityhistory/activitysection";

export default function Dashboard() {
  const { darkMode } = useDashboardContext();

  return (
    <>
      <div className="space-y-1">
        <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-[#2b7a2d]'}`}>Welcome Back, Ayomide</h2>
        <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>Let&apos;s find the right balance for your wellness today</p>
      </div>

      <HerbOfTheDay darkMode={darkMode} />

      <ActivityHistoryCard darkMode={darkMode} />
    </>
  );
}
