import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Camera } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Photo Gallery - Beautiful Memories",
  description: "A modern photo gallery built with Next.js 15, PhotoSwipe, and Cloudflare R2",
  keywords: ["photo gallery", "photography", "images", "portfolio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
            <div className="container mx-auto px-4 py-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
                <Camera className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Photo Gallery</h1>
              </Link>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t mt-auto">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
              <p>
                Built with{" "}
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  Next.js 15
                </a>
                {" "}&{" "}
                <a
                  href="https://photoswipe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  PhotoSwipe
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
