"use client";

import { useUIStateContext } from "@/components/UIStateContext";
import ChangePasswordForm from "@/components/Consultant/changePassword/ChangePasswordForm";

export default function ChangePasswordPage() {
  const { darkMode } = useUIStateContext();

  return (
    <div className="space-y-8">
      <div>
        <h1
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-[#2b7a2d]"
          }`}
        >
          Change Password
        </h1>

        <p
          className={`mt-2 ${
            darkMode ? "text-neutral-400" : "text-gray-500"
          }`}
        >
          For security reasons, you must change your temporary password before continuing.
        </p>
      </div>

      <ChangePasswordForm />
    </div>
  );
}