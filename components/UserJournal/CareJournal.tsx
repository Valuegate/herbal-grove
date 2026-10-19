"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";

import CareJournalHeader from "@/components/UserJournal/journalHeader";
import NotesSection from "@/components/UserJournal/noteSection";
import DocumentsSection from "@/components/UserJournal/documentSection";
import ConsultationHistory from "@/components/UserJournal/consultationHistory";

export default function CareJournal() {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const userId = user?.id;

  const notes = useQuery(
    api.careJournal.getUserNotes,
    userId ? { userId } : "skip"
  );

  const documents = useQuery(
    api.careJournal.getUserDocuments,
    userId ? { userId } : "skip"
  );

  const consultations = useQuery(
    api.consultations.getUserConsultations,
    userId ? { userId } : "skip"
  );

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Please sign in to view your Care Journal.
      </div>
    );
  }

  if (
    notes === undefined ||
    documents === undefined ||
    consultations === undefined
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Loading your Care Journal...
      </div>
    );
  }

  return (
    <main className="space-y-8">
      <CareJournalHeader darkMode={darkMode} />

      <NotesSection
        notes={notes}
        userId={user.id}
        darkMode={darkMode}
      />

      <DocumentsSection
        documents={documents}
        darkMode={darkMode}
        userId={user.id}
      />

      <ConsultationHistory
        consultations={consultations}
        darkMode={darkMode}
      />
    </main>
  );
}