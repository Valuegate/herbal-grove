"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";

import { BookmarkIcon } from "@/components/ui/icons";
import { useUIStateContext } from "@/components/UIStateContext";

import { api } from "@/convex/_generated/api";

const SparkleIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5Z" />
    <path d="M19 12L20.2 14.7L23 15.9L20.2 17.1L19 19.8L17.8 17.1L15 15.9L17.8 14.7Z" />
  </svg>
);

function SectionHeader({ label, darkMode }: { label: string; darkMode: boolean }) {
  const labelClass = darkMode ? "text-white" : "text-[#222224]";

  return (
    <div className="flex items-start justify-between px-1">
      <span className={`text-xs font-extrabold uppercase tracking-wider ${labelClass}`}>{label}</span>
      <Link href="/dashboard/history" className={`text-sm font-bold hover:underline ${labelClass}`}>
        View All
      </Link>
    </div>
  );
}

function StatusMessage({ text, darkMode }: { text: string; darkMode: boolean }) {
  return <div className={`p-5 text-sm ${darkMode ? "text-neutral-400" : "text-gray-500"}`}>{text}</div>;
}

export default function ActivityHistoryCard() {
  const { darkMode } = useUIStateContext();

  const savedDocuments = useQuery(api.saveDocuments.getSavedDocuments);
  const removeSavedDocument = useMutation(api.saveDocuments.removeSavedDocument);
  const chatHistory = useQuery(api.conversations.getRecentConversations, { limit: 2 });

  const recentSavedDocuments = savedDocuments?.slice(0, 2) ?? [];

  const listClass = `border overflow-hidden transition-all duration-300 divide-y ${
    darkMode
      ? "bg-[#222224] border-transparent divide-gray-200"
      : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] divide-gray-200"
  }`;
  const rowClass = `p-4 flex items-center justify-between gap-4 transition-colors duration-150 ${
    darkMode ? "hover:bg-[#2b2b2b]" : "hover:bg-gray-200"
  }`;
  const titleClass = `text-sm font-bold leading-snug line-clamp-1 md:line-clamp-none ${
    darkMode ? "text-white" : "text-neutral-900"
  }`;

  async function handleRemoveSavedDocument(documentId: (typeof recentSavedDocuments)[number]["_id"]) {
    try {
      await removeSavedDocument({ documentId });
    } catch (error) {
      console.error("Failed to remove saved document:", error);
    }
  }

  return (
    <section className="space-y-8">
      <h3 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-neutral-900"}`}>
        Activity History
      </h3>

      {/* Saved Research */}
      <div className="space-y-3">
        <SectionHeader label="My Saved Research" darkMode={darkMode} />

        <div className={listClass}>
          {savedDocuments === undefined && <StatusMessage text="Loading saved research..." darkMode={darkMode} />}

          {savedDocuments !== undefined && savedDocuments.length === 0 && (
            <StatusMessage text="You haven't saved any research papers yet." darkMode={darkMode} />
          )}

          {recentSavedDocuments.map((document) => (
            <div key={document._id} className={rowClass}>
              <Link href={`/researchlibrary/${document._id}`} className="flex min-w-0 items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-inner shrink-0 select-none ${
                    darkMode ? "bg-neutral-800" : "bg-gray-100"
                  }`}
                >
                  🌿
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h4 className={titleClass}>{document.title}</h4>
                  <span className={`block text-[11px] font-semibold ${darkMode ? "text-neutral-400" : "text-gray-400"}`}>
                    Research Verified
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => handleRemoveSavedDocument(document._id)}
                className="hover:scale-110 active:scale-95 transition p-1.5 rounded-lg shrink-0"
                aria-label="Remove bookmark"
              >
                <BookmarkIcon />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat History */}
      <div className="space-y-5 pt-7">
        <SectionHeader label="AI Diagnostic Chat History" darkMode={darkMode} />

        <div className={listClass}>
          {chatHistory === undefined && <StatusMessage text="Loading chat history..." darkMode={darkMode} />}

          {chatHistory !== undefined && chatHistory.length === 0 && (
            <StatusMessage text="No conversations yet." darkMode={darkMode} />
          )}

          {chatHistory?.map((chat) => (
            <Link key={chat._id} href={`/dashboard/chat?conversationId=${chat._id}`} className={rowClass}>
              <div className="flex items-center gap-4 min-w-0">
                <div className="shrink-0">
                  <SparkleIcon />
                </div>
                <h4 className={titleClass}>{chat.title}</h4>
              </div>

              <span className={`text-xs font-bold uppercase shrink-0 ${darkMode ? "text-neutral-400" : "text-gray-400"}`}>
                {new Date(chat.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}