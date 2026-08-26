"use client";

import { Clock3, MoreVertical, CalendarDays, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useUIStateContext } from "@/components/UIStateContext";

interface ConsultationCardProps {
  consultation: {
    _id: Id<"consultations">;
    userId: string;
    userName: string;
    userEmail: string;
    consultantId: Id<"consultants">;
    slotId: Id<"availableSlots">;
    initialMessage: string;
    createdAt: number;
    updatedAt: number;
    status: "pending" | "active" | "completed";
  };
}

const STATUS_META = {
  pending: { label: "Pending", badgeClass: "bg-yellow-100 text-yellow-700", buttonLabel: "Accept Consultation" },
  active: { label: "Active", badgeClass: "bg-green-100 text-green-700", buttonLabel: "Open Chat" },
  completed: { label: "Completed", badgeClass: "bg-blue-100 text-blue-700", buttonLabel: "View Consultation" },
} as const;

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function ConsultationCard({ consultation }: ConsultationCardProps) {
  const { darkMode } = useUIStateContext();
  const router = useRouter();

  const acceptConsultation = useMutation(api.consultations.acceptConsultation);
  const slot = useQuery(api.availableSlots.getSlotById, { slotId: consultation.slotId });

  const isPending = consultation.status === "pending";
  const isActive = consultation.status === "active";
  const { label: statusLabel, badgeClass } = STATUS_META[consultation.status];

  const initials = consultation.userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";
  const headingClass = darkMode ? "text-white" : "text-gray-900";

  async function handleConsultation() {
    try {
      if (isPending) {
        await acceptConsultation({ consultationId: consultation._id });
      }
      router.push(`/consultant/chat/${consultation._id}`);
    } catch (error) {
      console.error("Failed to update consultation:", error);
    }
  }

  return (
    <div
      className={`rounded-2xl border px-5 py-5 shadow-sm transition ${
        darkMode ? "border-neutral-800 bg-[#1E1E1E]" : "border-gray-100 bg-white"
      }`}
    >
      {/* Top section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold ${
              isActive ? "bg-green-600 text-white" : darkMode ? "bg-neutral-700 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {initials}
          </div>

          {/* User information */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`font-semibold ${headingClass}`}>{consultation.userName}</h3>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${badgeClass}`}>
                {statusLabel}
              </span>
            </div>
            <p className={`text-sm ${mutedClass}`}>{consultation.userEmail}</p>
          </div>
        </div>

        <button type="button" aria-label="More options">
          <MoreVertical size={18} className={mutedClass} />
        </button>
      </div>

      {/* Appointment */}
      {slot && (
        <div className={`mt-5 rounded-xl p-4 ${darkMode ? "bg-[#181818]" : "bg-gray-50"}`}>
          <p className={`mb-3 text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Appointment</p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-green-700" />
              <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {formatDate(slot.startTime)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 size={16} className="text-green-700" />
              <span className={`text-sm ${darkMode ? "text-neutral-300" : "text-gray-600"}`}>
                {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Initial Message */}
      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2">
          <MessageSquare size={15} className="text-green-700" />
          <span className={`text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Initial Message</span>
        </div>

        <div
          className={`rounded-xl border p-4 ${
            darkMode ? "border-neutral-800 bg-[#181818]" : "border-gray-100 bg-gray-50"
          }`}
        >
          <p className={`text-sm leading-6 ${darkMode ? "text-neutral-300" : "text-gray-600"}`}>
            {consultation.initialMessage}
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleConsultation}
          className={
            isPending || isActive
              ? "rounded-full bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
              : `rounded-full border px-6 py-2.5 text-sm font-semibold ${
                  darkMode
                    ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`
          }
        >
          {STATUS_META[consultation.status].buttonLabel}
        </button>
      </div>
    </div>
  );
}