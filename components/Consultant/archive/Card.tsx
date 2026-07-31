"use client";

import { useUIStateContext } from "@/components/UIStateContext";

interface ArchiveCardProps {
  initials: string;
  name: string;
  diagnosis: string;
  date: string;
  duration: string;
  status: "Completed";
}

export default function ArchiveCard({
  initials,
  name,
  diagnosis,
  date,
  duration,
  status,
}: ArchiveCardProps) {
  const { darkMode } = useUIStateContext();

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition ${
        darkMode
          ? "bg-[#1E1E1E] border-neutral-800"
          : "bg-white border-neutral-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
              darkMode
                ? "bg-emerald-900 text-emerald-300"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {initials}
          </div>

          <div>
            <h3
              className={`font-semibold text-lg ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              {name}
            </h3>

            <p
              className={`text-sm ${
                darkMode ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              {diagnosis}
            </p>

            <div
              className={`mt-3 flex gap-5 text-sm ${
                darkMode ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              <span>{date}</span>
              <span>{duration}</span>
            </div>
          </div>
        </div>

        <div className="text-right space-y-3">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
              darkMode
                ? "bg-emerald-900 text-emerald-300"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {status}
          </span>

          <button
            className={`block text-sm font-semibold ${
              darkMode
                ? "text-emerald-400 hover:text-emerald-300"
                : "text-emerald-600 hover:text-emerald-700"
            }`}
          >
            View →
          </button>
        </div>
      </div>
    </div>
  );
}