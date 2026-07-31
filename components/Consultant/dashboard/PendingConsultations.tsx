"use client";

import { ArrowRight } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

export default function PendingConsultations() {
  const { darkMode } = useUIStateContext();

  const consultations = [
    {
      patient: "John Doe",
      issue: "Can rosemary interact with warfarin?",
      time: "2 mins ago",
    },
    {
      patient: "Mary Johnson",
      issue: "Turmeric dosage while pregnant",
      time: "15 mins ago",
    },
    {
      patient: "David Williams",
      issue: "Ashwagandha for anxiety",
      time: "35 mins ago",
    },
  ];

  return (
    <div
      className={`rounded-2xl shadow-sm border p-6 ${
        darkMode
          ? "bg-neutral-900 border-neutral-800"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-xl font-bold ${
            darkMode
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Pending Consultations
        </h2>

        <button className="text-green-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {consultations.map((item) => (
          <div
            key={item.patient}
            className={`rounded-xl border p-4 flex justify-between items-center ${
              darkMode
                ? "border-neutral-700"
                : "border-gray-100"
            }`}
          >
            <div>
              <h3
                className={`font-semibold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {item.patient}
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                {item.issue}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {item.time}
              </p>
            </div>

            <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              Open
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}