"use client";

import { useUIStateContext } from "@/components/UIStateContext";

const stats = [
  {
    title: "Completed",
    value: "124",
  },
  {
    title: "This Month",
    value: "18",
  },
  {
    title: "Average Session",
    value: "24 mins",
  },
];

export default function Stats() {
  const { darkMode } = useUIStateContext();

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`rounded-2xl border p-6 transition ${
            darkMode
              ? "bg-[#1E1E1E] border-neutral-800"
              : "bg-white border-neutral-200"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-neutral-400" : "text-neutral-500"
            }`}
          >
            {stat.title}
          </p>

          <h2
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            {stat.value}
          </h2>
        </div>
      ))}
    </div>
  );
}