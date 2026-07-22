"use client";

import Link from "next/link";
import { FilePlus2, Leaf } from "lucide-react";

interface Props {
  darkMode: boolean;
}

export default function QuickActions({
  darkMode,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Link
        href="/admin/knowledge-base"
        className={`rounded-2xl p-6 text-left transition hover:scale-[1.02] ${
          darkMode
            ? "bg-[#1E1E1E] border border-neutral-800"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <FilePlus2
          className="mb-4 text-[#2B7A2D]"
          size={28}
        />

        <h3 className="text-lg font-semibold">
          Upload Document
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Upload a new research paper to the knowledge
          base.
        </p>
      </Link>

      <Link
        href="/admin/herbs"
        className={`rounded-2xl p-6 text-left transition hover:scale-[1.02] ${
          darkMode
            ? "bg-[#1E1E1E] border border-neutral-800"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <Leaf
          className="mb-4 text-[#2B7A2D]"
          size={28}
        />

        <h3 className="text-lg font-semibold">
          Manage Herbs
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          View, edit and manage herbs in the knowledge
          base.
        </p>
      </Link>
    </div>
  );
}