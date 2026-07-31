"use client";

import { useUIStateContext } from "@/components/UIStateContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import Header from "./Header";
import Messages from "./Messages";
import Input from "./ChatInput";

interface Props {
  consultationId: string;
}

export default function ConsultantChat({
  consultationId,
}: Props) {
  const { darkMode } = useUIStateContext();

  const data = useQuery(
    api.consultations.getConsultation,
    {
      consultationId: consultationId as any,
    }
  );

  // Query is still loading
  if (data === undefined) {
    return (
      <div className="h-dvh flex items-center justify-center">
        Loading consultation...
      </div>
    );
  }

  // Consultation doesn't exist
  if (data === null) {
    return (
      <div className="h-dvh flex items-center justify-center">
        Consultation not found.
      </div>
    );
  }

  const { consultant, consultation } = data;

  // Consultant record no longer exists
  if (!consultant) {
    return (
      <div className="h-dvh flex items-center justify-center">
        Consultant not found.
      </div>
    );
  }

  return (
    <div
      className={`h-dvh flex flex-col ${
        darkMode ? "bg-[#121212]" : "bg-[#F7F8FA]"
      }`}
    >
      <Header consultant={consultant} />

      <Messages consultationId={consultation._id} />

      <Input consultationId={consultation._id} />
    </div>
  );
}