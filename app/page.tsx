import { albums } from "@/lib/albums";
import AlbumCard from "@/components/AlbumCard";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Photo Gallery
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore stunning collections of photography from around the world.
          Click on any album to view the full gallery.
        </p>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>

      {/* Empty State */}
      {albums.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No albums found. Start by adding some photos!</p>
        </div>
      )}
    </div>
  );
}

// This page is statically generated at build time
export const dynamic = 'force-static';
