export interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
}

export function chunkText(
  text: string,
  {
    chunkSize = 1000,
    overlap = 200,
  }: ChunkOptions = {}
): string[] {
  const chunks: string[] = [];

  let start = 0;

  while (start < text.length) {
    chunks.push(
      text.slice(start, start + chunkSize)
    );

    start += chunkSize - overlap;
  }

  return chunks;
}