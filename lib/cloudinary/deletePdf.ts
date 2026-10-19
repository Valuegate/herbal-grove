import "server-only";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function deletePdf(
  publicId: string
) {
  const result = await cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "raw",
    }
  );

  if (result.result !== "ok") {
    throw new Error(
      `Failed to delete Cloudinary file: ${result.result}`
    );
  }

  return result;
}