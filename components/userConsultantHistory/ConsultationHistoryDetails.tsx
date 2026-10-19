"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import Messages from "@/components/userConsultantChat/Messages";
import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  params: Promise<{ id: string }>;
}

function PageShell({ darkMode, children }: { darkMode: boolean; children: React.ReactNode }) {
  return (
    <main className={`min-h-screen px-6 py-8 ${darkMode ? "bg-[#121212]" : "bg-white"}`}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </main>
  );
}

export default function ConsultationHistoryDetails({ params }: Props) {
  const { id } = use(params)
  const consultationId = id as Id<"consultations">
  const { darkMode } = useUIStateContext();
  const data = useQuery(api.consultations.getConsultation, { consultationId });

  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";
  const headingClass = darkMode ? "text-white" : "text-gray-900";
  const cardClass = `rounded-xl border p-6 ${
    darkMode ? "border-neutral-700 bg-[#222224]" : "border-gray-200 bg-white"
  }`;

  if (data === undefined) {
    return (
      <PageShell darkMode={darkMode}>
        <p className={`text-sm ${mutedClass}`}>Loading consultation...</p>
      </PageShell>
    );
  }

  if (data === null) {
    return (
      <PageShell darkMode={darkMode}>
        <p className={`text-sm ${mutedClass}`}>Consultation not found.</p>
      </PageShell>
    );
  }

  const { consultant, consultation, slot } = data;

  if (!consultant) {
    return (
      <PageShell darkMode={darkMode}>
        <p className={`text-sm ${mutedClass}`}>Consultant not found.</p>
      </PageShell>
    );
  }

  // Prefer the actual appointment time over the booking-creation timestamp.
  const date = new Date(slot?.startTime ?? consultation.createdAt);

  return (
    <PageShell darkMode={darkMode}>
      <div className="space-y-8">
        {/* Back */}
        <Link href="/consultants/history" className="text-sm font-semibold text-[#1a7a1e] hover:underline">
          ← Back to Consultation History
        </Link>

        {/* Consultation information */}
        <div className={cardClass}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className={`text-xl font-bold ${headingClass}`}>{consultant.fullName}</h1>
              <p className={`text-sm mt-1 ${mutedClass}`}>
                {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </p>
            </div>

            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                darkMode ? "bg-green-950/40 text-green-400" : "bg-green-50 text-green-700"
              }`}
            >
              Completed
            </span>
          </div>

          <div className={`mt-5 pt-5 border-t ${darkMode ? "border-neutral-800" : "border-gray-100"}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide ${mutedClass}`}>Initial Message</p>
            <p className={`text-sm mt-2 ${darkMode ? "text-neutral-300" : "text-gray-700"}`}>
              {consultation.initialMessage}
            </p>
          </div>
        </div>

        {/* Conversation */}
        <div>
          <h2 className={`text-lg font-bold mb-4 ${headingClass}`}>Conversation</h2>

          <div className={`rounded-xl overflow-hidden h-150 border ${darkMode ? "border-neutral-700" : "border-gray-200"}`}>
            <Messages consultationId={consultation._id} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}