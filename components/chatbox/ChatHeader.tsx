"use client";

import { Expand, RotateCcwIcon, ArrowUpLeft } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  onBack: () => void;
  onClose?: () => void;
}

const SparkleIcon = () => (
  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5Z" />
    <path d="M19 12L20.2 14.7L23 15.9L20.2 17.1L19 19.8L17.8 17.1L15 15.9L17.8 14.7Z" />
  </svg>
);

export default function ChatHeader({ onBack, onClose }: Props) {
  const { darkMode } = useUIStateContext();

  return (
    <header
      className={`flex h-20 items-center justify-between border-b px-6 ${
        darkMode ? "border-neutral-800" : "border-slate-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowUpLeft />
        </button>

        <div
          className={`grid h-9 w-9 place-items-center rounded-full ${
            darkMode ? "bg-green-900 text-green-300" : "bg-green-50 text-green-600"
          }`}
        >
          <SparkleIcon />
        </div>

        <div>
          <h2 className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            Herbal Mind AI
          </h2>
          <p className="text-xs font-medium uppercase text-green-600">● Online</p>
        </div>
      </div>

      <div className="flex items-center gap-5 text-green-600">
        <button onClick={onClose}>
          <RotateCcwIcon size={18} />
        </button>
      </div>
    </header>
  );
}