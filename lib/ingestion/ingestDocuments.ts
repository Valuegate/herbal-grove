import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { downloadDocument } from "./downloadDocuments";
import { extractText } from "../pdf/extractText";
import { extractHerbs } from "./extractHerbs";
import { cleanExtractedText } from "../pdf/formattedText"
import { saveHerbs } from "./saveHerbs";
import { saveChunks } from "./saveChunks";

export async function ingestDocument( convex: ConvexHttpClient, documentId: Id<"documents"> ) {
  const document = await convex.query(
    api.documents.getDocumentById,
    {
      id: documentId,
    }
  );

  if (!document) {
    throw new Error("Document not found.");
  }

  await convex.mutation(
    api.documents.updateDocumentStatus,
    {
      id: document._id,
      ingestionStatus: "processing",
    }
  );

  try {
    console.log(`📄 Processing ${document.title}`);

    console.log("download pdf");
    const pdfBuffer = await downloadDocument( document.fileUrl );

    console.log("extract pdf");
    const rawText = await extractText( pdfBuffer );

    console.log("format text");
    const extractedText = cleanExtractedText( rawText );

    if (!extractedText.trim()) {
      throw new Error("No text extracted.");
    }

    console.log("extract herb");
    const herbs = await extractHerbs( extractedText );

    console.log(`🌱 Found ${herbs.length} herbs`);

    console.log("💾 Saving herbs...");

    await saveHerbs(
      convex,
      document._id,
      herbs
    );

    console.log("🧠 Creating embeddings...");
    const chunksProcessed =
      await saveChunks(
        convex,
        document._id,
        extractedText
      );

    await convex.mutation(
      api.documents.updateDocumentStatus,
      {
        id: document._id,
        ingestionStatus: "indexed",
      }
    );

    return {
      success: true,
      herbsFound: herbs.length,
      chunksProcessed,
    };

  } catch (error) {

    await convex.mutation(
      api.documents.updateDocumentStatus,
      {
        id: document._id,
        ingestionStatus: "failed",
      }
    );

    console.error(`Failed to ingest ${document.title}`, error);
    throw error;
  }
}