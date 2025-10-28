# Setup Guide for Photo Gallery

This guide will walk you through setting up your photo gallery from scratch.

## Quick Start (5 minutes)

If you just want to see the gallery working with demo images:

```bash
npm install
npm run dev
```

Visit http://localhost:3000 - Done! The gallery will show sample images from Unsplash.

## Production Setup with Cloudflare R2 (30 minutes)

### Step 1: Create a Cloudflare R2 Bucket

1. Sign up for [Cloudflare](https://cloudflare.com) (free tier available)
2. Navigate to R2 Object Storage in your dashboard
3. Click "Create bucket"
4. Name your bucket (e.g., `photo-gallery`)
5. Click "Create bucket"

### Step 2: Get Your R2 Credentials

1. In your R2 dashboard, click "Manage R2 API Tokens"
2. Click "Create API token"
3. Select "Admin Read & Write" permissions
4. Copy your credentials:
   - Access Key ID
   - Secret Access Key
   - Account ID (from your dashboard URL)

### Step 3: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Fill in your R2 credentials in `.env`:

```env
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=photo-gallery
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-bucket.r2.dev
NEXT_PUBLIC_R2_DOMAIN=https://your-bucket.r2.dev
```

### Step 4: Enable Public Access to Your Bucket

1. Go to your bucket settings in Cloudflare dashboard
2. Click "Settings" tab
3. Under "Public access", click "Allow Access"
4. Copy your public bucket URL (e.g., `https://photo-gallery.YOUR_ACCOUNT.r2.dev`)
5. Update `R2_PUBLIC_URL` and `NEXT_PUBLIC_R2_DOMAIN` in your `.env` file

### Step 5: Add Your Photos

1. Create an album folder:

```bash
mkdir -p public/albums/my-first-album
```

2. Add your photos to the folder:

```bash
cp ~/Pictures/vacation-photos/*.jpg public/albums/my-first-album/
```

Supported formats: JPG, JPEG, PNG, WEBP

### Step 6: Process and Upload Images

Run the image processing script:

```bash
npm run process-images my-first-album
```

This will:
- Resize images to 3 sizes (thumbnail, medium, full)
- Optimize quality
- Upload to R2
- Generate metadata

### Step 7: Update Your Albums Data

1. Open `lib/albums.ts`
2. Check the generated `public/albums/my-first-album/metadata.json`
3. Add your album to the `albums` array:

```typescript
export const albums: Album[] = [
  {
    id: "my-first-album",
    title: "My Vacation 2024",
    description: "Amazing trip to the mountains",
    createdAt: "2024-03-20",
    photoCount: 25, // Number of photos
    coverPhoto: {
      // Copy from metadata.json - first photo
      id: "photo-1",
      filename: "IMG_001.jpg",
      title: "Mountain View",
      width: 1920,
      height: 1280,
      thumbnailUrl: "https://your-bucket.r2.dev/albums/my-first-album/thumbnail/IMG_001.jpg",
      mediumUrl: "https://your-bucket.r2.dev/albums/my-first-album/medium/IMG_001.jpg",
      fullUrl: "https://your-bucket.r2.dev/albums/my-first-album/full/IMG_001.jpg",
    },
    photos: [
      // Copy from metadata.json - all photos
    ],
  },
  // ... other albums
];
```

### Step 8: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 to see your gallery!

### Step 9: Deploy to Production

#### Option A: Deploy to Vercel (Recommended)

1. Push to GitHub:

```bash
git add .
git commit -m "Add my photo gallery"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables from your `.env` file
6. Click "Deploy"

Done! Your gallery is live at `https://your-project.vercel.app`

#### Option B: Deploy to Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy out
```

## Troubleshooting

### Images not loading in development

**Problem**: You see broken image icons

**Solution**:
1. Check your `.env` file has correct R2 credentials
2. Make sure `NEXT_PUBLIC_R2_DOMAIN` is set (must start with `NEXT_PUBLIC_`)
3. Restart your dev server after changing `.env`

### "Module not found" errors

**Problem**: Import errors when running the app

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Upload fails with "Access Denied"

**Problem**: Image processing script fails to upload

**Solution**:
1. Check your R2 API token has "Admin Read & Write" permissions
2. Verify your bucket name in `.env` matches your actual bucket
3. Make sure your R2_ENDPOINT uses your actual account ID

### PhotoSwipe not opening

**Problem**: Clicking photos doesn't open fullscreen viewer

**Solution**:
1. Clear browser cache
2. Check browser console for errors
3. Make sure PhotoSwipe CSS is imported in `PhotoSwipeGallery.tsx`

## Tips for Best Results

### Photo Recommendations

- **Format**: JPG or PNG (JPG recommended for smaller file sizes)
- **Resolution**: At least 1920x1280 for best quality
- **Orientation**: Mix of landscape and portrait works well
- **File size**: Original can be any size (script will optimize)

### Album Organization

- Keep 10-50 photos per album for best performance
- Use descriptive titles and descriptions
- Add dates to help organize chronologically
- Choose a compelling cover photo (usually the best photo)

### Performance Tips

- Run `npm run build` locally before deploying to catch errors
- Use Cloudflare's CDN features for global distribution
- Enable Cloudflare Image Transformations for on-the-fly resizing (optional)
- Consider pagination for albums with 100+ photos

## Next Steps

- Customize the design in `app/globals.css`
- Add more albums following Step 5-7
- Set up a custom domain in Vercel/Cloudflare
- Share your gallery with friends and family!

## Need Help?

- Check the main [README.md](README.md) for more details
- Open an issue on GitHub
- Review the [Next.js documentation](https://nextjs.org/docs)
- Check [PhotoSwipe documentation](https://photoswipe.com/getting-started/)
