"use client";

import { Clock3 } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

interface Props{
  remainingSeconds: number
}
export default function ConsultationCountdown({remainingSeconds} : Props) {
  const { darkMode } = useUIStateContext();

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime =
    `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div
      className={`flex items-center justify-center gap-2 border-b px-4 py-2 text-sm font-medium ${
        darkMode
          ? "border-amber-900/40 bg-amber-950/30 text-amber-300"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      <Clock3 size={16} />

      <span>
        Consultation ends in {formattedTime}
      </span>
    </div>
  );
}