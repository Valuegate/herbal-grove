"use client";

import Image from "next/image";
import { ChevronLeft, Phone, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  consultant: {
    fullName: string;
    imageUrl?: string;
    isOnline: boolean;
  };
}
export default function Header({consultant}: Props) {
  const router = useRouter();
  const { darkMode } = useUIStateContext();

  return (
    <header
      className={`sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b ${
        darkMode
          ? "bg-[#1E1E1E] border-neutral-800"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>

        <Image
          src={ consultant.imageUrl ?? "/default-avatar.png" }
          alt={consultant.fullName}
          width={45}
          height={45}
          className="rounded-full"
        />

        <div>
          <h2 className="font-semibold">
            {consultant.fullName}
          </h2>

          <p className="text-xs text-green-600">
            {consultant.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Phone size={20} />

        <MoreVertical size={20} />
      </div>
    </header>
  );
}