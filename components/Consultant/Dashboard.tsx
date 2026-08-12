"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import Summary from "./dashboard/ProfileHero";
import ActiveConsultationCard from "./dashboard/ActiveConsultationCards";
import ProfessionalBio from "../Consultant/dashboard/ProfessionalBio";
import QualificationsCard from "../Consultant/dashboard/Qualifications";

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user ? { clerkId: user.id } : "skip"
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
  }, [consultant, isLoaded, isSignedIn, user, router]);

  if (!isLoaded || consultant === undefined) {
    return <div className="flex h-[60vh] items-center justify-center">Loading...</div>;
  }

  if (consultant === null) {
    return null;
  }

  return (
    <div className="space-y-8">
      <Summary />
      <ActiveConsultationCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProfessionalBio />
        </div>
        <div className="lg:col-span-1">
          <QualificationsCard />
        </div>
      </div>
    </div>
  );
}