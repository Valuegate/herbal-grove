"use client";

import { useUIStateContext } from "@/components/UIStateContext";

export default function Search() {
  const { darkMode } = useUIStateContext();

  return (
    <div
      className={`rounded-2xl p-4 border ${
        darkMode
          ? "bg-[#1E1E1E] border-neutral-800"
          : "bg-white border-neutral-200"
      }`}
    >
      <input
        type="text"
        placeholder="Search patient..."
        className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
          darkMode
            ? "bg-[#121212] border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-emerald-500"
            : "bg-white border-neutral-300 text-black placeholder:text-neutral-400 focus:ring-2 focus:ring-emerald-500"
        }`}
      />
    </div>
  );
}