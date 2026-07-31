"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";
import ConsultationCard from "./consultationCards";

interface Props {
  tab: "pending" | "active" | "completed";
}

export default function ConsultationQueue({ tab }: Props) {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user ? { clerkId: user.id } : "skip"
  );

  const consultations = useQuery(
    api.consultations.getConsultantConsultations,
    consultant
      ? { consultantId: consultant._id }
      : "skip"
  );

  const filteredConsultations = useMemo(() => {
    if (!consultations) return [];

    return consultations.filter(
      (consultation) => consultation.status === tab
    );
  }, [consultations, tab]);

  if (consultant === undefined || consultations === undefined) {
    return (
      <div className="py-10 text-center">
        Loading consultations...
      </div>
    );
  }

  if (consultant === null) {
    return (
      <div className="py-10 text-center">
        Consultant profile not found.
      </div>
    );
  }

  if (filteredConsultations.length === 0) {
    return (
      <div
        className={`rounded-xl p-10 text-center ${
          darkMode ? "bg-[#1E1E1E]" : "bg-white"
        }`}
      >
        No {tab} consultations.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredConsultations.map((consultation) => (
        <ConsultationCard
          key={consultation._id}
          darkMode={darkMode}
          consultation={consultation}
        />
      ))}
    </div>
  );
}