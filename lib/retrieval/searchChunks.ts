import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { generateEmbedding } from "../embeddings/generateEmbeddings";
import { cosineSimilarity } from "./cosineSimilarity";

const DEFAULT_THRESHOLD = 0.8;
const DEFAULT_LIMIT = 5;

type Chunk = {
  text: string;
  embedding: number[];
  documentId: Id<"documents">;
  page?: number;
};

export type SearchChunkResult = {
  text: string;
  similarity: number;
  documentId: Id<"documents">;
  page?: number;
};

export async function searchChunks(
  convex: ConvexHttpClient,
  question: string,
  threshold: number = DEFAULT_THRESHOLD,
  limit: number = DEFAULT_LIMIT
): Promise<SearchChunkResult[]> {
  const queryEmbedding = await generateEmbedding(question);

  const chunks = (await convex.query(
    api.chunk.getChunks
  )) as Chunk[];

  const rankedChunks: SearchChunkResult[] = chunks
    .map((chunk: Chunk): SearchChunkResult => ({
      text: chunk.text,
      similarity: cosineSimilarity(
        queryEmbedding,
        chunk.embedding
      ),
      documentId: chunk.documentId,
      page: chunk.page,
    }))
    .filter(
      (chunk: SearchChunkResult) =>
        chunk.similarity >= threshold
    )
    .sort(
      (
        a: SearchChunkResult,
        b: SearchChunkResult
      ) => b.similarity - a.similarity
    )
    .slice(0, limit);

  return rankedChunks;
}