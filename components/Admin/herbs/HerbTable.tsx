"use client";

import { useQuery } from "convex/react";
import { ChevronRight } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";

import HerbStatusBadge from "./HerbStatusBadge";

interface Props {
  search: string;
}

export default function HerbTable({
  search,
}: Props) {
  const { darkMode } = useUIStateContext();

  const herbs = useQuery(api.herbs.getHerbs);

  if (!herbs) {
    return (
      <div className="rounded-2xl border p-10 text-center">
        Loading herbs...
      </div>
    );
  }

  const filteredHerbs = herbs.filter((herb) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      herb.scientificName
        .toLowerCase()
        .includes(query) ||

      herb.commonNames.some((name) =>
        name.toLowerCase().includes(query)
      ) ||

      herb.aliases.some((alias) =>
        alias.toLowerCase().includes(query)
      )
    );
  });

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
            <th className="px-6 py-4">
              Herb
            </th>

            <th className="px-6 py-4">
              Scientific Name
            </th>

            <th className="px-6 py-4">
              Research Papers
            </th>

            <th className="px-6 py-4">
              Status
            </th>

            <th />
          </tr>
        </thead>

        <tbody>
          {filteredHerbs.map((herb) => (
            <tr
              key={herb._id}
              className={`border-t transition ${
                darkMode
                  ? "border-neutral-800 hover:bg-neutral-900"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <td className="px-6 py-5 font-semibold">
                🌿 {herb.commonNames[0]}
              </td>

              <td className="px-6 py-5 italic">
                {herb.scientificName}
              </td>

              <td className="px-6 py-5">
                {herb.documentCount}
              </td>

              <td className="px-6 py-5">
                <HerbStatusBadge
                  status={herb.status}
                />
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