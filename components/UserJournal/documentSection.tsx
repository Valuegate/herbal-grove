"use client";

import { useState } from "react";
import { Eye, FileText, Plus, Trash2 } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

import UploadDocumentModal from "./Documents/UploadDocumentModal";
import DocumentViewerModal from "./Documents/DocumentViewerModal";

type CareJournalDocument = {
  _id: Id<"careJournalDocuments">;
  title: string;
  fileUrl: string;
  mimeType: string;
  createdAt: number;
};

interface Props {
  documents: CareJournalDocument[];
  darkMode: boolean;
  userId: string;
}

export default function DocumentsSection({ documents, darkMode, userId }: Props) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<CareJournalDocument | null>(null);

  const deleteDocument = useMutation(api.careJournal.deleteDocument);

  const cardClass = `rounded-2xl border ${
    darkMode ? "border-neutral-700 bg-[#222224]" : "border-gray-200 bg-white shadow-sm"
  }`;
  const headingClass = darkMode ? "text-white" : "text-neutral-900";
  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";

  async function handleDelete(documentId: Id<"careJournalDocuments">) {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await deleteDocument({ documentId, userId });

      // If the deleted document is currently being viewed, close the viewer.
      if (viewingDocument?._id === documentId) {
        setViewingDocument(null);
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to delete document.");
    }
  }

  return (
    <>
      <section className={cardClass}>
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <div className="flex items-center gap-2">
              <FileText size={19} className="text-green-700" />
              <h2 className={`font-bold ${headingClass}`}>My Documents</h2>
            </div>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              Test results and other documents you choose to keep.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            <Plus size={17} />
            Add Test Result
          </button>
        </div>

        {/* Documents */}
        {documents.length === 0 ? (
          <div className="p-10 text-center">
            <p className={`text-sm ${mutedClass}`}>No documents uploaded yet.</p>
          </div>
        ) : (
          <div>
            {documents.map((document) => (
              <div key={document._id} className="flex items-center justify-between gap-4 border-b p-6 last:border-b-0">
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-semibold ${headingClass}`}>{document.title}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(document.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingDocument(document)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-green-700 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(document._id)}
                    className={`rounded-xl p-2 transition ${
                      darkMode ? "text-red-400 hover:bg-red-950/30" : "text-red-500 hover:bg-red-50"
                    }`}
                    aria-label="Delete document"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upload modal */}
      {showUploadModal && (
        <UploadDocumentModal darkMode={darkMode} userId={userId} onClose={() => setShowUploadModal(false)} />
      )}

      {/* Document viewer */}
      {viewingDocument && (
        <DocumentViewerModal
          document={viewingDocument}
          darkMode={darkMode}
          onClose={() => setViewingDocument(null)}
          onDelete={() => handleDelete(viewingDocument._id)}
        />
      )}
    </>
  );
}