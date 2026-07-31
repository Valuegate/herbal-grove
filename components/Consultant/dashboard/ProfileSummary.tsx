"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Pencil, MapPin, BadgeCheck } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";

export default function ProfileSummary() {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user ? { clerkId: user.id } : "skip"
  );

  if (consultant === undefined) {
    return (
      <div
        className={`rounded-2xl shadow-sm border p-6 animate-pulse ${
          darkMode
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-gray-100"
        }`}
      >
        <div className="h-24 rounded-xl bg-neutral-300 dark:bg-neutral-700" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl shadow-sm border p-6 ${
        darkMode
          ? "bg-neutral-900 border-neutral-800"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {consultant?.imageUrl ? (
          <Image
            src={consultant.imageUrl}
            alt={consultant.fullName}
            width={100}
            height={100}
            className="rounded-2xl object-cover"
          />
        ) : (
          <div
            className={`w-25 h-25 rounded-2xl flex items-center justify-center text-3xl font-bold ${
              darkMode
                ? "bg-neutral-800 text-neutral-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {consultant?.fullName?.charAt(0) ?? "C"}
          </div>
        )}

        <div className="flex-1">
          <h2
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {consultant?.fullName || "Complete your profile"}
          </h2>

          <p className="text-green-600 font-medium mt-1">
            {consultant?.description || "Clinical Herbal Consultant"}
          </p>

          <div
            className={`flex flex-wrap gap-4 mt-4 text-sm ${
              darkMode ? "text-neutral-400" : "text-gray-500"
            }`}
          >
            <span className="flex items-center gap-1">
              <BadgeCheck size={16} />
              Verified Consultant
            </span>

            <span className="flex items-center gap-1">
              <MapPin size={16} />
              Nigeria
            </span>
          </div>
        </div>

        <Link
          href="/consultant/profile"
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <Pencil size={18} />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}