"use client";

import {
  ExternalLink,
  FileText,
  X,
  Trash2
} from "lucide-react";

interface Props {
  document: {
    _id: string;
    title: string;
    fileUrl: string;
    mimeType: string;
  };
  darkMode: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DocumentViewerModal({
  document,
  darkMode,
  onClose,
  onDelete
}: Props) {
  const isImage = document.mimeType.startsWith("image/");
  const isPdf =
    document.mimeType === "application/pdf";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
      <div
        className={`relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl ${
          darkMode ? "bg-[#181818]" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex shrink-0 items-center justify-between border-b px-5 py-4 ${
            darkMode
              ? "border-neutral-700"
              : "border-gray-200"
          }`}
        >
          <h2
            className={`truncate font-semibold ${
              darkMode
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {document.title}
          </h2>

          <div className="flex items-center gap-2">
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-lg p-2 ${
                darkMode
                  ? "text-neutral-300 hover:bg-neutral-800"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              title="Open in new tab"
            >
              <ExternalLink size={19} />
            </a>

            <button
              type="button"
              onClick={onDelete}
              className={`rounded-lg p-2 ${
                darkMode
                  ? "text-red-400 hover:bg-red-950/30"
                  : "text-red-500 hover:bg-red-50"
              }`}
              title="Delete document"
            >
              <Trash2 size={19} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`rounded-lg p-2 ${
                darkMode
                  ? "text-neutral-300 hover:bg-neutral-800"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              aria-label="Close document"
            >
              <X size={20} />
            </button>

          </div>
        </div>

        {/* Document */}
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4">
          {isImage && (
            <img
              src={document.fileUrl}
              alt={document.title}
              className="max-h-full max-w-full object-contain"
            />
          )}

          {isPdf && (
            <iframe
              src={document.fileUrl}
              title={document.title}
              className="h-full w-full rounded-lg"
            />
          )}

          {!isImage && !isPdf && (
            <div className="text-center">
              <FileText
                size={40}
                className="mx-auto text-gray-400"
              />

              <p
                className={`mt-3 ${
                  darkMode
                    ? "text-neutral-300"
                    : "text-gray-600"
                }`}
              >
                This file type cannot be previewed.
              </p>

              <a
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Open Document
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}