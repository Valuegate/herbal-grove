"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type ConsultationHistoryCardProps = {
  consultationId: Id<"consultations">;
  consultantId?: Id<"consultants"> | null;
  initialMessage: string;
  createdAt: number;
};

export default function ConsultationHistoryCard({
  consultationId,
  consultantId,
  initialMessage,
  createdAt,
}: ConsultationHistoryCardProps) {
  const consultant = useQuery(
    api.consultants.getConsultantById,
    consultantId ? { consultantId } : "skip"
  );

  const date = new Date(createdAt);

  return (
    <div className="border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-gray-900">
          {consultant?.fullName ?? "Consultant"}
        </p>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {initialMessage}
        </p>
        
        <p className="text-sm text-gray-500 mt-1">
          {date.toLocaleDateString()}
        </p>

        <p className="text-sm text-gray-500">
          {date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>

        <span className="inline-block mt-3 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
          Completed
        </span>
      </div>

      <Link
        href={`/consultants/history/${consultationId}`}
        className="text-sm font-semibold text-[#1a7a1e] hover:underline whitespace-nowrap"
      >
        View Consultation →
      </Link>
    </div>
  );
}