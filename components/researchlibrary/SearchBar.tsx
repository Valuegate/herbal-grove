"use client";

import { Search } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  const { darkMode } = useUIStateContext();

  return (
    <div className="relative w-full">
      <Search
        size={18}
        className={`absolute left-4 top-1/2 -translate-y-1/2 ${
          darkMode
            ? "text-neutral-400"
            : "text-gray-400"
        }`}
      />

      <input
        type="text"
        placeholder="Search research papers..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`w-full rounded-2xl border py-3 pl-12 pr-4 outline-none transition-all duration-200 ${
          darkMode
            ? "border-neutral-700 bg-[#222224] text-white placeholder:text-neutral-500 focus:border-green-500"
            : "border-gray-200 bg-white text-black placeholder:text-gray-400 focus:border-green-600"
        }`}
      />
    </div>
  );
}