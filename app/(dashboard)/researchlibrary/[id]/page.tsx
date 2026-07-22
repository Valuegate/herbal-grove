"use client";

import { use } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import PaperHeader from "@/components/researchlibrary/researchpapers/PaperHeader";
import PaperContent from "@/components/researchlibrary/researchpapers/PaperContent";
import PaperSidebar from "@/components/researchlibrary/researchpapers/PaperSidebar";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function ResearchPaperPage({
  params,
}: Props) {
  const { id } = use(params);

  const paper = useQuery(
    api.research.getResearchPaper,
    {
      documentId: id as Id<"documents">,
    }
  );

  if (paper === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-3/4 rounded-lg bg-gray-200" />

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
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold">
          Research paper not found
        </h2>

        <p className="mt-2 text-gray-500">
          The document may have been deleted or is no
          longer available.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <main className="min-w-0">
        <PaperHeader document={paper.document} />

        <PaperContent content={paper.document.fileUrl} />
      </main>

      <aside>
        <PaperSidebar
          document={paper.document}
          herbs={
            // filter out any nulls returned from the query to satisfy the prop type
            (paper.herbs ?? []).filter(
              (herb): herb is NonNullable<(typeof paper.herbs)[number]> => herb !== null
            )
          }
        />
      </aside>
    </div>
  );
}