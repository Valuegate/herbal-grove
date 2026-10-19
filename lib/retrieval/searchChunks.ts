import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { generateEmbedding } from "../embeddings/generateEmbeddings";
import { cosineSimilarity } from "./cosineSimilarity";

const DEFAULT_THRESHOLD = 0.65;
const DEFAULT_LIMIT = 5;

type DocumentChunk = {
  text: string;
  embedding: number[];
  documentId: Id<"documents">;
  page?: number;
};

type ResearchChunk = {
  text: string;
  embedding: number[];
  discoveryId: Id<"researchDiscoveries">;
};

export type SearchChunkResult =
  | {
      sourceType: "document";
      text: string;
      similarity: number;
      documentId: Id<"documents">;
      page?: number;
    }
  | {
      sourceType: "research";
      text: string;
      similarity: number;
      discoveryId: Id<"researchDiscoveries">;
    };

export async function searchChunks(
  convex: ConvexHttpClient,
  question: string,
  threshold: number = DEFAULT_THRESHOLD,
  limit: number = DEFAULT_LIMIT
): Promise<SearchChunkResult[]> {
  const queryEmbedding = await generateEmbedding(question);

  const [documentChunks, researchChunks] = await Promise.all([
      convex.query(
        api.chunk.getApprovedChunks
      ) as Promise<DocumentChunk[]>,

      convex.query(
        api.researchChunks.getApprovedResearchChunks
      ) as Promise<ResearchChunk[]>,
    ]);

  console.log(
    "Approved document chunks:",
    documentChunks.length
  );

  console.log(
    "Approved Scout chunks:",
    researchChunks.length
  );

  const rankedDocumentChunks: SearchChunkResult[] = documentChunks.map((chunk) => ({
      sourceType: "document",
      text: chunk.text,
      similarity: cosineSimilarity(
        queryEmbedding,
        chunk.embedding
      ),
      documentId: chunk.documentId,
      page: chunk.page,
    }));

  const rankedResearchChunks: SearchChunkResult[] = researchChunks.map((chunk) => ({
      sourceType: "research",
      text: chunk.text,
      similarity: cosineSimilarity(
        queryEmbedding,
        chunk.embedding
      ),
      discoveryId: chunk.discoveryId,
    }));

  const rankedChunks = [
    ...rankedDocumentChunks,
    ...rankedResearchChunks,
  ].sort(
    (a, b) =>
      b.similarity - a.similarity
  );

  console.log(
    "Top RAG matches:",
    rankedChunks.slice(0, 10).map(
      (chunk) => ({
        sourceType: chunk.sourceType,
        similarity: chunk.similarity,
        text: chunk.text.slice(0, 100),
      })
    )
  );

  return rankedChunks
    .filter(
      (chunk) =>
        chunk.similarity >= threshold
    )
    .slice(0, limit);
}