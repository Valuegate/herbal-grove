"use client";

import { useState, useTransition } from "react";
import { X, Upload, FileText } from "lucide-react";

import { uploadDocument } from "@/lib/actions/uploadDocument";
import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function UploadDocumentModal({ open, onClose }: Props) {
  const { darkMode } = useUIStateContext();

  const [files, setFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  const borderClass = darkMode ? "border-neutral-800" : "border-gray-200";
  const hasFiles = files.length > 0;

  function handleUpload() {
    if (!files.length) return;

    startTransition(async () => {
      try {
        await uploadDocument(files);
        setFiles([]);
        onClose();
      } catch (error) {
        console.error(error);
        alert("Failed to upload documents.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className={`w-full max-w-xl rounded-2xl shadow-xl ${darkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-gray-900"}`}>
        {/* Header */}
        <div className={`flex items-center justify-between border-b p-6 ${borderClass}`}>
          <div>
            <h2 className="text-xl font-bold">Upload Research Documents</h2>
            <p className="mt-1 text-sm text-gray-500">
              Select one or more documents to add to the knowledge base.
            </p>
          </div>

          <button onClick={onClose} className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-neutral-800">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <label
            className={`flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${
              darkMode ? "border-neutral-700 hover:border-[#2B7A2D]" : "border-gray-300 hover:border-[#2B7A2D]"
            }`}
          >
            <Upload size={32} className="mb-3 text-[#2B7A2D]" />
            <p className="font-medium">Click to choose files</p>
            <p className="mt-1 text-sm text-gray-500">You can upload multiple documents at once</p>

            <input
              hidden
              type="file"
              accept=".pdf,.docx,.txt,.md"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
          </label>

          {hasFiles && (
            <div className="mt-6 max-h-56 space-y-3 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                    darkMode ? "border-neutral-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText size={18} className="shrink-0 text-[#2B7A2D]" />
                    <span className="truncate">{file.name}</span>
                  </div>

                  <span className="ml-4 shrink-0 text-sm text-gray-500">{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 border-t p-6 ${borderClass}`}>
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl border px-5 py-2 transition hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!hasFiles || isPending}
            className={`rounded-xl px-5 py-2 text-white transition ${
              hasFiles && !isPending ? "bg-[#2B7A2D] hover:bg-[#236626]" : "cursor-not-allowed bg-gray-400"
            }`}
          >
            {isPending ? "Uploading..." : `Upload${hasFiles ? ` (${files.length})` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}