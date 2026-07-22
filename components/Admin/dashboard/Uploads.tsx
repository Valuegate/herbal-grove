"use client";

import { useQuery } from "convex/react";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import { api } from "@/convex/_generated/api";

interface Props {
  darkMode: boolean;
}

export default function Uploads({
  darkMode,
}: Props) {
  const uploads = useQuery(
    api.documents.getRecentDocuments,
    { limit: 3 }
  );

  if (!uploads) {
    return (
      <div
        className={`rounded-2xl border p-6 ${
          darkMode
            ? "bg-[#1E1E1E] border-neutral-800"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-6 ${
        darkMode
          ? "bg-[#1E1E1E] border-neutral-800"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <h2 className="mb-6 text-lg font-semibold">
        Recent Uploads
      </h2>

      <div className="space-y-5">
        {uploads.map((upload) => (
          <div
            key={upload._id}
            className="flex items-center justify-between"
          >
            <span className="truncate">
              {upload.originalFileName}
            </span>

            <span
              className={`flex items-center gap-2 text-sm ${
                upload.ingestionStatus === "indexed"
                  ? "text-green-500"
                  : upload.ingestionStatus === "failed"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {upload.ingestionStatus === "indexed" ? (
                <CheckCircle2 size={18} />
              ) : upload.ingestionStatus ===
                "failed" ? (
                <XCircle size={18} />
              ) : (
                <Clock3 size={18} />
              )}

              {upload.ingestionStatus}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}