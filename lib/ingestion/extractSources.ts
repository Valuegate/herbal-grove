import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface ExtractedSource {
  name: string;
  type:
    | "journal"
    | "research_institute"
    | "government"
    | "traditional"
    | "other";
  url?: string;
}

export async function saveSources(
  convex: ConvexHttpClient,
  documentId: Id<"documents">,
  sources: ExtractedSource[]
) {
  for (const source of sources) {
    // Does this source already exist?
    const existingSource = await convex.query(
      api.documents.getSourceByName,
      {
        name: source.name,
      }
    );

    let sourceId: Id<"sources">;

    if (existingSource) {
      sourceId = existingSource._id;
    } else {
      sourceId = await convex.mutation(
        api.documents.createSource,
        {
          name: source.name,
          type: source.type,
          url: source.url,
          description: undefined,
        }
      );
    }

    // Avoid duplicate links
    const existingLink = await convex.query(
      api.documents.getDocumentSource,
      {
        documentId,
        sourceId,
      }
    );

    if (!existingLink) {
      await convex.mutation(
        api.documents.linkDocumentToSource,
        {
          documentId,
          sourceId,
        }
      );
    }
  }
}