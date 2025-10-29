import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "./r2-client";

export interface ImageSize {
  name: string;
  width: number;
  quality: number;
}

export const IMAGE_SIZES: ImageSize[] = [
  { name: "thumbnail", width: 400, quality: 85 },
  { name: "medium", width: 1200, quality: 90 },
  { name: "full", width: 2400, quality: 95 },
];

export interface ProcessedImage {
  thumbnailUrl: string;
  mediumUrl: string;
  fullUrl: string;
  width: number;
  height: number;
  blurDataURL: string;
}

/**
 * Process an image buffer and upload to R2 in multiple sizes
 */
export async function processAndUploadImage(
  albumId: string,
  filename: string,
  buffer: Buffer
): Promise<ProcessedImage> {
  const metadata = await sharp(buffer).metadata();
  const results: Partial<ProcessedImage> = {
    width: metadata.width,
    height: metadata.height,
  };

  // Process and upload each size
  for (const size of IMAGE_SIZES) {
    const resized = await sharp(buffer)
      .resize(size.width, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({ quality: size.quality, progressive: true })
      .toBuffer();

    const key = `albums/${albumId}/${size.name}/${filename}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: resized,
        ContentType: "image/jpeg",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const url = `${process.env.R2_PUBLIC_URL}/${key}`;

    if (size.name === "thumbnail") {
      results.thumbnailUrl = url;
    } else if (size.name === "medium") {
      results.mediumUrl = url;
    } else if (size.name === "full") {
      results.fullUrl = url;
    }
  }

  // Generate blur placeholder
  const blurBuffer = await sharp(buffer)
    .resize(20, 20, { fit: "inside" })
    .blur()
    .jpeg({ quality: 50 })
    .toBuffer();

  results.blurDataURL = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;

  return results as ProcessedImage;
}

/**
 * Generate blur placeholder from image buffer
 */
export async function generateBlurPlaceholder(buffer: Buffer): Promise<string> {
  const blurBuffer = await sharp(buffer)
    .resize(20, 20, { fit: "inside" })
    .blur()
    .jpeg({ quality: 50 })
    .toBuffer();

  return `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;
}
