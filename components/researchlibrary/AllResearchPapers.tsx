"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import ResearchCard from "./ResearchCard";

interface Props {
  searchQuery: string;
}

export default function AllResearchPapers({
  searchQuery,
}: Props) {
  const documents = useQuery(
    api.documents.getDocuments
  );

  if (documents === undefined) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }

  const approved = documents.filter(
    (doc) =>
      doc.verificationStatus ===
      "approved"
  );

  const filtered = approved.filter(
    (doc) =>
      doc.title
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
  );

  if (filtered.length === 0) {
    return (
      <div className="py-20 text-center">
        No research papers found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filtered.map((doc) => (
        <ResearchCard
          key={doc._id}
          document={doc}
        />
      ))}
    </div>
  );
}