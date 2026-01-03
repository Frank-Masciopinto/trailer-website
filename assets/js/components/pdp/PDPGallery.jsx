import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  useCarousel,
} from '../ui/Carousel';
import { Lens } from '../Lens';
import { cn } from '../lib/utils';
import { trackGalleryImageView } from './pdpAnalytics';

/**
 * PDPGallery - Product image gallery with carousel and zoom
 * Uses shadcn Carousel and MagicUI Lens for zoom effect
 */
export function PDPGallery({ images = [], productTitle = '' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [api, setApi] = useState(null);

  // Handle thumbnail click
  const handleThumbnailClick = useCallback(
    (index) => {
      setSelectedIndex(index);
      if (api) {
        api.scrollTo(index);
      }
      trackGalleryImageView(index);
    },
    [api]
  );

  // Handle carousel slide change
  const handleSlideChange = useCallback(() => {
    if (!api) return;
    const index = api.selectedScrollSnap();
    setSelectedIndex(index);
    trackGalleryImageView(index);
  }, [api]);

  // Subscribe to carousel events
  React.useEffect(() => {
    if (!api) return;
    api.on('select', handleSlideChange);
    return () => {
      api.off('select', handleSlideChange);
    };
  }, [api, handleSlideChange]);

  // Fallback for no images
  if (!images || images.length === 0) {
    return (
      <div className="tpu-pdp-gallery tpu-pdp-gallery--empty">
        <div className="tpu-pdp-gallery__placeholder">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tpu-pdp-gallery">
      {/* Main Image Carousel */}
      <div className="tpu-pdp-gallery__main">
        <Carousel
          opts={{
            loop: images.length > 1,
            align: 'start',
          }}
          setApi={setApi}
          className="tpu-pdp-gallery__carousel"
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div
                  className="tpu-pdp-gallery__image-wrapper"
                  onMouseEnter={() => setIsZooming(true)}
                  onMouseLeave={() => setIsZooming(false)}
                >
                  <Lens
                    zoomFactor={2}
                    lensSize={180}
                    isStatic={false}
                    hovering={isZooming && selectedIndex === index}
                  >
                    <img
                      src={image.src || image.data || image}
                      alt={image.alt || `${productTitle} - Image ${index + 1}`}
                      className="tpu-pdp-gallery__image"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchpriority={index === 0 ? 'high' : 'auto'}
                    />
                  </Lens>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <>
              <CarouselPrevious className="tpu-pdp-gallery__nav tpu-pdp-gallery__nav--prev" />
              <CarouselNext className="tpu-pdp-gallery__nav tpu-pdp-gallery__nav--next" />
            </>
          )}
        </Carousel>

        {/* Mobile dots indicator */}
        {images.length > 1 && (
          <div className="tpu-pdp-gallery__dots-mobile">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'tpu-pdp-gallery__dot',
                  index === selectedIndex && 'tpu-pdp-gallery__dot--active'
                )}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails - Desktop only */}
      {images.length > 1 && (
        <div className="tpu-pdp-gallery__thumbnails" role="tablist" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                'tpu-pdp-gallery__thumbnail',
                index === selectedIndex && 'tpu-pdp-gallery__thumbnail--active'
              )}
              onClick={() => handleThumbnailClick(index)}
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image.thumbnail || image.src || image.data || image}
                alt=""
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PDPGallery;

