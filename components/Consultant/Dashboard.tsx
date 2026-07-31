"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import Summary from "../Consultant/dashboard/ProfileSummary";
import StatCards from "../Consultant/dashboard/StatCard";
import Consultations from "../Consultant/dashboard/PendingConsultations";

import { useUIStateContext } from "@/components/UIStateContext";

export default function Dashboard() {
  const { darkMode } = useUIStateContext();

  const router = useRouter();

  const { user, isLoaded, isSignedIn } = useUser();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user
      ? {
          clerkId: user.id,
        }
      : "skip"
  );

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      router.replace("/login");
      return;
    }

    if (consultant === null) {
      router.replace("/consultant/profile");
    }
  }, [
    consultant,
    isLoaded,
    isSignedIn,
    user,
    router,
  ]);

  if (!isLoaded || consultant === undefined) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (consultant === null) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1
          className={`text-3xl font-bold ${darkMode ? "text-white" : "text-[#2b7a2d]"}`}
        >
          Consultant Dashboard
        </h1>

        <p
          className={`mt-2 ${darkMode ? "text-neutral-400" : "text-gray-500"}`}
        >
          Welcome back. Here's what's happening today.
        </p>
      </div>

      <Summary />

      <StatCards />

      <Consultations />
    </div>
  );
}