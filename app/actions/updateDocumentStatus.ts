"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export async function updateDocumentStatus(
  documentId: Id<"documents">,
  verificationStatus:
    | "pending"
    | "approved"
    | "rejected"
    | "outdated"
) {
  await convex.mutation(
    api.documents.updateVerificationStatus,
    {
      id: documentId,
      verificationStatus,
    }
  );
}