"use client";

import { ChevronRight } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";
import HerbStatusBadge from "./HerbStatusBadge";
import { mockHerbs } from "../shared/mockdata";

export default function HerbTable() {
  const { darkMode } = useUIStateContext();

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        darkMode
          ? "border-neutral-800 bg-[#1E1E1E]"
          : "border-gray-200 bg-white"
      }`}
    >
      <table className="w-full">
        <thead
          className={`text-left text-sm ${
            darkMode
              ? "bg-neutral-900 text-neutral-400"
              : "bg-gray-50 text-gray-500"
          }`}
        >
          <tr>
            <th className="px-6 py-4">Herb</th>
            <th className="px-6 py-4">Scientific Name</th>
            <th className="px-6 py-4">Documents</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>

        <tbody>
          {mockHerbs.map((herb) => (
            <tr
              key={herb.id}
              className={`border-t transition cursor-pointer ${
                darkMode
                  ? "border-neutral-800 hover:bg-neutral-900"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <td className="px-6 py-5 font-semibold">
                🌿 {herb.commonName}
              </td>

              <td className="px-6 py-5 italic">
                {herb.scientificName}
              </td>

              <td className="px-6 py-5">
                {herb.documentCount}
              </td>

              <td className="px-6 py-5">
                <HerbStatusBadge status={herb.status} />
              </td>

              <td className="px-6 py-5 text-right">
                <ChevronRight size={18} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}