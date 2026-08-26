"use client";

import Image from "next/image";
import Link from "next/link";
import { useUIStateContext } from "@/components/UIStateContext";
import { UserRound } from "lucide-react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { useUser } from "@clerk/nextjs";

const TAGS = ["Evidence Based", "Herbal Wellness"];

const HISTORY_STATUS_STYLES: Record<
  Doc<"consultations">["status"],
  { label: string; className: (darkMode: boolean) => string }
> = {
  pending: {
    label: "Pending",
    className: (darkMode) => (darkMode ? "bg-amber-950/40 text-amber-400" : "bg-amber-50 text-amber-700"),
  },
  active: {
    label: "Active",
    className: (darkMode) => (darkMode ? "bg-green-950/40 text-green-400" : "bg-green-50 text-green-700"),
  },
  completed: {
    label: "Completed",
    className: (darkMode) => (darkMode ? "bg-neutral-800 text-neutral-400" : "bg-gray-100 text-gray-500"),
  },
};

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function Tag({ label, darkMode }: { label: string; darkMode: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-medium ${
        darkMode ? "bg-[#2f2f31] text-neutral-300" : "bg-gray-50 text-gray-500"
      }`}
    >
      {label}
    </span>
  );
}

function StatusMessage({ darkMode, text }: { darkMode: boolean; text: string }) {
  return (
    <div className="px-5 py-8 text-center">
      <p className={`text-sm ${darkMode ? "text-neutral-400" : "text-gray-500"}`}>{text}</p>
    </div>
  );
}

function PendingConsultation({
  consultation,
  darkMode,
}: {
  consultation: Doc<"consultations">;
  darkMode: boolean;
}) {
  const consultant = useQuery(api.consultants.getConsultantById, {
    consultantId: consultation.consultantId,
  });

  const slot = useQuery(api.availableSlots.getSlotById, {
    slotId: consultation.slotId,
  });

  if (!consultant || !slot) {
    return (
      <div className="px-5 py-5">
        <p className="text-sm text-gray-500">Loading consultation...</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-4 px-5 py-5 transition-colors ${
        darkMode ? "hover:bg-[#2b2b2b]" : "hover:bg-gray-50"
      }`}
    >
      {/* Consultant */}
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
          <Image
            src={consultant.imageUrl || "/default-avatar.png"}
            alt={consultant.fullName}
            width={50}
            height={50}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h4 className={`text-sm font-bold ${darkMode ? "text-white" : "text-neutral-900"}`}>
            {consultant.fullName}
          </h4>
          <p className={`text-xs ${darkMode ? "text-neutral-400" : "text-gray-500"}`}>
            {consultant.specialization || "Herbal Wellness Consultant"}
          </p>
        </div>
      </div>

      {/* Appointment */}
      <div className={`rounded-xl p-4 ${darkMode ? "bg-[#181818]" : "bg-gray-50"}`}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">
          Requested Appointment
        </p>
        <p className={`mt-2 text-sm font-semibold ${darkMode ? "text-white" : "text-neutral-900"}`}>
          {new Date(slot.startTime).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className={`mt-1 text-xs ${darkMode ? "text-neutral-400" : "text-gray-500"}`}>
          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-amber-600">● Waiting for consultant</span>
        <button
          disabled
          className={`cursor-not-allowed rounded-full px-4 py-2 text-xs font-bold ${
            darkMode ? "bg-neutral-700 text-neutral-500" : "bg-gray-100 text-gray-400"
          }`}
        >
          Waiting for Acceptance
        </button>
      </div>
    </div>
  );
}

function ConsultationHistoryItem({
  consultation,
  darkMode,
}: {
  consultation: Doc<"consultations">;
  darkMode: boolean;
}) {
  const consultant = useQuery(api.consultants.getConsultantById, {
    consultantId: consultation.consultantId,
  });

  const slot = useQuery(api.availableSlots.getSlotById, {
    slotId: consultation.slotId,
  });

  if (!consultant || !slot) {
    return (
      <div className="px-5 py-5">
        <p className="text-sm text-gray-500">Loading consultation...</p>
      </div>
    );
  }

  const status = HISTORY_STATUS_STYLES[consultation.status];

  return (
    <div
      className={`flex flex-col gap-4 px-5 py-5 transition-colors ${
        darkMode ? "hover:bg-[#2b2b2b]" : "hover:bg-gray-50"
      }`}
    >
      {/* Consultant */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            <Image
              src={consultant.imageUrl || "/default-avatar.png"}
              alt={consultant.fullName}
              width={50}
              height={50}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h4 className={`text-sm font-bold ${darkMode ? "text-white" : "text-neutral-900"}`}>
              {consultant.fullName}
            </h4>
            <p className={`text-xs ${darkMode ? "text-neutral-400" : "text-gray-500"}`}>
              {consultant.specialization || "Herbal Wellness Consultant"}
            </p>
          </div>
        </div>

        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${status.className(darkMode)}`}>
          {status.label}
        </span>
      </div>

      {/* Appointment */}
      <div>
        <p className={`text-sm font-semibold ${darkMode ? "text-neutral-200" : "text-neutral-800"}`}>
          {new Date(slot.startTime).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className={`mt-1 text-xs ${darkMode ? "text-neutral-400" : "text-gray-500"}`}>
          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
        </p>
      </div>

      {/* Action */}
      {consultation.status === "pending" && (
        <div
          className={`rounded-lg px-3 py-2 text-xs ${
            darkMode ? "bg-amber-950/20 text-amber-400" : "bg-amber-50 text-amber-700"
          }`}
        >
          Waiting for the consultant to accept your request.
        </div>
      )}

      {consultation.status === "active" && (
        <Link
          href={`/consultantchat/${consultation._id}`}
          className="rounded-full bg-green-700 px-4 py-2 text-center text-xs font-bold text-white transition hover:bg-green-800"
        >
          Open Chat
        </Link>
      )}

      {consultation.status === "completed" && (
        <div className={`text-xs ${darkMode ? "text-neutral-500" : "text-gray-400"}`}>
          Consultation completed
        </div>
      )}
    </div>
  );
}

export default function ChatConsultant() {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const consultants = useQuery(api.consultants.getAllConsultants);
  const consultations = useQuery(
    api.consultations.getUserConsultations,
    user ? { userId: user.id } : "skip"
  );

  const pendingConsultations =
    consultations?.filter((consultation) => consultation.status === "pending") ?? [];

  const recentConsultations = consultations
    ? [...consultations].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3)
    : [];

  const headingClass = darkMode ? "text-white" : "text-black";
  const mutedClass = darkMode ? "text-neutral-300" : "text-neutral-700";
  const listClass = `overflow-hidden border transition-all duration-300 ${
    darkMode
      ? "border-transparent bg-[#222224] divide-y divide-neutral-700"
      : "border-gray-200 bg-white divide-y divide-gray-200 shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
  }`;

  if (!consultants) {
    return <p className={`px-4 ${headingClass}`}>Loading.....</p>;
  }

  return (
    <section className="px-4">
      {/* Header */}
      <div
        className={`mx-auto flex min-h-28.75 max-w-6xl flex-col items-center justify-center rounded-xl px-6 py-8 text-center transition-colors ${
          darkMode ? "bg-[#222224] text-white" : "bg-white text-black"
        }`}
      >
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-[#f7f7f7] px-3 py-1 text-[10px] font-medium text-slate-800">
          <UserRound className="h-3.5 w-3.5" />
          Consultant
        </div>

        <h1 className={`text-2xl font-bold leading-tight sm:text-[28px] ${headingClass}`}>
          Talk to a herbal expert
        </h1>

        <p className={`mt-1 max-w-md text-sm leading-5 ${darkMode ? "text-neutral-300" : "text-slate-500"}`}>
          Choose a verified consultant and book
          <br className="hidden sm:block" />
          a consultation at a convenient time.
        </p>
      </div>

      {/* Consultants */}
      <div className="space-y-4 py-4">
        <div className="flex items-center justify-between px-1">
          <span className={`text-sm font-medium ${darkMode ? "text-neutral-300" : "text-neutral-600"}`}>
            {consultants.length} Consultants available
          </span>
        </div>

        {/* Consultant Cards */}
        <div className="space-y-4">
          {consultants.map((consultant) => (
            <div
              key={consultant._id}
              className={`flex flex-col items-start justify-between gap-4 rounded-xl border px-5 py-7 transition-all duration-200 sm:flex-row sm:gap-6 ${
                darkMode
                  ? "border-transparent bg-[#222224]"
                  : "border-gray-200 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.1)]"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-lg shadow-inner select-none">
                  <Image
                    src={consultant.imageUrl || "/default-avatar.png"}
                    alt={consultant.fullName}
                    width={50}
                    height={50}
                  />
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div>
                    <h4 className={`text-base font-bold leading-tight ${headingClass}`}>
                      {consultant.fullName}
                    </h4>
                    <p className={`mt-1 text-sm ${mutedClass}`}>
                      {consultant.specialization || "Herbal Wellness Consultant"}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    {TAGS.map((tag) => (
                      <Tag key={tag} label={tag} darkMode={darkMode} />
                    ))}
                  </div>

                  {/* Bio */}
                  <p className={`max-w-xl text-sm ${mutedClass}`}>
                    {consultant.bio
                      ? truncate(consultant.bio, 100)
                      : "Professional herbal wellness guidance."}
                  </p>

                  {/* Online status */}
                  <span
                    className={`text-xs font-semibold ${
                      consultant.isOnline ? "text-green-600" : darkMode ? "text-neutral-500" : "text-gray-400"
                    }`}
                  >
                    ● {consultant.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <Link
                href={`/consultants/${consultant._id}`}
                className="w-full rounded-full bg-green-700 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-green-800 sm:w-auto"
              >
                Book Consult
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Consultations */}
      <div className="space-y-4 pt-14">
        <div className="flex items-center justify-between px-1">
          <span className={`text-xs font-medium uppercase tracking-wide ${headingClass}`}>
            Pending Consultations
          </span>
          <Link
            href="/dashboard/history"
            className={`text-sm font-bold underline ${darkMode ? "text-white" : "text-green-700"}`}
          >
            View All
          </Link>
        </div>

        <div className={listClass}>
          {consultations === undefined ? (
            <StatusMessage darkMode={darkMode} text="Loading consultations..." />
          ) : pendingConsultations.length === 0 ? (
            <StatusMessage darkMode={darkMode} text="You have no pending consultations." />
          ) : (
            pendingConsultations.map((consultation) => (
              <PendingConsultation key={consultation._id} consultation={consultation} darkMode={darkMode} />
            ))
          )}
        </div>
      </div>

      {/* Consultation History */}
      <div className="space-y-4 pt-14">
        <div className="flex items-center justify-between px-1">
          <span className={`text-xs font-medium uppercase tracking-wide ${headingClass}`}>
            Consultation History
          </span>
          <Link
            href="/consultants/history"
            className={`text-sm font-bold underline ${darkMode ? "text-white" : "text-green-700"}`}
          >
            View All
          </Link>
        </div>

        <div className={listClass}>
          {consultations === undefined ? (
            <StatusMessage darkMode={darkMode} text="Loading consultations..." />
          ) : consultations.length === 0 ? (
            <StatusMessage darkMode={darkMode} text="You haven't booked a consultation yet." />
          ) : (
            recentConsultations.map((consultation) => (
              <ConsultationHistoryItem key={consultation._id} consultation={consultation} darkMode={darkMode} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}