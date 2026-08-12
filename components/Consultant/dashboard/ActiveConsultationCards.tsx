"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ArrowRight, Clock3 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";

export default function ActiveConsultationCard() {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user ? { clerkId: user.id } : "skip"
  );

  const activeConsultation = useQuery(
    api.consultations.getActiveConsultation,
    consultant ? { consultantId: consultant._id } : "skip"
  );

  const cardClass = `rounded-2xl border p-6 transition ${
    darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-100"
  }`;
  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";
  const headingClass = darkMode ? "text-white" : "text-gray-900";

  if (consultant === undefined || activeConsultation === undefined) {
    return (
      <div className={`${cardClass} animate-pulse`}>
        <div className="h-16 rounded-xl bg-neutral-300 dark:bg-neutral-700" />
      </div>
    );
  }

  if (!activeConsultation) {
    return (
      <div className={cardClass}>
        <div className="flex items-center gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              darkMode ? "bg-neutral-800 text-neutral-400" : "bg-gray-100 text-gray-500"
            }`}
          >
            —
          </div>

          <div className="flex-1">
            <h3 className={`font-bold ${headingClass}`}>No Active Consultation</h3>
            <p className={`text-sm ${mutedClass}`}>
              You're currently available to receive consultation requests.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            darkMode ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-700"
          }`}
        >
          {activeConsultation.userName?.charAt(0) ?? "P"}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-bold ${headingClass}`}>{activeConsultation.userName}</h3>
          <p className={`text-sm ${mutedClass}`}>Active Consultation</p>

          <div className={`mt-1 flex items-center gap-1 text-xs ${mutedClass}`}>
            <Clock3 size={12} />
            Started {new Date(activeConsultation.createdAt).toLocaleString()}
            {" · "}
            <span className="font-medium text-green-600">In Progress</span>
          </div>
        </div>

        <Link
          href={`/consultant/chat/${activeConsultation._id}`}
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-800"
        >
          Continue
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}