import "server-only";

export function cleanExtractedText(
  text: string
): string {
  let cleaned = text;

  // Normalize line endings
  cleaned = cleaned.replace(/\r\n/g, "\n");

  // Replace multiple spaces with one
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // Remove spaces before newlines
  cleaned = cleaned.replace(/ +\n/g, "\n");

  // Collapse 3+ blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Remove duplicate consecutive lines
  const lines = cleaned.split("\n");

  const unique: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (
      trimmed &&
      unique[unique.length - 1]?.trim() === trimmed
    ) {
      continue;
    }

    unique.push(line);
  }

  cleaned = unique.join("\n");

  // Merge wrapped sentences
  cleaned = cleaned.replace(
    /([a-z0-9,])\n([a-z])/g,
    "$1 $2"
  );

  // Preserve paragraph breaks
  cleaned = cleaned.replace(
    /([.!?]) ([A-Z])/g,
    "$1\n\n$2"
  );

  return cleaned.trim();
}