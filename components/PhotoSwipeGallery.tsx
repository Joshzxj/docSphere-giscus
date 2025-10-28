'use client';

import { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import Image from 'next/image';
import type { Photo } from '@/lib/albums';

interface PhotoSwipeGalleryProps {
  photos: Photo[];
  albumId: string;
}

export default function PhotoSwipeGallery({ photos, albumId }: PhotoSwipeGalleryProps) {
  useEffect(() => {
    let lightbox: PhotoSwipeLightbox | null = new PhotoSwipeLightbox({
      gallery: `#gallery-${albumId}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),
      // Responsive padding
      paddingFn: (viewportSize) => {
        return {
          top: 30,
          bottom: 30,
          left: Math.min(viewportSize.x * 0.1, 100),
          right: Math.min(viewportSize.x * 0.1, 100),
        };
      },
      // Show image caption
      imageClickAction: 'next',
      tapAction: 'next',
    });

    // Add caption plugin
    lightbox.on('uiRegister', function() {
      lightbox?.pswp?.ui?.registerElement({
        name: 'caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: '',
        onInit: (el) => {
          lightbox?.pswp?.on('change', () => {
            const currSlideElement = lightbox?.pswp?.currSlide?.data?.element;
            let captionHTML = '';

            if (currSlideElement) {
              const title = currSlideElement.getAttribute('data-title');
              const description = currSlideElement.getAttribute('data-description');

              if (title || description) {
                captionHTML = '<div class="pswp__caption-content">';
                if (title) {
                  captionHTML += `<h3 class="text-lg font-semibold">${title}</h3>`;
                }
                if (description) {
                  captionHTML += `<p class="text-sm mt-1">${description}</p>`;
                }
                captionHTML += '</div>';
              }
            }

            el.innerHTML = captionHTML;
          });
        },
      });
    });

    lightbox.init();

    return () => {
      lightbox?.destroy();
      lightbox = null;
    };
  }, [albumId]);

  return (
    <div
      id={`gallery-${albumId}`}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {photos.map((photo) => (
        <a
          key={photo.id}
          href={photo.fullUrl}
          data-pswp-width={photo.width}
          data-pswp-height={photo.height}
          data-title={photo.title}
          data-description={photo.description}
          target="_blank"
          rel="noreferrer"
          className="block aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity group relative"
        >
          <Image
            src={photo.thumbnailUrl}
            alt={photo.title || photo.filename}
            width={400}
            height={400}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
            placeholder={photo.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={photo.blurDataURL}
          />
          {photo.title && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="text-sm font-medium line-clamp-2">{photo.title}</p>
              </div>
            </div>
          )}
        </a>
      ))}
    </div>
  );
}
