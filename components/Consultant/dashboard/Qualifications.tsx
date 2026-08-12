"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Award, Plus } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";

export default function QualificationsCard() {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user ? { clerkId: user.id } : "skip"
  );

  const certificates = useQuery(
    api.certificates.getCertificates,
    consultant ? { consultantId: consultant._id } : "skip"
  );

  const headingClass = darkMode ? "text-white" : "text-gray-900";
  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";
  const itemClass = `rounded-2xl border p-4 flex items-center gap-3 transition ${
    darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-100"
  }`;

  if (consultant === undefined || certificates === undefined) {
    return (
      <div>
        <h2
          className={`text-xl font-bold pb-3 border-b ${headingClass} ${
            darkMode ? "border-neutral-800" : "border-gray-200"
          }`}
        >
          Certifications
        </h2>
        <div className={`${itemClass} mt-4 animate-pulse`}>
          <div className="h-10 w-10 rounded-xl bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-4 flex-1 rounded bg-neutral-300 dark:bg-neutral-700" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2
        className={`text-xl font-bold pb-3 border-b ${headingClass} ${
          darkMode ? "border-neutral-900" : "border-gray-200"
        }`}
      >
        Certifications
      </h2>

      <div className="mt-4 space-y-3">
        {certificates.length === 0 && (
          <p className={`text-sm ${mutedClass}`}>
            Certificates added from your profile will appear here.
          </p>
        )}

        {certificates.map((certificate) => (
          <div key={certificate._id} className={itemClass}>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                darkMode ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-700"
              }`}
            >
              <Award size={18} />
            </div>
            <div>
              <h4 className={`text-sm font-semibold ${headingClass}`}>{certificate.title}</h4>
              <p className={`text-xs ${mutedClass}`}>
                {certificate.institution},{" "}
                {new Date(certificate.awardedDate).getFullYear()}
              </p>
            </div>
          </div>
        ))}

        <Link
          href="/consultant/profile"
          className={`w-full rounded-2xl border border-dashed p-4 flex items-center justify-center gap-2 text-sm font-medium text-green-600 transition ${
            darkMode ? "border-neutral-700 hover:bg-neutral-800/40" : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Plus size={16} />
          Add New Credential
        </Link>
      </div>
    </div>
  );
}