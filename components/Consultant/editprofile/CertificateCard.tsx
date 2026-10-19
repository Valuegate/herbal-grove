"use client";

import { Award, Pencil, Trash2 } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { useUIStateContext } from "@/components/UIStateContext";

interface CertificateCardProps {
  certificate: {
    _id: Id<"certificates">;
    title: string;
    institution: string;
    awardedDate: string;
  };

  onEdit: () => void;
  onDelete: () => void;
}

export default function CertificateCard({
  certificate,
  onEdit,
  onDelete,
}: CertificateCardProps) {
  const { darkMode } = useUIStateContext();

  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        darkMode
          ? "border-neutral-800 bg-neutral-900"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              darkMode
                ? "bg-green-500/10 text-green-400"
                : "bg-green-50 text-green-700"
            }`}
          >
            <Award size={22} />
          </div>

          <div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {certificate.title}
            </h3>

            <p
              className={`mt-1 ${
                darkMode
                  ? "text-neutral-400"
                  : "text-gray-600"
              }`}
            >
              {certificate.institution}
            </p>

            <p
              className={`mt-2 text-sm ${
                darkMode
                  ? "text-neutral-500"
                  : "text-gray-500"
              }`}
            >
              Awarded{" "}
              {new Date(
                certificate.awardedDate
              ).toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className={`rounded-lg p-2 transition ${
              darkMode
                ? "hover:bg-neutral-800"
                : "hover:bg-gray-100"
            }`}
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}