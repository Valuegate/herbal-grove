"use client";

import { use } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import PaperHeader from "@/components/researchlibrary/researchpapers/PaperHeader";
import PaperContent from "@/components/researchlibrary/researchpapers/PaperContent";
import PaperSidebar from "@/components/researchlibrary/researchpapers/PaperSidebar";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ResearchPaperPage({ params }: Props) {
  const { id } = use(params);

  const paper = useQuery(api.research.getResearchPaper, {
    documentId: id as Id<"documents">,
  });

  if (paper === undefined) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-6 py-10">
        <div className="space-y-6">
          <div className="h-12 w-72 rounded bg-gray-200" />

          <div className="flex gap-3">
            <div className="h-6 w-24 rounded-full bg-gray-200" />
            <div className="h-6 w-24 rounded-full bg-gray-200" />
            <div className="h-6 w-32 rounded-full bg-gray-200" />
          </div>

          <div className="h-125 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (paper === null) {
    return (
      <div className="mx-auto max-w-2xl py-24 text-center">
        <h2 className="text-3xl font-bold">Research paper not found</h2>
        <p className="mt-2 text-gray-500">
          The document may have been deleted or is no longer available.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-6 py-10 lg:grid-cols-[1fr_320px]">
      <main>
        <PaperHeader document={paper.document} />
        {/* Renders the original document text saved during ingestion,
            not the overlapping RAG chunks used for retrieval. */}
        <PaperContent content={paper.document.content ?? ""} />
      </main>

      <aside>
        <PaperSidebar
          document={paper.document}
          herbs={(paper.herbs ?? []).filter(
            (herb): herb is NonNullable<(typeof paper.herbs)[number]> => herb !== null
          )}
        />
      </aside>
    </div>
  );
}