"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";

import ResearchCard from "./ResearchCard";

interface Props {
  searchQuery: string;
}

export default function FeaturedResearch({ searchQuery }: Props) {
  const { darkMode } = useUIStateContext();
  const documents = useQuery(api.documents.getFeaturedDocuments, { limit: 4 });

  const headingClass = darkMode ? "text-white" : "text-black";
  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";
  const cardClass = `rounded-xl border ${
    darkMode ? "bg-[#222224] border-neutral-700" : "bg-white border-gray-200"
  }`;

  if (!documents) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  const q = searchQuery.trim().toLowerCase();
  const filtered = documents.filter(
    (doc) =>
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.originalFileName.toLowerCase().includes(q)
  );

  return (
    <>
      <div className="flex items-center justify-between py-6">
        <h2 className={`text-2xl font-bold ${headingClass}`}>Featured Research</h2>
        <Link
          href="/researchlibrary/all"
          className={`text-sm font-semibold hover:underline ${headingClass}`}
        >
          View All Papers →
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className={`${cardClass} py-16 text-center`}>No research papers found.</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {filtered.map((doc) => (
            <ResearchCard
              key={doc._id}
              document={doc}
            />
          ))}
        </div>
      )}
    </>
  );
}