"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function RedirectPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      router.replace("/login");
      return;
    }

    const role = user.publicMetadata.role as
      | "admin"
      | "consultant"
      | "researcher"
      | undefined;

    const mustChangePassword =
      user.publicMetadata.mustChangePassword as
        | boolean
        | undefined;

    // Force consultants to change password first
    if (role === "consultant" && mustChangePassword) {
      router.replace("/change-password");
      return;
    }

    switch (role) {
      case "admin":
        router.replace("/admin/dashboard");
        break;

      case "consultant":
        router.replace("/consultant/dashboard");
        break;

      case "researcher":
        router.replace("/researcher/dashboard");
        break;

      default:
        router.replace("/dashboard");
        break;
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />

        <h2 className="text-xl font-semibold text-gray-800">
          Redirecting...
        </h2>

        <p className="mt-2 text-gray-500">
          Please wait while we prepare your dashboard.
        </p>
      </div>
    </div>
  );
}