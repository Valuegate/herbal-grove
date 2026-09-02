"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { useUIStateContext } from "@/components/UIStateContext";

import StatusBadge from "./StatusBadge";
import DocumentActions from "./DocumentActions";

interface Props {
  search: string;
}

export default function DocumentTable({ search }: Props) {
  const { darkMode } = useUIStateContext();

  const documents = useQuery(api.documents.getDocuments);

  if (documents === undefined) {
    return (
      <div
        className={`rounded-2xl border p-10 text-center ${
          darkMode
            ? "border-neutral-800 bg-[#1E1E1E]"
            : "border-gray-200 bg-white"
        }`}
      >
        Loading documents...
      </div>
    );
  }

  const filteredDocuments = documents.filter((doc) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      doc.title.toLowerCase().includes(query) ||
      doc.originalFileName.toLowerCase().includes(query)
    );
  });

  return (
    <div
      className={`rounded-2xl border ${
        darkMode
          ? "border-neutral-800 bg-[#1E1E1E]"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full min-w-225">
          <thead
            className={`text-left ${
              darkMode
                ? "bg-neutral-900"
                : "bg-gray-50"
            }`}
          >
            <tr>
              <th className="px-6 py-4">S/N</th>
              <th className="px-6 py-4">Document</th>
              <th className="px-6 py-4">
                Verification
              </th>
              <th className="px-6 py-4">
                Indexing
              </th>
              <th className="px-6 py-4">
                Uploaded
              </th>
              <th className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredDocuments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No documents found.
                </td>
              </tr>
            ) : (
              filteredDocuments.map((doc, index) => (
                <tr
                  key={doc._id}
                  className={`border-t ${
                    darkMode
                      ? "border-neutral-800"
                      : "border-gray-200"
                  }`}
                >
                  <td className="px-6 py-4 font-medium">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {doc.title}
                    </div>

                    <div
                      className={`mt-1 text-xs ${
                        darkMode
                          ? "text-neutral-400"
                          : "text-gray-500"
                      }`}
                    >
                      {doc.originalFileName}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge
                      status={doc.verificationStatus}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge
                      status={doc.ingestionStatus}
                    />
                  </td>

                  <td className="px-6 py-4">
                    {new Date(
                      doc.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <DocumentActions
                      documentId={doc._id}
                      documentName={doc.title}
                      currentStatus={
                        doc.verificationStatus
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}