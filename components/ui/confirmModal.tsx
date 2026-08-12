"use client";

import { X } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  const { darkMode } = useUIStateContext();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl ${
          darkMode
            ? "bg-[#1E1E1E] text-white"
            : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b p-6 ${
            darkMode
              ? "border-neutral-800"
              : "border-gray-200"
          }`}
        >
          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p
            className={`text-sm leading-6 ${
              darkMode
                ? "text-neutral-300"
                : "text-gray-600"
            }`}
          >
            {description}
          </p>
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end gap-3 border-t p-6 ${
            darkMode
              ? "border-neutral-800"
              : "border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            disabled={loading}
            className={`rounded-xl border px-5 py-2 transition ${
              darkMode
                ? "border-neutral-700 hover:bg-neutral-800"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cancelText}
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-xl px-5 py-2 font-medium text-white transition ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#2B7A2D] hover:bg-[#236626]"
            } ${
              loading
                ? "cursor-not-allowed opacity-60"
                : ""
            }`}
          >
            {loading
              ? "Please wait..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}