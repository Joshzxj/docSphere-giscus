# Modern Photo Gallery

A beautiful, high-performance photo gallery built with **Next.js 15**, **PhotoSwipe 5**, and **Cloudflare R2**. Features static site generation, optimized images, and a stunning fullscreen viewer experience.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Modern Tech Stack**: Built with Next.js 15 App Router and TypeScript
- **Blazing Fast**: Static site generation for instant page loads
- **Beautiful UI**: Responsive design with Tailwind CSS and shadcn/ui components
- **Fullscreen Gallery**: PhotoSwipe 5 integration for immersive photo viewing
- **Image Optimization**: Automatic generation of multiple sizes (thumbnail, medium, full)
- **Cloud Storage**: Cloudflare R2 for scalable, cost-effective image hosting
- **Mobile Friendly**: Fully responsive with touch gestures support
- **SEO Optimized**: Meta tags and Open Graph support for each album
- **Zero Runtime Cost**: Pre-generated images eliminate transformation costs

## Demo

The gallery includes three sample albums:
- **Nature Landscapes**: 12 stunning scenic photographs
- **Urban Architecture**: 8 modern cityscapes
- **Wildlife Moments**: 6 captivating animal photos

## Architecture

```
photo-gallery/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page - Album grid
│   ├── album/[albumId]/page.tsx  # Album detail - Photo grid
│   ├── layout.tsx                # Root layout with header/footer
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles + PhotoSwipe customization
├── components/
│   ├── AlbumCard.tsx             # Album thumbnail card
│   ├── PhotoSwipeGallery.tsx     # PhotoSwipe wrapper component
│   └── ui/                       # shadcn/ui components
│       ├── card.tsx
│       ├── button.tsx
│       └── badge.tsx
├── lib/
│   ├── albums.ts                 # Album data & type definitions
│   ├── r2-client.ts              # Cloudflare R2 client setup
│   ├── image-optimizer.ts        # Sharp image processing
│   └── utils.ts                  # Utility functions
├── scripts/
│   └── generate-metadata.ts      # Image processing script
└── public/
    └── albums/                   # Local image storage (optional)
```

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn** or **pnpm**
- **Cloudflare R2** account (optional, for production)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/photo-gallery.git
cd photo-gallery
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your Cloudflare R2 credentials:

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=photo-gallery
R2_ENDPOINT=https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-bucket.r2.dev

# Next.js Public Variables
NEXT_PUBLIC_R2_DOMAIN=https://your-bucket.r2.dev
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the gallery.

## Usage

### Adding Your Own Photos

The gallery currently uses sample data from Unsplash. To add your own photos:

#### Option 1: Update the albums.ts file (Quick Start)

1. Edit `lib/albums.ts`
2. Update the `albums` array with your own data
3. Use your own image URLs (Unsplash, R2, or any CDN)

#### Option 2: Use the Image Processing Script (Production)

1. **Create an album directory:**

```bash
mkdir -p public/albums/my-vacation-2024
```

2. **Add your photos:**

```bash
cp ~/Photos/vacation/* public/albums/my-vacation-2024/
```

3. **Process and upload to R2:**

```bash
npm run process-images my-vacation-2024
```

This will:
- Generate 3 sizes: thumbnail (400px), medium (1200px), full (2400px)
- Upload to Cloudflare R2
- Create blur placeholders
- Generate `metadata.json` with all image data

4. **Update `lib/albums.ts`** with the generated metadata

### Album Structure

Each album should follow this TypeScript interface:

```typescript
interface Album {
  id: string;                    // Unique identifier
  title: string;                 // Album title
  description?: string;          // Optional description
  coverPhoto: Photo;             // Cover image
  photos: Photo[];               // Array of photos
  createdAt: string;             // ISO date string
  photoCount: number;            // Total photos
}

interface Photo {
  id: string;                    // Unique identifier
  filename: string;              // Original filename
  title?: string;                // Optional title
  description?: string;          // Optional description
  width: number;                 // Original width
  height: number;                // Original height
  thumbnailUrl: string;          // 400px URL
  mediumUrl: string;             // 1200px URL
  fullUrl: string;               // Full-size URL
  blurDataURL?: string;          // Base64 blur placeholder
}
```

## Deployment

### Vercel (Recommended)

1. **Push to GitHub:**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel:**

```bash
npm i -g vercel
vercel --prod
```

3. **Set environment variables** in Vercel dashboard

### Cloudflare Pages

1. **Build the static site:**

```bash
npm run build
```

2. **Deploy to Cloudflare Pages:**

```bash
npx wrangler pages deploy out
```

### Static Export (Any CDN)

Enable static export in `next.config.js`:

```javascript
module.exports = {
  output: 'export',
  // ... other config
};
```

Build and deploy:

```bash
npm run build
# Deploy the 'out' directory to any static host
```

## Configuration

### Image Sizes

Edit `lib/image-optimizer.ts` to customize image sizes:

```typescript
export const IMAGE_SIZES: ImageSize[] = [
  { name: "thumbnail", width: 400, quality: 85 },
  { name: "medium", width: 1200, quality: 90 },
  { name: "full", width: 2400, quality: 95 },
];
```

### PhotoSwipe Customization

Customize the gallery viewer in `components/PhotoSwipeGallery.tsx`:

```typescript
const lightbox = new PhotoSwipeLightbox({
  gallery: `#gallery-${albumId}`,
  children: 'a',
  // Add custom options here
  bgOpacity: 0.9,
  showHideAnimationType: 'fade',
});
```

### Styling

- **Colors**: Edit `app/globals.css` for theme customization
- **Components**: Modify `components/ui/*` for component styles
- **Layout**: Update `app/layout.tsx` for header/footer

## Performance

### Optimization Strategies

1. **Static Generation**: All pages pre-rendered at build time
2. **Image Optimization**: Next.js Image component with automatic WebP/AVIF
3. **Code Splitting**: Automatic route-based code splitting
4. **Lazy Loading**: PhotoSwipe loaded on-demand
5. **CDN Distribution**: Deploy to global CDN for fast worldwide access

### Lighthouse Scores

Target scores:
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## Cost Estimate

### Free Tier

- **Hosting**: Free on Vercel/Cloudflare Pages
- **R2 Storage**: First 10GB free
- **Bandwidth**: 10M requests/month free

### Estimated Costs (100 albums, 10,000 photos, 10GB)

- **Cloudflare R2**: $0.50-2/month (storage + operations)
- **Hosting**: $0 (using free tier)
- **Total**: ~$1-2/month

## Roadmap

- [ ] Image upload interface (admin dashboard)
- [ ] Album creation UI
- [ ] Photo tagging and search
- [ ] EXIF data display
- [ ] Comments and likes
- [ ] Print ordering integration
- [ ] Video support
- [ ] Password-protected albums

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| [Next.js](https://nextjs.org) | React Framework | 15.0 |
| [TypeScript](https://typescriptlang.org) | Type Safety | 5.6 |
| [PhotoSwipe](https://photoswipe.com) | Fullscreen Gallery | 5.4 |
| [Tailwind CSS](https://tailwindcss.com) | Styling | 3.4 |
| [shadcn/ui](https://ui.shadcn.com) | UI Components | Latest |
| [Cloudflare R2](https://cloudflare.com/r2) | Object Storage | - |
| [Sharp](https://sharp.pixelplumbing.com) | Image Processing | 0.33 |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Sample images from [Unsplash](https://unsplash.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Gallery viewer by [PhotoSwipe](https://photoswipe.com)

## Support

For issues and questions:
- Open an [issue](https://github.com/yourusername/photo-gallery/issues)
- Check the [documentation](https://github.com/yourusername/photo-gallery/wiki)

---

**Built with ❤️ using Next.js 15 and PhotoSwipe**
