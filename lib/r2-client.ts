import { S3Client } from "@aws-sdk/client-s3";

// Initialize R2 client for Cloudflare R2 storage
export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

// Helper function to generate image URLs
export function getImageUrl(
  albumId: string,
  filename: string,
  size: "thumbnail" | "medium" | "full"
): string {
  const baseUrl = process.env.NEXT_PUBLIC_R2_DOMAIN;

  if (!baseUrl) {
    console.warn("R2_DOMAIN not configured, using placeholder");
    return `https://via.placeholder.com/800x600?text=${filename}`;
  }

  const path = `albums/${albumId}/${size}/${filename}`;
  return `${baseUrl}/${path}`;
}

// Helper function for Cloudflare Image Transformations (if enabled)
export function getTransformedImageUrl(
  albumId: string,
  filename: string,
  size: "thumbnail" | "medium" | "full"
): string {
  const sizeParams = {
    thumbnail: "width=400,quality=85,fit=cover",
    medium: "width=1200,quality=90",
    full: "width=2400,quality=95",
  };

  const baseUrl = process.env.NEXT_PUBLIC_R2_DOMAIN;
  const path = `albums/${albumId}/${filename}`;

  return `${baseUrl}/cdn-cgi/image/${sizeParams[size]}/${path}`;
}
