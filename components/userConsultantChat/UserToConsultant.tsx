"use client";

import { useUIStateContext } from "@/components/UIStateContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useConsultationCountdown } from "@/hooks/useConsultationCountdown";
import { useConsultationPresence } from "@/hooks/useConsultationPresence";

import ConsultationCountdown from "../Consultant/ConsultantCountdown";

import Header from "./Header";
import Messages from "./Messages";
import Input from "./ChatInput";

interface Props {
  consultationId: string;
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

function FooterNotice({ darkMode, children }: { darkMode: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`border-t px-4 py-4 text-center text-sm ${
        darkMode ? "border-neutral-800 bg-[#1E1E1E] text-neutral-400" : "border-gray-200 bg-white text-gray-500"
      }`}
    >
      {children}
    </div>
  );
}

export default function UserToConsultant({ consultationId }: Props) {
  const { darkMode } = useUIStateContext();

  const data = useQuery(api.consultations.getConsultation, {
    consultationId: consultationId as Id<"consultations">,
  });

  const consultationForPresence = data?.consultation?._id;
  const isActive = data?.consultation?.status === "active";

  // Track whether the user is currently viewing an active consultation.
  useConsultationPresence(consultationForPresence, isActive);

  // Track the consultation end time.
  const { remainingSeconds, showCountdown, hasEnded } = useConsultationCountdown({
    consultationId: consultationForPresence,
    endTime: data?.slot?.endTime,
    isActive,
  });

  if (data === undefined) {
    return <CenteredMessage darkMode={darkMode}>Loading consultation...</CenteredMessage>;
  }

  if (data === null) {
    return <CenteredMessage darkMode={darkMode}>Consultation not found.</CenteredMessage>;
  }

  const { consultant, consultation } = data;

  if (!consultant) {
    return <CenteredMessage darkMode={darkMode}>Consultant not found.</CenteredMessage>;
  }

  const journalShared = consultation.journalShared === true;
  const consultationEnded = hasEnded || consultation.status === "completed";

  return (
    <div className={`h-full min-h-0 flex flex-col ${darkMode ? "bg-[#121212]" : "bg-[#F7F8FA]"}`}>
      <Header consultant={consultant} journalShared={journalShared} consultationId={consultation._id} />

      {/* Show only during the final five minutes */}
      {showCountdown && <ConsultationCountdown remainingSeconds={remainingSeconds} />}

      <Messages consultationId={consultation._id} />

      {/* Messaging is only available while the consultation is active */}
      {consultationEnded ? (
        <FooterNotice darkMode={darkMode}>This consultation has ended.</FooterNotice>
      ) : consultation.status === "active" ? (
        <Input consultationId={consultation._id} />
      ) : consultation.status === "pending" ? (
        <FooterNotice darkMode={darkMode}>Waiting for the consultant to accept this consultation.</FooterNotice>
      ) : (
        <FooterNotice darkMode={darkMode}>This consultation is no longer available.</FooterNotice>
      )}
    </div>
  );
}