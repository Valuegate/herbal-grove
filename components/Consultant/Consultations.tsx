"use client";

import { useState } from "react";
import ConsultationQueue from "../Consultant/consultations/queue";
import { useUIStateContext } from "@/components/UIStateContext";

export default function ConsultationsPage() {
  const { darkMode } = useUIStateContext();

  const [tab, setTab] = useState<
    "pending" | "active" | "completed"
  >("pending");

  return (
    <div className="space-y-8">
      <div>
        <h1
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-[#2b7a2d]"
          }`}
        >
          Consultation Queue
        </h1>

        <p
          className={`mt-2 ${
            darkMode ? "text-neutral-400" : "text-gray-500"
          }`}
        >
          Manage your consultation requests.
        </p>
      </div>

      <div
        className={`inline-flex rounded-xl p-1 ${
          darkMode ? "bg-neutral-800" : "bg-gray-100"
        }`}
      >
        <button
          onClick={() => setTab("pending")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            tab === "pending"
              ? darkMode
                ? "bg-neutral-700 text-white"
                : "bg-white text-[#2b7a2d] shadow"
              : darkMode
              ? "text-neutral-300 hover:text-white"
              : "text-gray-600 hover:text-[#2b7a2d]"
          }`}
        >
          All Pending
        </button>

        <button
          onClick={() => setTab("active")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            tab === "active"
              ? darkMode
                ? "bg-neutral-700 text-white"
                : "bg-white text-[#2b7a2d] shadow"
              : darkMode
              ? "text-neutral-300 hover:text-white"
              : "text-gray-600 hover:text-[#2b7a2d]"
          }`}
        >
          Active Only
        </button>

        <button
          onClick={() => setTab("completed")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            tab === "completed"
              ? darkMode
                ? "bg-neutral-700 text-white"
                : "bg-white text-[#2b7a2d] shadow"
              : darkMode
              ? "text-neutral-300 hover:text-white"
              : "text-gray-600 hover:text-[#2b7a2d]"
          }`}
        >
          Completed
        </button>
      </div>

      <ConsultationQueue tab={tab} />
    </div>
  );
}