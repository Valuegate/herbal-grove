import "server-only";

import { extractText as extractPdfText } from "unpdf";

export async function extractText(
  pdfBuffer: Buffer
): Promise<string> {
  const result = await extractPdfText(
    new Uint8Array(pdfBuffer)
  );

  return result.text.join("\n");
}