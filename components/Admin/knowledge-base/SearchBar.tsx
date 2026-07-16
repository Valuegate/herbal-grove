"use client";

import { Search } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

export default function SearchBar() {
  const { darkMode } = useUIStateContext();

  return (
    <div className="relative w-full md:max-w-md">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search documents..."
        className={`w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition
        ${
          darkMode
            ? "bg-[#1E1E1E] border-neutral-700 text-white"
            : "bg-white border-gray-200"
        }`}
      />
    </div>
  );
}