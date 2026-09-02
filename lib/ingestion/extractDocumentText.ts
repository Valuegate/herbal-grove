import "server-only";

import path from "path";
import { extractText as extractPdfText } from "unpdf";
import mammoth from "mammoth";

export async function extractDocumentText(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const extension = path.extname(fileName).toLowerCase();

  switch (extension) {
    case ".pdf": {
      const result = await extractPdfText(
        new Uint8Array(buffer)
      );

      return result.text.join("\n");
    }

    case ".docx": {
      const result = await mammoth.extractRawText({
        buffer,
      });

      return result.value;
    }

    case ".txt":
    case ".md": {
      return buffer.toString("utf-8");
    }

    default:
      throw new Error(
        `Unsupported document format: ${extension}`
      );
  }
}