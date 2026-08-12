import { ai } from "./client";

export async function generateEmbedding(
  text: string
): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding) {
    throw new Error("Failed to generate embedding.");
  }

  return embedding;
}