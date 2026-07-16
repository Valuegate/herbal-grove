"use client";

import { useUIStateContext } from "@/components/UIStateContext";

export default function LatestPublication() {
  const { darkMode } = useUIStateContext();

  return (
    <section className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-medium ${darkMode ? "text-white" : 'text-black'}`}>Latest Publication</h2>

        <button className={`text-sm font-bold cursor-pointer ${darkMode ? "text-white" : 'text-black'}`} type="button">
          View All Papers
        </button>
      </div>

      <div className={`flex min-h-55 items-center justify-center rounded-xl border shadow-sm ${darkMode ? "border-gray-700 bg-[#222224]" : 'bg-white'}`}>
        <p className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
          No new publication
        </p>
      </div>
    </section>
  );
}