"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  searchQuery: string;
}

export default function FeaturedResearch({
  searchQuery,
}: Props) {
  const { darkMode } = useUIStateContext();

  const documents = useQuery(api.documents.getFeaturedDocuments, { limit: 4});

  if (!documents) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }

  const filtered = documents.filter((doc) => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) return true;

    return (
      doc.title.toLowerCase().includes(q) ||
      doc.originalFileName
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <>
      <div className="flex items-center justify-between py-6">
        <h2
          className={`text-2xl font-bold ${
            darkMode
              ? "text-white"
              : "text-black"
          }`}
        >
          Featured Research
        </h2>

        <button
          className={`text-sm font-semibold ${
            darkMode
              ? "text-white"
              : "text-black"
          }`}
        >
          View All Papers
        </button>
      </div>

      {filtered.length === 0 ? (
        <div
          className={`rounded-xl border py-16 text-center ${
            darkMode
              ? "bg-[#222224] border-neutral-700"
              : "bg-white border-gray-200"
          }`}
        >
          No research papers found.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((doc) => (
            <div
              key={doc._id}
              className={`rounded-xl border p-6 ${
                darkMode
                  ? "bg-[#222224] border-neutral-700"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-3">
                  <FileText
                    className="text-green-700"
                    size={24}
                  />
                </div>

                <div>
                  <span className="rounded-full bg-green-700 px-2 py-1 text-[10px] font-bold uppercase text-white">
                    Research Verified
                  </span>
                </div>
              </div>

              <h3
                className={`mt-5 text-xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {doc.title}
              </h3>

              <p
                className={`mt-2 text-sm ${
                  darkMode
                    ? "text-neutral-400"
                    : "text-gray-500"
                }`}
              >
                {doc.originalFileName}
              </p>

              <p
                className={`mt-4 text-sm ${
                  darkMode
                    ? "text-neutral-400"
                    : "text-gray-500"
                }`}
              >
                Uploaded{" "}
                {new Date(
                  doc.createdAt
                ).toLocaleDateString()}
              </p>

              <div className="mt-6 flex justify-end">
                <Link
                  href={`/researchlibrary/${doc._id}`}
                  className="font-semibold text-green-700 hover:underline"
                >
                  View Paper →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}