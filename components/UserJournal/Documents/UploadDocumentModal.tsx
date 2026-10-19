"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import {
  Camera,
  FileText,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import { api } from "@/convex/_generated/api";

interface Props {
  darkMode: boolean;
  userId: string;
  onClose: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export default function UploadDocumentModal({
  darkMode,
  userId,
  onClose,
}: Props) {
  const createDocument = useMutation(
    api.careJournal.createDocument
  );

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        "Please upload a JPG, PNG, WEBP image, or PDF."
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum size is 10 MB.");
      return;
    }

    try {
      setIsUploading(true);

      // Upload file to Cloudinary
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "/api/care-journal/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Upload failed."
        );
      }

      // Save document record in Convex
      await createDocument({
        userId,
        title: file.name,
        fileUrl: result.url,
        storageProvider: "cloudinary",
        mimeType: result.mimeType,
      });

      onClose();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading."
      );
    } finally {
      setIsUploading(false);
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }

    // Allows selecting the same file again
    event.target.value = "";
  }

  const inputClass = `w-full rounded-xl border px-4 py-3 outline-none ${
    darkMode
      ? "border-neutral-700 bg-[#181818] text-white"
      : "border-gray-200 bg-white text-gray-900"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-2xl ${
          darkMode
            ? "bg-[#222224]"
            : "bg-white"
        }`}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-neutral-700">
          <div>
            <h2
              className={`text-xl font-bold ${
                darkMode
                  ? "text-white"
                  : "text-neutral-900"
              }`}
            >
              Add Test Result
            </h2>

            <p
              className={`mt-1 text-sm ${
                darkMode
                  ? "text-neutral-400"
                  : "text-gray-500"
              }`}
            >
              Upload a photo or PDF of your result.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className={`rounded-lg p-2 ${
              darkMode
                ? "text-neutral-400 hover:bg-neutral-800"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Hidden file inputs */}

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
        />

        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleInputChange}
        />

        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Options */}

        <div className="space-y-3 p-6">
          <button
            type="button"
            disabled={isUploading}
            onClick={() =>
              cameraInputRef.current?.click()
            }
            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
              darkMode
                ? "border-neutral-700 hover:bg-neutral-800"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="rounded-xl bg-green-100 p-3">
              <Camera
                size={22}
                className="text-green-700"
              />
            </div>

            <div>
              <p
                className={`font-semibold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Take a Photo
              </p>

              <p className="text-sm text-gray-500">
                Use your camera to photograph the result.
              </p>
            </div>
          </button>

          <button
            type="button"
            disabled={isUploading}
            onClick={() =>
              imageInputRef.current?.click()
            }
            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
              darkMode
                ? "border-neutral-700 hover:bg-neutral-800"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="rounded-xl bg-blue-100 p-3">
              <ImageIcon
                size={22}
                className="text-blue-700"
              />
            </div>

            <div>
              <p
                className={`font-semibold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Choose Image
              </p>

              <p className="text-sm text-gray-500">
                Select a JPG, PNG, or WEBP image.
              </p>
            </div>
          </button>

          <button
            type="button"
            disabled={isUploading}
            onClick={() =>
              pdfInputRef.current?.click()
            }
            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
              darkMode
                ? "border-neutral-700 hover:bg-neutral-800"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="rounded-xl bg-red-100 p-3">
              <FileText
                size={22}
                className="text-red-700"
              />
            </div>

            <div>
              <p
                className={`font-semibold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Choose PDF
              </p>

              <p className="text-sm text-gray-500">
                Upload a digital test result.
              </p>
            </div>
          </button>

          {/* Error */}

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Uploading */}

          {isUploading && (
            <div
              className={`flex items-center justify-center gap-2 rounded-xl p-4 text-sm ${
                darkMode
                  ? "bg-neutral-800 text-neutral-300"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <Loader2
                size={17}
                className="animate-spin"
              />
              Uploading test result...
            </div>
          )}

          <p className="pt-2 text-center text-xs text-gray-400">
            JPG, PNG, WEBP or PDF • Maximum 10 MB
          </p>
        </div>
      </div>
    </div>
  );
}