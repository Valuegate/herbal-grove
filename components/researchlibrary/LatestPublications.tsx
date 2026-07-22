"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";

export default function LatestPublication() {
  const { darkMode } = useUIStateContext();

  const documents = useQuery(
    api.documents.getLatestDocuments,
    {
      limit: 5,
    }
  );

  if (!documents) return null;

  return (
    <section className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h2
          className={`text-2xl font-medium ${
            darkMode
              ? "text-white"
              : "text-black"
          }`}
        >
          Latest Publications
        </h2>

        <button
          className={`text-sm font-bold ${
            darkMode
              ? "text-white"
              : "text-black"
          }`}
        >
          View All
        </button>
      </div>

      <div
        className={`rounded-xl border ${
          darkMode
            ? "border-neutral-700 bg-[#222224]"
            : "bg-white"
        }`}
      >
        {documents.map((doc) => (
          <Link
            key={doc._id}
            href={`/researchlibrary/${doc._id}`}
            className="flex items-center justify-between border-b border-gray-200 px-6 py-5 last:border-none dark:border-neutral-700"
          >
            <div>
              <h3 className="font-semibold">
                {doc.title}
              </h3>

              <p className="text-sm text-gray-500">
                {new Date(
                  doc.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <span className="text-green-700 font-semibold">
              View →
            </span>
          </Link>
        ))}
      </div>
    </section>
);
}