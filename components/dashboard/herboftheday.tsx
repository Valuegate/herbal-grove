"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { MessageCircle } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { BookmarkIcon, FlowerIcon } from "@/components/ui/icons";
import FlowerImage from "@/components/dashboard/morter.png";

import { useUIStateContext } from "@/components/UIStateContext";

export default function HerbOfTheDay() {
  const { darkMode } = useUIStateContext();
  const herb = useQuery(api.herbs.getHerbOfTheDay);
  const document = useQuery(api.documentHerbs.getDocumentsForHerb, herb ? { herbId: herb._id } : "skip");
  const firstDocument = document && document.length > 0 ? document[0] : null 

  const headingClass = darkMode ? "text-white" : "text-gray-900";
  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-600";
  const cardClass = `rounded-2xl border p-6 transition-all duration-300 ${
    darkMode ? "bg-[#222224] border-neutral-800" : "bg-white border-gray-100 shadow-sm"
  }`;

  if (herb === undefined) {
    return (
      <section className="max-w-3xl mx-auto">
        <div className={`rounded-2xl h-48 animate-pulse ${darkMode ? "bg-[#222224]" : "bg-gray-100"}`} />
      </section>
    );
  }

  if (herb === null) {
    return (
      <section className="max-w-3xl mx-auto">
        <div className={`${cardClass} text-center`}>
          <h2 className={`text-xl font-bold ${headingClass}`}>Herb of the Day</h2>
          <p className={`mt-2 ${mutedClass}`}>No verified herbs are available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto">
      <div className={`${cardClass} flex items-center justify-between gap-3`}>
        {/* Herb Details */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                darkMode ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"
              }`}
            >
              <FlowerIcon />
              Herb of the Day
            </span>
          </div>

          <h3 className={`text-2xl font-bold ${headingClass}`}>
            {herb.commonNames[0] ?? herb.scientificName}
          </h3>

          <p className={`text-sm leading-relaxed max-w-md ${mutedClass}`}>
            {herb.description ?? "No description available yet."}
          </p>

          <div className="flex items-center gap-6 pt-1">
            <Link
              href={firstDocument ? `/researchlibrary/${firstDocument._id}` : "#"}
              className={`flex items-center gap-1.5 text-sm font-semibold group hover:underline ${headingClass}`}
            >
              Read Research
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <button className={`flex items-center gap-1.5 text-sm font-semibold ${mutedClass} hover:text-green-600`}>
              <BookmarkIcon />
              Save
            </button>
          </div>
        </div>

        {/* Herb Image */}
        <div className="hidden sm:block w-32 h-32 shrink-0 overflow-hidden rounded-xl bg-[#181818]">
          <Image
            src={herb.imageUrl ?? FlowerImage}
            alt={herb.commonNames[0]}
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-1">
        <Link
          href="/chat"
          className="w-14 h-14 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-lg transition"
          aria-label="Chat with AI"
        >
          <MessageCircle />
        </Link>
        <span className={`text-[10px] font-bold uppercase ${darkMode ? "text-emerald-400" : "text-[#2b7a2d]"}`}>
          Chat with AI
        </span>
      </div>
    </section>
  );
}