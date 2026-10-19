"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { FileText } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";

export default function ProfessionalBio() {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user ? { clerkId: user.id } : "skip"
  );

  const headingClass = darkMode ? "text-white" : "text-gray-900";
  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";
  const cardClass = `rounded-2xl border p-6 transition ${
    darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-100"
  }`;

  if (consultant === undefined) {
    return (
      <div>
        <h2 className={`text-xl font-bold pb-3 border-b ${headingClass} ${darkMode ? "border-neutral-800" : "border-gray-200"}`}>
          Professional Bio
        </h2>
        <div className={`${cardClass} mt-4 animate-pulse`}>
          <div className="h-40 rounded-xl bg-neutral-300 dark:bg-neutral-700" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className={`text-xl font-bold pb-3 border-b ${headingClass} ${darkMode ? "border-neutral-800" : "border-gray-200"}`}>
        Professional Bio
      </h2>

      <div className={`${cardClass} mt-4 h-64 overflow-y-auto`}>
        {consultant?.bio ? (
          <p className={`leading-7 whitespace-pre-wrap ${mutedClass}`}>{consultant.bio}</p>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <FileText size={36} className="mx-auto mb-3 text-green-600" />
            <h4 className={`font-semibold ${headingClass}`}>No Professional Bio</h4>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              Add a professional bio from your profile to introduce yourself to patients.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}