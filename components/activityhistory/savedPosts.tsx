"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";

import { BookmarkIcon } from "@/components/ui/icons";
import { useUIStateContext } from "@/components/UIStateContext";

import { api } from "@/convex/_generated/api";

interface SavedPostsProps {
  searchQuery: string;
}

export default function SavedPosts({ searchQuery }: SavedPostsProps) {
  const { darkMode } = useUIStateContext();

  const savedDocuments = useQuery(api.saveDocuments.getSavedDocuments);
  const removeSavedDocument = useMutation(api.saveDocuments.removeSavedDocument);

  const query = searchQuery.trim().toLowerCase();
  const filteredDocuments =
    savedDocuments?.filter(
      (document) =>
        !query ||
        document.title.toLowerCase().includes(query) ||
        (document.summary ?? "").toLowerCase().includes(query)
    ) ?? [];

  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";
  const headingClass = darkMode ? "text-white" : "text-[#222224]";

  async function handleRemove(documentId: (typeof filteredDocuments)[number]["_id"]) {
    try {
      await removeSavedDocument({ documentId });
    } catch (error) {
      console.error("Failed to remove saved document:", error);
    }
  }

  if (savedDocuments === undefined) {
    return (
      <div className="py-12 text-center">
        <p className={mutedClass}>Loading saved research...</p>
      </div>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-12 px-6 text-center ${
          darkMode ? "bg-[#222224] border-neutral-800/80" : "bg-white border-gray-200/80"
        }`}
      >
        <div className="max-w-xs space-y-1">
          <h3 className={`text-xl font-bold ${headingClass}`}>
            {query ? "No Saved Research Found" : "No Saved Research Yet"}
          </h3>

          <p className={`text-sm ${mutedClass}`}>
            {query
              ? `We could not find any saved research matching "${searchQuery}". Try something else.`
              : "Save research papers you want to come back to and they will appear here."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <span className={`text-sm font-extrabold uppercase tracking-wider ${headingClass}`}>
          Saved Research ({filteredDocuments.length})
        </span>
      </div>

      <div className={`overflow-hidden ${darkMode ? "bg-[#222224]" : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.3)]"}`}>
        {filteredDocuments.map((document) => (
          <div
            key={document._id}
            className={`p-5 flex items-center justify-between gap-4 border-b last:border-b-0 transition-colors duration-150 ${
              darkMode ? "border-neutral-700 hover:bg-[#2b2b2b]" : "border-gray-200 hover:bg-gray-100"
            }`}
          >
            <Link href={`/researchlibrary/${document._id}`} className="flex min-w-0 items-center gap-4">
              {/* Thumbnail */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  darkMode ? "bg-neutral-800" : "bg-gray-100"
                }`}
              >
                <span className="text-lg">🌿</span>
              </div>

              {/* Title + Tag */}
              <div className="min-w-0 space-y-0.5">
                <h4
                  className={`text-sm font-semibold leading-snug line-clamp-1 md:line-clamp-none ${
                    darkMode ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {document.title}
                </h4>
                <span className={`block text-[11px] ${darkMode ? "text-neutral-400" : "text-gray-400"}`}>
                  Research Verified
                </span>
              </div>
            </Link>

            {/* Remove Bookmark */}
            <button
              type="button"
              onClick={() => handleRemove(document._id)}
              className="shrink-0 rounded-lg p-1.5 transition hover:scale-110 active:scale-95"
              aria-label={`Remove ${document.title} from saved research`}
            >
              <BookmarkIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}