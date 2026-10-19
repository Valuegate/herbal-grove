"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Pencil } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";

export default function ProfileSummary() {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user ? { clerkId: user.id } : "skip"
  );

  const cardClass = `rounded-2xl shadow-sm border p-4 ${
    darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-100"
  }`;

  if (consultant === undefined) {
    return (
      <div className={`${cardClass} animate-pulse`}>
        <div className="h-24 rounded-xl bg-neutral-300 dark:bg-neutral-700" />
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="flex flex-row items-center gap-10">
        <div className="relative shrink-0">
          {consultant?.imageUrl ? (
            <Image
              src={consultant.imageUrl}
              alt={consultant.fullName}
              width={200}
              height={200}
              className="w-40 h-40 rounded-2xl object-cover"
            />
          ) : (
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold ${
                darkMode ? "bg-neutral-800 text-neutral-400" : "bg-gray-100 text-gray-500"
              }`}
            >
              {consultant?.fullName?.charAt(0) ?? "C"}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h2 className={`text-4xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
            {consultant?.fullName || "Complete your profile"}
          </h2>

          <p className="mt-1 text-base font-medium text-green-700">
            {consultant?.specialization || "Herbal Consultant"}
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/consultant/profile"
              className="bg-green-800 hover:bg-green-900 text-white px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition"
            >
              <Pencil size={16} />
              Edit Profile
            </Link>

            <Link
              href="/consultant/archive"
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition ${
                darkMode
                  ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              View Public Archive
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}