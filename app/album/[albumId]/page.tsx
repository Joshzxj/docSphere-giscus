import { albums, getAlbumById, getAllAlbumIds } from "@/lib/albums";
import PhotoSwipeGallery from "@/components/PhotoSwipeGallery";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface AlbumPageProps {
  params: {
    albumId: string;
  };
}

// Generate static params for all albums
export function generateStaticParams() {
  return getAllAlbumIds().map((albumId) => ({
    albumId,
  }));
}

// Generate metadata for each album
export async function generateMetadata({
  params,
}: AlbumPageProps): Promise<Metadata> {
  const album = getAlbumById(params.albumId);

  if (!album) {
    return {
      title: "Album Not Found",
    };
  }

  return {
    title: `${album.title} - Photo Gallery`,
    description: album.description || `View ${album.photoCount} photos in ${album.title}`,
    openGraph: {
      title: album.title,
      description: album.description,
      images: [album.coverPhoto.mediumUrl],
    },
  };
}

export default function AlbumPage({ params }: AlbumPageProps) {
  const album = getAlbumById(params.albumId);

  if (!album) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-block mb-6">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Albums
        </Button>
      </Link>

      {/* Album Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {album.title}
        </h1>

        {album.description && (
          <p className="text-lg text-muted-foreground mb-4">
            {album.description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            <span>
              {album.photoCount} {album.photoCount === 1 ? "photo" : "photos"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(album.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Photo Grid with PhotoSwipe */}
      <PhotoSwipeGallery photos={album.photos} albumId={album.id} />
    </div>
  );
}

// This page is statically generated at build time
export const dynamic = 'force-static';
