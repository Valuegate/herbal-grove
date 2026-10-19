"use server";

import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";

import { uploadDocument as uploadToCloudinary } from "@/lib/cloudinary/uploadDocuments";
import { ingestDocument } from "@/lib/ingestion/ingestDocuments";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export async function uploadDocument(
  files: File[]
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  for (const file of files) {
    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    // Upload to Cloudinary
    const uploaded = await uploadToCloudinary(
      buffer,
      file.name
    );

    // Save document
    const documentId = await convex.mutation(
        api.documents.createDocument,
        {
          title: file.name.replace(
            /\.[^/.]+$/,
            ""
          ),

          originalFileName: file.name,

          uploadedBy: userId,

          storageProvider:
            "cloudinary",

          storageId:
            uploaded.publicId,

          fileUrl:
            uploaded.secureUrl,

          verificationStatus:
            "pending",

          ingestionStatus:
            "uploaded",
        }
      );

    // Begin ingestion
    await ingestDocument(
      convex,
      documentId
    );
  }

  return {
    success: true,
  };
}