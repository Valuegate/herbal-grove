"use client";

import { Search } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

export default function HerbSearch() {
  const { darkMode } = useUIStateContext();

  return (
    <div className="relative max-w-md">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />

      <input
        placeholder="Search herbs..."
        className={`w-full rounded-xl border py-3 pl-11 pr-4
        ${
          darkMode
            ? "bg-[#1E1E1E] border-neutral-700 text-white"
            : "bg-white border-gray-200"
        }`}
      />
    </div>
  );
}