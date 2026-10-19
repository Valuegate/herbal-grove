import { ReactNode } from "react";
import { useUIStateContext } from "@/components/UIStateContext";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  const { darkMode } = useUIStateContext();
  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 ${
        darkMode
          ? "bg-[#1E1E1E] border-neutral-800"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm ${
              darkMode ? "text-neutral-400" : "text-gray-500"
            }`}
          >
            {title}
          </p>

          <h2
            className={`mt-2 text-3xl font-bold ${
              darkMode ? "text-white" : "text-[#2B7A2D]"
            }`}
          >
            {value}
          </h2>
        </div>

        <div
          className={`p-3 rounded-xl ${
            darkMode
              ? "bg-neutral-800 text-green-400"
              : "bg-green-100 text-[#2B7A2D]"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}