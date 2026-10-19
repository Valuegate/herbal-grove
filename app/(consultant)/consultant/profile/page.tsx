"use client";

import EditProfileForm from "@/components/Consultant/editprofile/EditProfileForm";
import { useUIStateContext } from "@/components/UIStateContext";

export default function ProfilePage() {
  const { darkMode } = useUIStateContext();

  return (
    <div className="space-y-8">
      <div>
        <h1
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-[#2b7a2d]"
          }`}
        >
          Edit Profile
        </h1>

        <p
          className={`mt-2 ${
            darkMode ? "text-neutral-400" : "text-gray-500"
          }`}
        >
          Update your personal information.
        </p>
      </div>

      <EditProfileForm />
    </div>
  );
}