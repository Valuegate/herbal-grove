"use client";

import { useState } from "react";

import SearchBar from "@/components/researchlibrary/SearchBar";
import AllResearchPapers from "@/components/researchlibrary/AllResearchPapers";

export default function ResearchLibraryPage() {
  const [search, setSearch] = useState("");

  return (
    <main className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-4xl font-bold">
          Research Library
        </h1>

        <p className="text-gray-500">
          Browse all verified herbal research papers.
        </p>
      </section>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <AllResearchPapers
        searchQuery={search}
      />
    </main>
  );
}