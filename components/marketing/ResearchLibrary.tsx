"use client"

import { Search } from "lucide-react";
import { useState } from "react";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import FeaturedResearch from "@/components/researchlibrary/featuredResearch";
import LatestPublication from "@/components/researchlibrary/publications";


export default function ResearchLibrary() {
  const { darkMode } = useDashboardContext();
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="px-4 py-6">
      {/*Hero Section*/}
      <div className={`mx-auto flex min-h-47.5 max-w-6xl flex-col items-center justify-center rounded-[28px] px-5 py-10 text-center transition-colors ${darkMode ? "bg-[#222224] text-white" : "bg-gray-100/50 text-black"}`}>
        <h1 className={`text-2xl font-extrabold leading-tight sm:text-[28px] ${darkMode ? "text-white" : "text-black"}`}>
          Discover Verified Herbal Wisdom
        </h1>

        <div className="mt-7 w-full max-w-135">
          <div className={`flex h-12 items-center rounded-xl border px-4 py-1.5 shadow-sm transition-colors ${darkMode ? "bg-[#222224] border-neutral-700" : "bg-white border-slate-200"}`}>
            <Search className="w-5 h-5 text-gray-500" />
            
              <div className="flex w-full items-center ">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search Herbs, Ailments or Research Papers...'
                  className={`pl-3 min-w-0 flex-1 bg-transparent text-sm outline-none ${darkMode ? 'text-white placeholder-neutral-500' : 'text-neutral-700 placeholder-gray-400'}`}
                />

                <button
                  type="button"
                  onClick={() => { /* visual-only, search is live */ }}
                  className={`ml-2 shrink-0 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 sm:px-6`}
                >
                  Search
                </button>
              </div>
          </div>
        </div>
      </div>


      {/*Featured Research*/}
      <div className="py-6">
        <FeaturedResearch searchQuery={searchQuery} />
      </div>

      {/*Latest Publication*/}
      <div className="py-6">
        <LatestPublication />
      </div>
    </div>
  )
}