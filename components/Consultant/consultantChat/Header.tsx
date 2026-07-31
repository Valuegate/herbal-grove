"use client";

import { ChevronLeft, Phone, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIStateContext } from "@/components/UIStateContext";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  consultation: {
    _id: Id<"consultations">;
    status: "pending" | "active" | "completed";
  };

  user: {
    name: string;
    email: string;
  };
}

export default function Header({ consultation, user }: Props) {
  const router = useRouter();
  const { darkMode } = useUIStateContext();

  const completeConsultation = useMutation(api.consultations.completeConsultation);

  const handleEndSession = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to end this consultation?"
    );

    if (!confirmed) return;

    await completeConsultation({consultationId: consultation._id});

    router.push("/consultant/consultations");
  };

  return (
    <header
      className={`sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b ${
        darkMode
          ? "bg-[#1E1E1E] border-neutral-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>

        <div>
          <h2
            className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {user.name}
          </h2>

          <p className="text-xs text-green-600">
            {user.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {consultation.status === "active" && (
          <button
            onClick={handleEndSession}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            End Session
          </button>
        )}

        <button>
          <Phone size={20} />
        </button>

        <button>
          <MoreVertical size={20} />
        </button>
      </div>
    </header>
  );
}