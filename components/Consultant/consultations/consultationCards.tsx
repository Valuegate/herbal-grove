"use client";

import { Clock3, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ConsultationCardProps {
  darkMode: boolean;
  consultation: {
    _id: Id<"consultations">;
    userName: string;
    userEmail: string;
    createdAt: number;
    status:
      | "pending"
      | "active"
      | "completed"
      | "cancelled";
  };
}

export default function ConsultationCard({ darkMode, consultation }: ConsultationCardProps) {
  const router = useRouter();

  const acceptConsultation = useMutation(api.consultations.acceptConsultation);

  const isActive = consultation.status === "active";
  const isCompleted = consultation.status === "completed";

  const statusLabel = consultation.status === "completed"
    ? "Completed"
    : consultation.status === "active"
    ? "Active"
    : "Pending";

  const buttonText = isCompleted
    ? "View Consultation"
    : isActive
    ? "Resume Session"
    : "Start Consultation";

  const initials = consultation.userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const date = new Date(
    consultation.createdAt
  ).toLocaleString();

  const handleConsultation = async () => {
    switch (consultation.status) {
      case "pending":
        await acceptConsultation({consultationId: consultation._id});
        router.push(`/consultant/chat/${consultation._id}`);
        break;
        
      case "active":
        router.push(`/consultant/chat/${consultation._id}`);
        break;

      case "completed":
        router.push(`/consultant/chat/${consultation._id}`);
        break;
    }
  };

  return (
    <div
      className={`rounded-2xl shadow-sm border px-5 py-5 flex items-center justify-between transition ${
        darkMode
          ? "bg-[#1E1E1E] border-neutral-800"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
            isActive
              ? "bg-green-600 text-white"
              : darkMode
              ? "bg-neutral-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {initials}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3
              className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {consultation.userName}
            </h3>

            <span
              className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                consultation.status === "completed"
                  ? "bg-blue-100 text-blue-700"
                  : consultation.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {statusLabel}
            </span>
          </div>

          <p
            className={`text-sm ${darkMode ? "text-neutral-400" : "text-gray-500"}`}
          >
            {consultation.userEmail}
          </p>

          <div
            className={`flex items-center gap-2 mt-2 text-xs ${darkMode ? "text-neutral-400" : "text-gray-500"}`}
          >
            <Clock3 size={14}/>
            {date}
          </div>
        </div>
      </div>


      <div className="flex items-center gap-4">

        <button
          onClick={handleConsultation}
          className={`rounded-full px-6 py-2 text-sm font-medium ${
            isActive
              ? "bg-green-700 text-white"
              : "border border-green-700 text-green-700"
          }`}
        >
          {buttonText}
        </button>

        <button>
          <MoreVertical
            size={18}
            className={darkMode ? "text-neutral-400" : "text-gray-600"}
          />
        </button>
      </div>
    </div>
  );
}