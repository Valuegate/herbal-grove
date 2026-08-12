"use client";

import ChangePasswordForm from "@/components/Consultant/changePassword/ChangePasswordForm";
import { useUIStateContext } from "@/components/UIStateContext";

export default function ChangePasswordPage() {
  const { darkMode } = useUIStateContext();

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        darkMode ? "bg-[#121212]" : "bg-[#f8faf8]"
      }`}
    >
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-[#2b7a2d]"
            }`}
          >
            Change Your Password
          </h1>

          <p
            className={`mt-3 ${
              darkMode ? "text-neutral-400" : "text-gray-500"
            }`}
          >
            You're signing in for the first time. Please create a new password
            before continuing.
          </p>
        </div>

        <ChangePasswordForm />
      </div>
    </div>
  );
}