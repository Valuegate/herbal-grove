"use client";

import { useState } from "react";
import { ChevronLeft, BookOpen, ShieldAlert } from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  consultant: {
    fullName: string;
    imageUrl?: string;
  };
  journalShared: boolean;
  consultationId: Id<"consultations">;
}
export default function Header({consultant, journalShared, consultationId}: Props) {
  const router = useRouter();
  const { darkMode } = useUIStateContext();

  const [showShareWarning, setShowShareWarning] = useState(false);
  const shareJournal = useMutation(api.consultations.shareJournal);

  return (
    <header
      className={`sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b ${
        darkMode
          ? "bg-[#1E1E1E] border-neutral-800"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className={darkMode ? "text-white" : "text-gray-900"}
        >
          <ChevronLeft size={24} />
        </button>

        <Image
          src={ consultant.imageUrl ?? "/default-avatar.png" }
          alt={consultant.fullName}
          width={45}
          height={45}
          className="rounded-full"
        />

        <div>
          <h2 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {consultant.fullName}
          </h2>

        </div>
      </div>

      <div className="flex items-center gap-3">
        {!journalShared && (
          <button
            type="button"
            onClick={() => setShowShareWarning(true)}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
              darkMode
                ? "bg-green-950/40 text-green-400 hover:bg-green-950/60"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            <BookOpen size={17} />
            <span>Share Journal</span>
          </button>
        )}
      </div>

      {showShareWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div
            className={`w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:p-6 shadow-xl ${
              darkMode ? "bg-[#1E1E1E]" : "bg-white"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  darkMode
                    ? "bg-amber-950/40 text-amber-400"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                <ShieldAlert size={22} />
              </div>

              <div>
                <h3
                  className={`text-lg font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Share Care Journal?
                </h3>

                <p
                  className={`mt-2 text-sm leading-6 ${
                    darkMode ? "text-neutral-300" : "text-gray-600"
                  }`}
                >
                  Your Care Journal may contain sensitive and personal information.
                  Sharing it will allow your consultant to view your journal during
                  this consultation.
                </p>
              </div>
            </div>

            <div
              className={`mt-5 rounded-xl p-4 text-sm ${
                darkMode
                  ? "bg-neutral-800/70 text-neutral-300"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <p className="font-semibold">Before you continue</p>

              <p className="mt-1">
                Only share your journal if you're comfortable with your consultant
                having access to this information.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowShareWarning(false)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                  darkMode
                    ? "border-neutral-600 text-neutral-200 hover:bg-neutral-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                No, Keep Private
              </button>

              <button
                type="button"
                onClick={async () => {
                  await shareJournal({ consultationId });
                  setShowShareWarning(false);
                }}
                className="rounded-lg bg-[#1a7a1e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#156518]"
              >
                Yes, Share Journal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}