"use server";

import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { deletePdf } from "@/lib/cloudinary/deletePdf";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export async function deleteDocument(
  documentId: Id<"documents">
) {
  // Get the document
  const document = await convex.query(
    api.documents.getDocumentById,
    {
      id: documentId,
    }
  );

  if (!document) {
    throw new Error("Document not found.");
  }

  // Get all herb relationships BEFORE deleting them
  const links = await convex.query(
    api.documentHerbs.getHerbsForDocumentLinks,
    {
      documentId,
    }
  );

  // Delete herbs that are no longer referenced
  for (const link of links) {
    const herbLinks = await convex.query(
      api.documentHerbs.getDocumentsForHerbLinks,
      {
        herbId: link.herbId,
      }
    );

    // If this document is the herb's only reference,
    // delete the herb as well.
    if (herbLinks.length === 1) {
      await convex.mutation(
        api.herbs.deleteHerb,
        {
          id: link.herbId,
        }
      );
    }
  }

  // Delete herb relationships
  await convex.mutation(
    api.documentHerbs.deleteLinksByDocument,
    {
      documentId,
    }
  );

  // Delete chunks/embeddings
  await convex.mutation(
    api.chunk.deleteChunksByDocument,
    {
      documentId,
    }
  );

  // Delete document
  await convex.mutation(
    api.documents.deleteDocument,
    {
      id: documentId,
    }
  );

  // Finally delete the PDF from Cloudinary
  await deletePdf(document.storageId);

  return {
    success: true,
  };
}