"use client";

import { useState, useTransition } from "react";
import { MoreVertical } from "lucide-react";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { deleteDocument } from "@/app/actions/deleteDocuments";
import { updateDocumentStatus } from "@/app/actions/updateDocumentStatus";
import ConfirmModal from "@/components/ui/confirmModal";

interface Props {
  documentId: Id<"documents">;
  documentName: string;
  currentStatus: Doc<"documents">["verificationStatus"];
}

export default function DocumentActions({
  documentId,
  documentName,
  currentStatus,
}: Props) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleStatus = (
    status: "approved" | "rejected"
  ) => {
    startTransition(async () => {
      await updateDocumentStatus(
        documentId,
        status
      );

      setOpen(false);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteDocument(documentId);

      setDeleteOpen(false);
      setOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border bg-white shadow-lg">
          {currentStatus !== "approved" && (
            <button
              disabled={isPending}
              onClick={() =>
                handleStatus("approved")
              }
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Approve
            </button>
          )}

          {currentStatus !== "rejected" && (
            <button
              disabled={isPending}
              onClick={() =>
                handleStatus("rejected")
              }
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Reject
            </button>
          )}

          <button
            disabled={isPending}
            onClick={() => setDeleteOpen(true)}
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
          >
            Delete
          </button>

        </div>
      )}
      <ConfirmModal
        open={deleteOpen}
        title="Delete Document"
        description={`Are you sure you want to permanently delete "${documentName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        danger
        loading={isPending}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}