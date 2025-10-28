#!/usr/bin/env tsx

/**
 * Image Processing Script for Photo Gallery
 *
 * This script processes local images and uploads them to Cloudflare R2 in multiple sizes.
 * It generates optimized thumbnails, medium, and full-size versions of each image.
 *
 * Usage:
 *   npm run process-images
 *
 * Prerequisites:
 *   1. Set up environment variables in .env
 *   2. Place images in public/albums/<album-id>/
 *   3. Configure R2 bucket and credentials
 */

import fs from "fs";
import path from "path";
import { processAndUploadImage } from "../lib/image-optimizer";

interface ImageMetadata {
  id: string;
  filename: string;
  thumbnailUrl: string;
  mediumUrl: string;
  fullUrl: string;
  width: number;
  height: number;
  blurDataURL: string;
}

async function processAlbumImages(albumId: string): Promise<ImageMetadata[]> {
  const albumPath = path.join(process.cwd(), "public", "albums", albumId);

  // Check if album directory exists
  if (!fs.existsSync(albumPath)) {
    console.error(`❌ Album directory not found: ${albumPath}`);
    return [];
  }

  const files = fs.readdirSync(albumPath);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  console.log(`📸 Found ${imageFiles.length} images in album: ${albumId}`);

  const results: ImageMetadata[] = [];

  for (const filename of imageFiles) {
    try {
      console.log(`  Processing: ${filename}...`);

      const filePath = path.join(albumPath, filename);
      const buffer = fs.readFileSync(filePath);

      const processed = await processAndUploadImage(albumId, filename, buffer);

      results.push({
        id: path.parse(filename).name,
        filename,
        ...processed,
      });

      console.log(`  ✅ Uploaded: ${filename}`);
    } catch (error) {
      console.error(`  ❌ Error processing ${filename}:`, error);
    }
  }

  return results;
}

async function main() {
  console.log("🚀 Starting image processing...\n");

  // Check for required environment variables
  const requiredEnvVars = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "R2_PUBLIC_URL",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingEnvVars.forEach((varName) => console.error(`   - ${varName}`));
    console.error("\nPlease set these in your .env file");
    process.exit(1);
  }

  // Get album ID from command line argument or process all albums
  const albumId = process.argv[2];

  if (albumId) {
    // Process single album
    console.log(`Processing album: ${albumId}\n`);
    const results = await processAlbumImages(albumId);
    console.log(`\n✨ Processed ${results.length} images for album: ${albumId}`);

    // Save metadata to JSON file
    const outputPath = path.join(
      process.cwd(),
      "public",
      "albums",
      albumId,
      "metadata.json"
    );
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`📝 Metadata saved to: ${outputPath}`);
  } else {
    // Process all albums
    const albumsPath = path.join(process.cwd(), "public", "albums");

    if (!fs.existsSync(albumsPath)) {
      console.error(`❌ Albums directory not found: ${albumsPath}`);
      console.log("\nCreate the directory and add some images:");
      console.log("  mkdir -p public/albums/my-album");
      console.log("  cp your-photos/* public/albums/my-album/");
      process.exit(1);
    }

    const albums = fs
      .readdirSync(albumsPath)
      .filter((dir) =>
        fs.statSync(path.join(albumsPath, dir)).isDirectory()
      );

    if (albums.length === 0) {
      console.log("📂 No albums found. Create an album first:");
      console.log("  mkdir -p public/albums/my-album");
      console.log("  cp your-photos/* public/albums/my-album/");
      process.exit(0);
    }

    console.log(`Found ${albums.length} album(s)\n`);

    for (const album of albums) {
      const results = await processAlbumImages(album);

      // Save metadata
      const outputPath = path.join(albumsPath, album, "metadata.json");
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      console.log(`✅ Album complete: ${album} (${results.length} images)\n`);
    }

    console.log("✨ All albums processed successfully!");
  }
}

// Run the script
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
