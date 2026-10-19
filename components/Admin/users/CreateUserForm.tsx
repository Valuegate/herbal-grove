"use client";

import { useState } from "react";
import { useUIStateContext } from "@/components/UIStateContext";

export default function UsersTable() {
  const { darkMode } = useUIStateContext();

  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const inputClass = `w-full rounded-xl border px-4 py-3 outline-none transition ${
    darkMode
      ? "border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:border-green-500"
      : "border-gray-300 bg-white focus:border-[#2b7a2d]"
  }`;

  const labelClass = `mb-2 block text-sm font-medium ${
    darkMode ? "text-neutral-300" : "text-gray-700"
  }`;

  async function inviteConsultant() {
    if (!email) {
      setStatusMessage({ type: "error", text: "Please enter an email address." });
      return;
    }

    try {
      setIsInviting(true);
      setStatusMessage(null);

      const response = await fetch("/api/invite-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "consultant" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage({ type: "error", text: data.error ?? "Unable to send invitation." });
        return;
      }

      setStatusMessage({
        type: "success",
        text: `Invitation sent to ${email}. They'll set up their own account from the link.`,
      });
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setIsInviting(false);
    }
  }

  return (
    <div
      className={`rounded-2xl border p-6 transition-colors ${
        darkMode ? "border-neutral-700 bg-neutral-900" : "border-gray-200 bg-white"
      }`}
    >
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Consultant Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          onClick={inviteConsultant}
          disabled={isInviting}
          className="w-full rounded-xl bg-[#2b7a2d] py-3 font-semibold text-white transition hover:bg-[#256927] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isInviting ? "Sending Invitation..." : "Send Invitation"}
        </button>

        {statusMessage && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              statusMessage.type === "success"
                ? darkMode
                  ? "bg-green-900/30 text-green-300"
                  : "bg-green-100 text-green-700"
                : darkMode
                ? "bg-red-900/30 text-red-300"
                : "bg-red-100 text-red-700"
            }`}
          >
            {statusMessage.type === "success" ? "✅ " : "⚠️ "}
            {statusMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}