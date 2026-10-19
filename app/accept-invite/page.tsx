import { Suspense } from "react";
import { AcceptInviteForm } from "@/components/Consultant/acceptinvite/AcceptInviteForm";

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto p-8">
          <p className="text-sm text-gray-500">
            Loading invitation...
          </p>
        </div>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}