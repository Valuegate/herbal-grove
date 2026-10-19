"use client";

import { useQuery } from "convex/react";
import { FileImage, FileText, NotebookPen, X, Eye } from "lucide-react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import DocumentViewerModal from "./OpenuserDocumentModal";

interface Props {
  consultationId: Id<"consultations">;
  consultantId: Id<"consultants">;
  darkMode: boolean;
  onClose: () => void;
}

function PanelHeader({
  icon,
  title,
  borderClass,
  headingClass,
}: {
  icon: React.ReactNode;
  title: string;
  borderClass: string;
  headingClass: string;
}) {
  return (
    <div className={`flex items-center gap-2 border-b p-5 ${borderClass}`}>
      {icon}
      <h3 className={`font-bold ${headingClass}`}>{title}</h3>
    </div>
  );
}

function StatusText({ mutedClass, text }: { mutedClass: string; text: string }) {
  return <div className={`p-6 text-sm ${mutedClass}`}>{text}</div>;
}

export default function ViewCareJournal({ consultationId, consultantId, darkMode, onClose }: Props) {
  const [selectedDocument, setSelectedDocument] = useState<{
  _id: string;
  title: string;
  fileUrl: string;
  mimeType: string;
} | null>(null);
  const notes = useQuery(api.careJournal.getConsultantUserNotes, { consultationId, consultantId });
  const documents = useQuery(api.careJournal.getConsultantUserDocuments, { consultationId, consultantId });

  const headingClass = darkMode ? "text-white" : "text-gray-900";
  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";
  const borderClass = darkMode ? "border-neutral-700" : "border-gray-200";
  const cardClass = `rounded-2xl border ${darkMode ? "border-neutral-700 bg-[#222224]" : "border-gray-200 bg-white"}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className={`h-full w-full max-w-xl overflow-y-auto ${darkMode ? "bg-[#121212]" : "bg-[#F7F8FA]"}`}>
        {/* Header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between border-b px-6 py-5 ${
            darkMode ? "border-neutral-700 bg-[#121212]" : "border-gray-200 bg-[#F7F8FA]"
          }`}
        >
          <div>
            <h2 className={`text-xl font-bold ${headingClass}`}>Care Journal</h2>
            <p className={`mt-1 text-sm ${mutedClass}`}>Notes and documents shared by the user</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 ${darkMode ? "text-neutral-400 hover:bg-neutral-800" : "text-gray-500 hover:bg-gray-100"}`}
            aria-label="Close Care Journal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Notes */}
          <section className={cardClass}>
            <PanelHeader
              icon={<NotebookPen size={19} className="text-green-700" />}
              title="Notes"
              borderClass={borderClass}
              headingClass={headingClass}
            />

            {notes === undefined ? (
              <StatusText mutedClass={mutedClass} text="Loading notes..." />
            ) : notes.length === 0 ? (
              <StatusText mutedClass={mutedClass} text="No notes available." />
            ) : (
              <div>
                {notes.map((note) => (
                  <div key={note._id} className={`border-b p-5 last:border-b-0 ${borderClass}`}>
                    <h4 className={`font-semibold ${headingClass}`}>{note.title}</h4>
                    <p className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${mutedClass}`}>{note.content}</p>
                    <p className="mt-3 text-xs text-gray-400">
                      Updated {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Documents */}
          <section className={cardClass}>
            <PanelHeader
              icon={<FileText size={19} className="text-green-700" />}
              title="Test Results & Documents"
              borderClass={borderClass}
              headingClass={headingClass}
            />

            {documents === undefined ? (
              <StatusText mutedClass={mutedClass} text="Loading documents..." />
            ) : documents.length === 0 ? (
              <StatusText mutedClass={mutedClass} text="No documents uploaded." />
            ) : (
              <div>
                {documents.map((document) => {
                  const Icon = document.mimeType.startsWith("image/") ? FileImage : FileText;

                  return (
                    <div
                      key={document._id}
                      className={`flex items-center justify-between gap-4 border-b p-5 last:border-b-0 ${borderClass}`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Icon size={20} className="shrink-0 text-green-700" />

                        <div className="min-w-0">
                          <p className={`truncate text-sm font-semibold ${headingClass}`}>{document.title}</p>
                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(document.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedDocument(document)}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-green-700 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {selectedDocument && (
              <DocumentViewerModal
                document={selectedDocument}
                darkMode={darkMode}
                onClose={() => setSelectedDocument(null)}
              />
            )}
          </section>

          {/* Access notice */}
          <div className={`rounded-xl p-4 text-sm ${darkMode ? "bg-green-950/30 text-green-300" : "bg-green-50 text-green-700"}`}>
            This information is available to you only during this active consultation.
          </div>
        </div>
      </div>
    </div>
  );
}