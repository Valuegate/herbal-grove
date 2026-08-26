import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary/client";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload a JPG, PNG, WEBP image, or PDF.",
        },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File is too large. Maximum file size is 10 MB.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "care-journal",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (!result) {
              reject(new Error("Cloudinary upload returned no result."));
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: upload.secure_url,
      publicId: upload.public_id,
      mimeType: file.type,
      originalFilename: file.name,
    });
  } catch (error) {
    console.error("Care journal upload error:", error);

    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}