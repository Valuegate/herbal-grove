"use client";

import { useState } from "react";
import { useUIStateContext } from "@/components/UIStateContext";
import CredentialsModal from "./CredentialsModal";

export default function UsersTable() {
  const { darkMode } = useUIStateContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("researcher");
  const [isCreating, setIsCreating] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const inputClass = `w-full rounded-xl border px-4 py-3 outline-none transition ${
    darkMode
      ? "border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:border-green-500"
      : "border-gray-300 bg-white focus:border-[#2b7a2d]"
  }`;

  const labelClass = `mb-2 block text-sm font-medium ${
    darkMode ? "text-neutral-300" : "text-gray-700"
  }`;

  async function createUser() {
    if (!name || !email) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsCreating(true);

      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error ?? "Unable to create user.");
        return;
      }

      setCredentials({ email, password: data.temporaryPassword });
      setShowCredentialsModal(true);
      setName("");
      setEmail("");
      setRole("consultant");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <>
      <div
        className={`rounded-2xl border p-6 transition-colors ${
          darkMode ? "border-neutral-700 bg-neutral-900" : "border-gray-200 bg-white"
        }`}
      >
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
              <option value="researcher">Researcher</option>
              <option value="consultant">Consultant</option>
            </select>
          </div>

          <button
            onClick={createUser}
            disabled={isCreating}
            className="w-full rounded-xl bg-[#2b7a2d] py-3 font-semibold text-white transition hover:bg-[#256927] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? "Creating User..." : "Create User"}
          </button>
        </div>
      </div>

      <CredentialsModal
        open={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
        email={credentials.email}
        password={credentials.password}
      />
    </>
  );
}