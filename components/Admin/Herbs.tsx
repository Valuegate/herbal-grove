"use client";

import { useState } from "react";

import HerbSearch from "@/components/Admin/herbs/HerbSearch";
import HerbTable from "@/components/Admin/herbs/HerbTable";

export default function HerbsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">
          Herbs
        </h2>

        <p className="mt-1 text-gray-500">
          Browse herbs extracted from indexed research
          documents.
        </p>
      </div>

      <HerbSearch
        value={search}
        onChange={setSearch}
      />

      <HerbTable search={search} />
    </div>
  );
}