import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Album } from "@/lib/albums";

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/album/${album.id}`} className="group">
      <Card className="overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={album.coverPhoto.mediumUrl}
            alt={album.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-1 line-clamp-1">
            {album.title}
          </h2>
          {album.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {album.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 text-sm text-muted-foreground">
          {album.photoCount} {album.photoCount === 1 ? "photo" : "photos"}
        </CardFooter>
      </Card>
    </Link>
  );
}
