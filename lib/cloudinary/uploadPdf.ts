import { Readable } from "stream";
import cloudinary from "./client";

export interface UploadPdfResult {
  publicId: string;
  secureUrl: string;
  originalFilename: string;
}

export async function uploadPdf(
  buffer: Buffer,
  fileName: string
): Promise<UploadPdfResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "research-papers",
        resource_type: "raw",
        public_id: fileName.replace(".pdf", ""),
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          originalFilename: result.original_filename,
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}