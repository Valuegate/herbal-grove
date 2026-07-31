"use client";

import {
  Clock3,
  CheckCircle2,
  Star,
} from "lucide-react";

import { useUIStateContext } from "@/components/UIStateContext";

export default function StatCards() {
  const { darkMode } = useUIStateContext();

  const stats = [
    {
      title: "Pending",
      value: "12",
      icon: Clock3,
      color: "text-orange-500",
    },
    {
      title: "Completed",
      value: "84",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Rating",
      value: "4.9",
      icon: Star,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className={`rounded-2xl shadow-sm border p-6 ${
              darkMode
                ? "bg-neutral-900 border-neutral-800"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  {stat.title}
                </p>

                <h2
                  className={`text-3xl font-bold mt-2 ${
                    darkMode
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {stat.value}
                </h2>
              </div>

              <Icon
                size={32}
                className={stat.color}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}