import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '../lib/utils';

/**
 * Carousel - Image carousel component based on shadcn/ui
 * Built on Embla Carousel
 */

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

const Carousel = React.forwardRef(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback((api) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setSelectedIndex(api.selectedScrollSnap());
    }, []);

    const scrollPrev = useCallback(() => {
      emblaApi?.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
      emblaApi?.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
      (index) => {
        emblaApi?.scrollTo(index);
      },
      [emblaApi]
    );

    const handleKeyDown = useCallback(
      (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    useEffect(() => {
      if (!emblaApi || !setApi) return;
      setApi(emblaApi);
    }, [emblaApi, setApi]);

    useEffect(() => {
      if (!emblaApi) return;
      onSelect(emblaApi);
      emblaApi.on('reInit', onSelect);
      emblaApi.on('select', onSelect);

      return () => {
        emblaApi.off('select', onSelect);
      };
    }, [emblaApi, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          emblaRef,
          emblaApi,
          canScrollPrev,
          canScrollNext,
          scrollPrev,
          scrollNext,
          scrollTo,
          selectedIndex,
          orientation,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('tpu-carousel', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { emblaRef, orientation } = useCarousel();

  return (
    <div ref={emblaRef} className="tpu-carousel__viewport">
      <div
        ref={ref}
        className={cn(
          'tpu-carousel__content',
          orientation === 'horizontal'
            ? 'tpu-carousel__content--horizontal'
            : 'tpu-carousel__content--vertical',
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'tpu-carousel__item',
        orientation === 'horizontal'
          ? 'tpu-carousel__item--horizontal'
          : 'tpu-carousel__item--vertical',
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <button
        ref={ref}
        className={cn(
          'tpu-carousel__button',
          'tpu-carousel__button--prev',
          orientation === 'horizontal'
            ? 'tpu-carousel__button--horizontal-prev'
            : 'tpu-carousel__button--vertical-prev',
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        aria-label="Previous slide"
        {...props}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {orientation === 'horizontal' ? (
            <path d="m15 18-6-6 6-6" />
          ) : (
            <path d="m18 15-6-6-6 6" />
          )}
        </svg>
      </button>
    );
  }
);
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <button
        ref={ref}
        className={cn(
          'tpu-carousel__button',
          'tpu-carousel__button--next',
          orientation === 'horizontal'
            ? 'tpu-carousel__button--horizontal-next'
            : 'tpu-carousel__button--vertical-next',
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        aria-label="Next slide"
        {...props}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {orientation === 'horizontal' ? (
            <path d="m9 18 6-6-6-6" />
          ) : (
            <path d="m6 9 6 6 6-6" />
          )}
        </svg>
      </button>
    );
  }
);
CarouselNext.displayName = 'CarouselNext';

const CarouselDots = React.forwardRef(({ className, ...props }, ref) => {
  const { emblaApi, selectedIndex, scrollTo } = useCarousel();
  const [scrollSnaps, setScrollSnaps] = useState([]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  return (
    <div
      ref={ref}
      className={cn('tpu-carousel__dots', className)}
      role="tablist"
      aria-label="Slides"
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          className={cn(
            'tpu-carousel__dot',
            index === selectedIndex && 'tpu-carousel__dot--active'
          )}
          onClick={() => scrollTo(index)}
          role="tab"
          aria-selected={index === selectedIndex}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
});
CarouselDots.displayName = 'CarouselDots';

const CarouselThumbnails = React.forwardRef(
  ({ className, images = [], ...props }, ref) => {
    const { selectedIndex, scrollTo } = useCarousel();

    return (
      <div
        ref={ref}
        className={cn('tpu-carousel__thumbnails', className)}
        role="tablist"
        aria-label="Image thumbnails"
        {...props}
      >
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              'tpu-carousel__thumbnail',
              index === selectedIndex && 'tpu-carousel__thumbnail--active'
            )}
            onClick={() => scrollTo(index)}
            role="tab"
            aria-selected={index === selectedIndex}
            aria-label={`View image ${index + 1}`}
          >
            <img
              src={image.thumbnail || image.src}
              alt={image.alt || `Thumbnail ${index + 1}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>
    );
  }
);
CarouselThumbnails.displayName = 'CarouselThumbnails';

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselThumbnails,
  useCarousel,
};

