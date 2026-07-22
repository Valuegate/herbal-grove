"use client";

import { Doc } from "@/convex/_generated/dataModel";

interface Props {
  document: Doc<"documents">;
  herbs: Doc<"herbs">[];
}

export default function PaperSidebar({
  document,
  herbs,
}: Props) {
  return (
    <aside className="sticky top-24 h-fit space-y-6">
      <div className="rounded-2xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Research Info
        </h3>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">
              Verification
            </p>

            <p className="font-medium capitalize">
              {document.verificationStatus}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Uploaded
            </p>

            <p className="font-medium">
              {new Date(
                document.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Herbs Mentioned
        </h3>

        <div className="flex flex-wrap gap-2">
          {herbs.length === 0 ? (
            <span className="text-sm text-gray-500">
              No herbs detected.
            </span>
          ) : (
            herbs.map((herb) => (
              <span
                key={herb._id}
                className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
              >
                {herb.scientificName}
              </span>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}