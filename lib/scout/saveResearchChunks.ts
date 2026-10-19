import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { chunkText } from "@/lib/pdf/chunkText";
import { generateEmbedding } from "@/lib/embeddings/generateEmbeddings";

export async function saveResearchChunks(
  convex: ConvexHttpClient,
  discoveryId: Id<"researchDiscoveries">,
  content: string
) {
  const chunks = chunkText(content);

  const validChunks = chunks.filter(
    (chunk) => chunk.trim().length > 0
  );

  console.log(
    `Creating ${validChunks.length} research chunks...`
  );

  for (let i = 0; i < validChunks.length; i++) {
    console.log(
      `Embedding research chunk ${i + 1}/${validChunks.length}`
    );

    const embedding = await generateEmbedding(validChunks[i]);

    if (
      !Array.isArray(embedding) ||
      embedding.length === 0 ||
      embedding.some(
        (value) => !Number.isFinite(value)
      )
    ) {
      throw new Error(
        `Invalid embedding generated for research chunk ${
          i + 1
        }`
      );
    }

    await convex.mutation(api.researchChunks.createResearchChunk,
      {
        discoveryId,
        chunkIndex: i,
        text: validChunks[i],
        embedding,
      }
    );
  }

  return validChunks.length;
}