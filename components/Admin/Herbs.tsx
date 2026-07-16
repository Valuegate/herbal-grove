"use client";

import HerbSearch from "@/components/Admin/herbs/HerbSearch";
import HerbTable from "@/components/Admin/herbs/HerbTable";

export default function HerbsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Herbs</h2>
        <p className="text-gray-500 mt-1">
          Browse herbs extracted from indexed research documents.
        </p>
      </div>

      <HerbSearch />

      <HerbTable />
    </div>
  );
}