"use client";

import StatusBadge from "./StatusBadge";
import { MoreVertical } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";

const documents = [
  {
    id: 1,
    name: "Turmeric Research.pdf",
    herb: "Turmeric",
    status: "Indexed",
    uploaded: "14 Jul 2026",
  },
  {
    id: 2,
    name: "Neem Study.pdf",
    herb: "Neem",
    status: "Processing",
    uploaded: "15 Jul 2026",
  },
  {
    id: 3,
    name: "Ginger Guide.pdf",
    herb: "Ginger",
    status: "Failed",
    uploaded: "15 Jul 2026",
  },
] as const;

export default function DocumentTable() {
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
          className={`text-left ${
            darkMode ? "bg-neutral-900" : "bg-gray-50"
          }`}
        >
          <tr>
            <th className="px-6 py-4">Document</th>
            <th className="px-6 py-4">Herb</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Uploaded</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>

        <tbody>
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className={`border-t ${
                darkMode ? "border-neutral-800" : "border-gray-200"
              }`}
            >
              <td className="px-6 py-4 font-medium">{doc.name}</td>

              <td className="px-6 py-4">{doc.herb}</td>

              <td className="px-6 py-4">
                <StatusBadge status={doc.status} />
              </td>

              <td className="px-6 py-4">{doc.uploaded}</td>

              <td className="px-6 py-4">
                <button>
                  <MoreVertical size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}