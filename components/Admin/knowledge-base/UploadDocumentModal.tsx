"use client";

import { useState } from "react";
import { X, Upload, FileText } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UploadDocumentModal({
  open,
  onClose,
}: Props) {
  const { darkMode } = useUIStateContext();

  const [files, setFiles] = useState<File[]>([]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-xl ${
          darkMode
            ? "bg-[#1E1E1E] text-white"
            : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            darkMode ? "border-neutral-800" : "border-gray-200"
          }`}
        >
          <div>
            <h2 className="text-xl font-bold">
              Upload Research Documents
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Select one or more PDF documents to add to the knowledge base.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <label
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer h-40 transition
              ${
                darkMode
                  ? "border-neutral-700 hover:border-green-500"
                  : "border-gray-300 hover:border-[#2b7a2d]"
              }`}
          >
            <Upload size={32} className="mb-3 text-[#2b7a2d]" />

            <p className="font-medium">
              Click to choose PDF files
            </p>

            <p className="text-sm text-gray-500 mt-1">
              You can upload multiple documents at once
            </p>

            <input
              hidden
              type="file"
              accept=".pdf"
              multiple
              onChange={(e) =>
                setFiles(Array.from(e.target.files ?? []))
              }
            />
          </label>

          {files.length > 0 && (
            <div className="mt-6 space-y-3 max-h-52 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                    darkMode
                      ? "border-neutral-700"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText
                      size={18}
                      className="text-[#2b7a2d] shrink-0"
                    />

                    <span className="truncate">
                      {file.name}
                    </span>
                  </div>

                  <span className="text-sm text-gray-500 shrink-0">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end gap-3 p-6 border-t ${
            darkMode ? "border-neutral-800" : "border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border"
          >
            Cancel
          </button>

          <button
            disabled={files.length === 0}
            className={`px-5 py-2 rounded-xl text-white transition ${
              files.length
                ? "bg-[#2b7a2d] hover:bg-[#236626]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Upload {files.length > 0 && `(${files.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}