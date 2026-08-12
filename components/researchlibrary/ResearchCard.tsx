"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

interface ResearchCardProps {
  document: {
    _id: string;
    title: string;
    summary?: string;
  };
}

export default function ResearchCard({ document }: ResearchCardProps) {
  const { darkMode } = useUIStateContext();

  const headingClass = darkMode ? "text-white" : "text-[#031609]";
  const mutedClass = darkMode ? "text-neutral-300" : "text-gray-600";

  return (
    <article
      className={`overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        darkMode ? "bg-[#222224] border-neutral-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Cover */}
      <div className={`h-56 flex flex-col items-center justify-center ${darkMode ? "bg-neutral-900" : "bg-[#F5F7F8]"}`}>
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center ${
            darkMode ? "bg-[#2D2D2D]" : "bg-white shadow-sm"
          }`}
        >
          <FileText size={34} className="text-green-700" />
        </div>
        <p className={`mt-5 text-sm font-semibold ${darkMode ? "text-neutral-400" : "text-gray-500"}`}>
          Herbal Research Paper
        </p>
      </div>

      {/* Body */}
      <div className="p-6">
        <h3 className={`line-clamp-2 text-2xl font-bold leading-tight ${headingClass}`}>
          {document.title}
        </h3>

        <p className={`mt-4 line-clamp-3 leading-7 ${mutedClass}`}>
          {document.summary ?? "Summary unavailable. Open this paper to read the complete research."}
        </p>

        <Link
          href={`/researchlibrary/${document._id}`}
          className="mt-8 inline-flex items-center font-semibold text-green-700 transition hover:underline"
        >
          Read Analysis
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}