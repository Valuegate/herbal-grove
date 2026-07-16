"use client";

import { Upload } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

interface UploadButtonProps {
  onClick: () => void;
}

export default function UploadButton({ onClick }: UploadButtonProps) {
  const { darkMode } = useUIStateContext();

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition
        ${
          darkMode
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-[#2b7a2d] hover:bg-[#246826] text-white"
        }`}
    >
      <Upload size={18} />
      Upload Document
    </button>
  );
}