"use client";

import { useEffect, useState } from "react";
import { useUIStateContext } from "@/components/UIStateContext";

type CredentialsModalProps = {
  open: boolean;
  onClose: () => void;
  email: string;
  password: string;
};

export default function CredentialsModal({
  open,
  onClose,
  email,
  password,
}: CredentialsModalProps) {
  const { darkMode } = useUIStateContext();
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!open) setCopied("");
  }, [open]);

  if (!open) return null;

  const cx = (dark: string, light: string) => (darkMode ? dark : light);

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(`${label} copied successfully!`);
    } catch {
      setCopied("Failed to copy.");
    }
    setTimeout(() => setCopied(""), 2000);
  }

  const CredentialField = ({
    label,
    value,
    mono,
  }: {
    label: string;
    value: string;
    mono?: boolean;
  }) => (
    <div>
      <label className={`mb-2 block text-sm font-semibold ${cx("text-white", "text-gray-800")}`}>
        {label}
      </label>
      <div className="flex gap-3">
        <input
          readOnly
          value={value}
          className={`flex-1 rounded-xl border px-4 py-3 outline-none ${mono ? "font-mono" : ""} ${cx(
            "border-neutral-700 bg-neutral-800 text-white",
            "border-gray-300 bg-gray-50"
          )}`}
        />
        <button
          onClick={() => copy(value, label)}
          className="rounded-xl bg-[#2b7a2d] px-5 font-medium text-white transition hover:bg-[#256927]"
        >
          Copy
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className={`w-full max-w-xl overflow-hidden rounded-3xl shadow-2xl transition-colors ${cx("bg-neutral-900", "bg-white")}`}>
        {/* Header */}
        <div className={`border-b px-6 py-5 ${cx("border-neutral-700", "border-gray-200")}`}>
          <h2 className={`text-2xl font-bold ${cx("text-green-400", "text-[#2b7a2d]")}`}>
            🎉 User Created Successfully
          </h2>
          <p className={`mt-2 ${cx("text-neutral-400", "text-gray-500")}`}>
            Share these credentials with the user.
          </p>
          {copied && (
            <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${cx("bg-green-900/30 text-green-300", "bg-green-100 text-green-700")}`}>
              ✅ {copied}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          <div className={`rounded-xl border p-4 ${cx("border-yellow-700 bg-yellow-900/20 text-yellow-300", "border-yellow-200 bg-yellow-50 text-yellow-800")}`}>
            <p className="text-sm">
              ⚠️ Save or copy these credentials before closing this window. The temporary password cannot be viewed again.
            </p>
          </div>

          <CredentialField label="Email" value={email} />
          <CredentialField label="Temporary Password" value={password} mono />

          <button
            onClick={() => copy(`Email: ${email}\nPassword: ${password}`, "Credentials")}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            📋 Copy Email & Password
          </button>
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 border-t px-6 py-4 ${cx("border-neutral-700", "border-gray-200")}`}>
          <button
            onClick={onClose}
            className="rounded-xl bg-[#2b7a2d] px-6 py-2 font-semibold text-white transition hover:bg-[#256927]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}