"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

import ConsultationHistoryCard from "@/components/userConsultantHistory/HistoryCard";

export default function ConsultationHistoryPage() {
  const { user, isLoaded } = useUser();

  const consultations = useQuery(
    api.consultations.getUserConsultations,
    user ? { userId: user.id } : "skip"
  );

  if (!isLoaded || consultations === undefined) {
    return (
      <main className="min-h-screen bg-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-gray-500">
            Loading consultations...
          </p>
        </div>
      </main>
    );
  }

  const completedConsultations = consultations
    .filter((consultation) => consultation.status === "completed")
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <main className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/consultants"
            className="text-sm font-semibold text-[#1a7a1e] hover:underline"
          >
            ← Back to Consultants
          </Link>

          <div className="text-sm text-gray-400">
            Quick Search
          </div>
        </div>

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Consultation History
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View your completed consultations.
          </p>
        </div>

        {/* Consultation history */}
        <div className="space-y-4">
          {completedConsultations.length === 0 ? (
            <div className="border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-sm text-gray-500">
                You don't have any completed consultations yet.
              </p>
            </div>
          ) : (
            completedConsultations.map((consultation) => (
              <ConsultationHistoryCard
                key={consultation._id}
                consultationId={consultation._id}
                consultantId={consultation.consultantId}
                initialMessage={consultation.initialMessage}
                createdAt={consultation.createdAt}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}