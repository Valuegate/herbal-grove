"use client";

import { useUIStateContext } from "@/components/UIStateContext";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { CalendarDays, Clock3, CheckCircle2 } from "lucide-react";

import ViewCareJournal from "../viewcarejournal/ViewCareJournal";
import Header from "./Header";
import Messages from "./Messages";
import Input from "./ChatInput";

interface Props {
  consultationId: string;
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function PageShell({ darkMode, children }: { darkMode: boolean; children: React.ReactNode }) {
  return (
    <div className={`h-dvh flex flex-col ${darkMode ? "bg-[#121212]" : "bg-[#F7F8FA]"}`}>{children}</div>
  );
}

function CenteredMessage({ darkMode, children }: { darkMode: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`h-dvh flex items-center justify-center ${
        darkMode ? "bg-[#121212] text-white" : "bg-[#F7F8FA] text-neutral-900"
      }`}
    >
      {children}
    </div>
  );
}

function StatusCard({
  darkMode,
  iconBg,
  iconColor,
  title,
  children,
}: {
  darkMode: boolean;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-5">
      <div
        className={`w-full max-w-lg rounded-2xl border p-8 text-center ${
          darkMode ? "border-neutral-700 bg-[#222224]" : "border-gray-200 bg-white shadow-sm"
        }`}
      >
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${iconBg}`}>
          <CheckCircle2 size={32} className={iconColor} />
        </div>

        <h1 className={`mt-5 text-2xl font-bold ${darkMode ? "text-white" : "text-neutral-900"}`}>
          {title}
        </h1>

        {children}
      </div>
    </main>
  );
}

export default function ConsultantToUser({ consultationId }: Props) {
  const { darkMode } = useUIStateContext();

  const data = useQuery(api.consultations.getConsultation, {
    consultationId: consultationId as Id<"consultations">,
  });

  // Move all hooks to the top, before any conditional returns
  const [showCareJournal, setShowCareJournal] = useState(false);

  if (data === undefined) {
    return <CenteredMessage darkMode={darkMode}>Loading consultation...</CenteredMessage>;
  }

  if (data === null) {
    return <CenteredMessage darkMode={darkMode}>Consultation not found.</CenteredMessage>;
  }

  const { consultant, consultation, slot } = data;

  if (!consultant) {
    return <CenteredMessage darkMode={darkMode}>Consultant not found.</CenteredMessage>;
  }
  const mutedClass = darkMode ? "text-neutral-300" : "text-gray-600";
  const headingClass = darkMode ? "text-white" : "text-neutral-900";

  // PENDING — user has booked, consultant hasn't accepted yet.
  if (consultation.status === "pending") {
    return (
      <PageShell darkMode={darkMode}>
        <Header consultation={consultation} user={{ name: consultation.userName }} />

        <StatusCard
          darkMode={darkMode}
          iconBg="bg-green-100"
          iconColor="text-green-700"
          title="Consultation Request Sent"
        >
          <p className={`mt-3 text-sm leading-6 ${mutedClass}`}>
            Your consultation request has been sent to <strong>{consultant.fullName}</strong>.
          </p>

          {slot && (
            <div
              className={`mt-6 rounded-xl border p-4 text-left ${
                darkMode ? "border-neutral-700 bg-[#181818]" : "border-gray-200 bg-gray-50"
              }`}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-green-700">
                Your Appointment
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CalendarDays size={18} className="text-green-700" />
                  <span className={`text-sm font-semibold ${headingClass}`}>
                    {new Date(slot.startTime).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 size={18} className="text-green-700" />
                  <span className={`text-sm font-semibold ${headingClass}`}>
                    {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className={`mt-5 rounded-xl p-4 text-left ${darkMode ? "bg-[#181818]" : "bg-gray-50"}`}>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Your Message</p>
            <p className={`mt-2 text-sm leading-6 ${mutedClass}`}>{consultation.initialMessage}</p>
          </div>

          <div
            className={`mt-6 rounded-xl px-4 py-3 text-sm ${
              darkMode ? "bg-green-950/30 text-green-300" : "bg-green-50 text-green-700"
            }`}
          >
            Waiting for the consultant to accept your request. You'll be able to chat once the
            consultation becomes active.
          </div>
        </StatusCard>
      </PageShell>
    );
  }

  // COMPLETED — the consultation has ended.
  if (consultation.status === "completed") {
    return (
      <PageShell darkMode={darkMode}>
        <Header
          consultation={consultation}
          user={{ name: consultation.userName }}
        />

        <Messages consultationId={consultation._id} />
      </PageShell>
    );
  }

  // ACTIVE — consultant has accepted; normal chat is available.
  return (
    <PageShell darkMode={darkMode}>
      <Header consultation={consultation} user={{ name: consultation.userName }} onOpenCareJournal={() => setShowCareJournal(true)} />

      {showCareJournal && (
        <ViewCareJournal
          consultationId={consultation._id}
          consultantId={consultant._id}
          darkMode={darkMode}
          onClose={() => setShowCareJournal(false)}
        />
      )}

      <Messages consultationId={consultation._id} />
      <Input consultationId={consultation._id} />
    </PageShell>
  );
}