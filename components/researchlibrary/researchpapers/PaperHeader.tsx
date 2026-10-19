"use client";

import Link from "next/link";
import { ArrowLeft, BadgeCheck, Clock3, Bookmark } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

interface Props {
  document: Doc<"documents">;
}

export default function PaperHeader({ document }: Props) {
  const isSaved = useQuery(api.saveDocuments.isDocumentSaved, { documentId: document._id });
  const saveDocument = useMutation(api.saveDocuments.saveDocument);
  const removeSavedDocument = useMutation(api.saveDocuments.removeSavedDocument);

  async function handleSave() {
    try {
      const mutate = isSaved ? removeSavedDocument : saveDocument;
      await mutate({ documentId: document._id });
    } catch (error) {
      console.error("Failed to update saved document:", error);
    }
  }

  const isApproved = document.verificationStatus === "approved";

  return (
    <div className="mb-10 border-b pb-8">
      <Link
        href="/researchlibrary"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#2B7A2D] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Research Library
      </Link>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold leading-tight">{document.title}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>Uploaded {new Date(document.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1">
              <BadgeCheck size={16} className="text-green-600" />
              {document.verificationStatus}
            </span>
            <span className="flex items-center gap-1">
              <Clock3 size={16} className="text-blue-500" />
              {document.ingestionStatus}
            </span>
          </div>
        </div>

        {isApproved && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved === undefined}
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
              isSaved
                ? "border-green-700 bg-green-700 text-white hover:bg-green-800"
                : "border-gray-200 bg-white text-gray-700 hover:border-green-600 hover:text-green-700"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Saved" : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}