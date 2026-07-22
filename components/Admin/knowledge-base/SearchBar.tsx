"use client";

import { Search } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  const { darkMode } = useUIStateContext();

  return (
    <div className="relative w-full md:max-w-md">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search documents..."
        className={`w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition ${
          darkMode
            ? "border-neutral-700 bg-[#1E1E1E] text-white"
            : "border-gray-200 bg-white"
        }`}
      />
    </div>
  );
}