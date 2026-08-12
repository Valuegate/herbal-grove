export function buildContext(
  chunks: {
    text: string;
  }[]
) {
  return chunks
    .map((chunk) => chunk.text)
    .join("\n\n-----------------------\n\n");
}