"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
} from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";

interface Props {
  document: Doc<"documents">;
}

export default function PaperHeader({
  document,
}: Props) {
  return (
    <div className="mb-10 border-b pb-8">
      <Link
        href="/research-library"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#2B7A2D] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Research Library
      </Link>

      <h1 className="text-4xl font-bold leading-tight">
        {document.title}
      </h1>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span>
          Uploaded{" "}
          {new Date(
            document.createdAt
          ).toLocaleDateString()}
        </span>

        <span className="flex items-center gap-1">
          <BadgeCheck
            size={16}
            className="text-green-600"
          />
          {document.verificationStatus}
        </span>

        <span className="flex items-center gap-1">
          <Clock3
            size={16}
            className="text-blue-500"
          />
          {document.ingestionStatus}
        </span>
      </div>
    </div>
  );
}