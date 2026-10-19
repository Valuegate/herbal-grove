import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { chunkText } from "../pdf/chunkText";
import { generateEmbedding } from "../embeddings/generateEmbeddings";

export async function saveChunks(
  convex: ConvexHttpClient,
  documentId: Id<"documents">,
  extractedText: string
) {
  const chunks = chunkText(extractedText);

  const validChunks = chunks.filter(
    (chunk) => chunk.trim().length > 0
  );

  console.log(`Creating ${validChunks.length} chunks...`);

  for (let i = 0; i < validChunks.length; i++) {
    console.log(`Embedding chunk ${i + 1}/${validChunks.length}`);

    const embedding = await generateEmbedding(validChunks[i]);
    if (
      !Array.isArray(embedding) ||
      embedding.length === 0 ||
      embedding.some((value) => !Number.isFinite(value))
    ) {
      throw new Error(
        `Invalid embedding generated for chunk ${i + 1}`
      );
    }

    await convex.mutation(
      api.chunk.createChunk,
      {
        documentId,
        page: undefined,
        chunkIndex: i,
        text: validChunks[i],
        embedding,
      }
    );
  }

  return validChunks.length;
}