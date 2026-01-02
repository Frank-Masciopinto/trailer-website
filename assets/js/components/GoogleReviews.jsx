/**
 * GoogleReviews - Social proof section with MagicUI components
 * Features: Marquee, NumberTicker, MagicCard for maximum conversion impact
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring, useInView } from 'motion/react';
import { BlurFade } from './BlurFade';
import { AnimatedShinyText } from './AnimatedShinyText';
import { cn } from './lib/utils';

// =============================================================================
// REVIEW DATA - Static reviews (easy to update later)
// =============================================================================

const reviews = [
  {
    id: 1,
    author: "Mike T.",
    avatar: "M",
    rating: 5,
    date: "2 weeks ago",
    text: "Best prices on trailer axles I've found anywhere. Ordered a Dexter axle kit and it arrived faster than expected. Will definitely be ordering again!",
    verified: true,
    location: "Texas"
  },
  {
    id: 2,
    author: "Sarah K.",
    avatar: "S",
    rating: 5,
    date: "1 month ago",
    text: "Outstanding customer service! Had questions about brake controller wiring and their team walked me through everything. Parts were exactly what I needed.",
    verified: true,
    location: "Florida"
  },
  {
    id: 3,
    author: "Robert J.",
    avatar: "R",
    rating: 5,
    date: "3 weeks ago",
    text: "Finally found a reliable source for trailer lights. The LED kit was easy to install and works perfectly. Great quality at reasonable prices.",
    verified: true,
    location: "Arizona"
  },
  {
    id: 4,
    author: "David M.",
    avatar: "D",
    rating: 5,
    date: "1 week ago",
    text: "Been buying trailer parts here for 3 years now. Never had a single issue. Fast shipping and the parts are always genuine quality.",
    verified: true,
    location: "Ohio"
  },
  {
    id: 5,
    author: "Jennifer L.",
    avatar: "J",
    rating: 5,
    date: "2 months ago",
    text: "Replaced all my hub bearings with parts from TPU. Easy ordering process, great prices, and everything fit perfectly. Highly recommend!",
    verified: true,
    location: "Georgia"
  },
  {
    id: 6,
    author: "Chris W.",
    avatar: "C",
    rating: 5,
    date: "4 weeks ago",
    text: "The go-to place for all trailer parts. I've compared prices everywhere and TPU consistently beats the competition. Plus their tech support is amazing.",
    verified: true,
    location: "Colorado"
  },
  {
    id: 7,
    author: "Amanda R.",
    avatar: "A",
    rating: 5,
    date: "5 days ago",
    text: "Quick delivery and excellent packaging. My coupler kit arrived in perfect condition. Already recommended to all my trailer-owning friends.",
    verified: true,
    location: "California"
  },
  {
    id: 8,
    author: "Tom H.",
    avatar: "T",
    rating: 5,
    date: "3 months ago",
    text: "Professional operation from start to finish. The electric brake kit was exactly as described and the installation guide they provided was super helpful.",
    verified: true,
    location: "Michigan"
  },
  {
    id: 9,
    author: "Lisa P.",
    avatar: "L",
    rating: 5,
    date: "2 weeks ago",
    text: "Five stars isn't enough! Found hard-to-find parts for my vintage trailer. Amazing selection and knowledgeable staff. Thank you TPU!",
    verified: true,
    location: "Tennessee"
  },
  {
    id: 10,
    author: "James B.",
    avatar: "J",
    rating: 4,
    date: "6 weeks ago",
    text: "Good selection and fair prices. Shipping was a bit slow during holidays but the parts were quality. Would order again.",
    verified: true,
    location: "Pennsylvania"
  }
];

// =============================================================================
// NUMBER TICKER - Animated counting component
// =============================================================================

function NumberTicker({
  value,
  startValue = 0,
  direction = 'up',
  delay = 0,
  className = '',
  decimalPlaces = 0,
  suffix = '',
  ...props
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? value : startValue);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const [displayValue, setDisplayValue] = useState(startValue);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === 'down' ? startValue : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction, startValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(
        Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)))
      );
    });
    return unsubscribe;
  }, [springValue, decimalPlaces]);

  return (
    <span
      ref={ref}
      className={cn('inline-block tracking-wider tabular-nums', className)}
      {...props}
    >
      {displayValue}{suffix}
    </span>
  );
}

// =============================================================================
// MARQUEE - Infinite scrolling container
// =============================================================================

// Inject marquee animation styles once
const marqueeStyleId = 'marquee-animation-styles';
if (typeof document !== 'undefined' && !document.getElementById(marqueeStyleId)) {
  const styleSheet = document.createElement('style');
  styleSheet.id = marqueeStyleId;
  styleSheet.textContent = `
    @keyframes marquee-scroll {
      from { transform: translateX(0); }
      to { transform: translateX(calc(-100% - 1.5rem)); }
    }
    .tpu-marquee-track {
      display: flex;
      flex-direction: row;
      flex-shrink: 0;
      gap: 1.5rem;
      animation: marquee-scroll 40s linear infinite;
    }
    .tpu-marquee-track--reverse {
      animation-direction: reverse;
    }
    .tpu-marquee-container:hover .tpu-marquee-track {
      animation-play-state: paused;
    }
  `;
  document.head.appendChild(styleSheet);
}

function Marquee({
  className = '',
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  const containerStyle = {
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row',
    overflow: 'hidden',
    padding: '0.5rem',
    gap: '1.5rem',
  };

  return (
    <div
      {...props}
      className={`tpu-marquee-container ${className}`}
      style={containerStyle}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`tpu-marquee-track ${reverse ? 'tpu-marquee-track--reverse' : ''}`}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

// =============================================================================
// MAGIC CARD - Card with spotlight hover effect
// =============================================================================

function MagicCard({
  children,
  className = '',
  style = {},
  gradientSize = 200,
  gradientColor = 'rgba(255, 107, 53, 0.15)',
  gradientOpacity = 0.8,
  gradientFrom = '#FF6B35',
  gradientTo = '#FFB347',
}) {
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);
  const [isHovered, setIsHovered] = useState(false);

  const reset = useCallback(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
    setIsHovered(false);
  }, [gradientSize, mouseX, mouseY]);

  const handlePointerMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  const background = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
    ${gradientFrom}, 
    ${gradientTo}, 
    transparent 100%
    )
  `;

  const spotlightBackground = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
  `;

  return (
    <div
      className={className}
      style={{ position: 'relative', borderRadius: '0.75rem', ...style }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerEnter={handlePointerEnter}
    >
      {/* Animated border */}
      <motion.div
        style={{ 
          pointerEvents: 'none', 
          position: 'absolute', 
          inset: 0, 
          borderRadius: '0.75rem', 
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s',
          background 
        }}
      />
      {/* Card background */}
      <div style={{ position: 'absolute', inset: '1px', borderRadius: '11px', backgroundColor: '#1a1a1a' }} />
      {/* Spotlight effect */}
      <motion.div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: '1px',
          borderRadius: '11px',
          opacity: isHovered ? gradientOpacity : 0,
          transition: 'opacity 0.3s',
          background: spotlightBackground,
        }}
      />
      {/* Content */}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

// =============================================================================
// STAR RATING - Visual star display
// =============================================================================

function StarRating({ rating, size = 20, className = '' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className={className}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={i < rating ? '#facc15' : '#4b5563'}
          style={{ width: size, height: size, flexShrink: 0 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// =============================================================================
// GOOGLE ICON
// =============================================================================

function GoogleIcon({ size = 20, className = '' }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none"
      width={size}
      height={size}
      style={{ width: size, height: size, minWidth: size, minHeight: size, flexShrink: 0 }}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// =============================================================================
// REVIEW CARD - Individual review with MagicCard wrapper
// =============================================================================

function ReviewCard({ review }) {
  return (
    <MagicCard style={{ width: '340px', flexShrink: 0 }}>
      <div style={{ padding: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Avatar */}
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'linear-gradient(to bottom right, #FF6B35, #FFB347)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontWeight: 600, 
              fontSize: '0.875rem',
              flexShrink: 0
            }}>
              {review.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'white', fontWeight: 500, fontSize: '0.875rem' }}>{review.author}</span>
                {review.verified && (
                  <span style={{ color: '#22c55e', fontSize: '0.75rem' }}>✓ Verified</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                <span>{review.location}</span>
                <span>•</span>
                <span>{review.date}</span>
              </div>
            </div>
          </div>
          <GoogleIcon size={18} />
        </div>

        {/* Stars */}
        <div style={{ marginBottom: '0.75rem' }}>
          <StarRating rating={review.rating} size={14} />
        </div>

        {/* Review text */}
        <p style={{ 
          color: '#d1d5db', 
          fontSize: '0.875rem', 
          lineHeight: 1.6, 
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: 0
        }}>
          "{review.text}"
        </p>
      </div>
    </MagicCard>
  );
}

// =============================================================================
// MAIN COMPONENT - Google Reviews Section
// =============================================================================

export function GoogleReviews() {
  const googleMapsUrl = 'https://maps.app.goo.gl/y2D9AHfEfNPf8YEn6';

  return (
    <section className="tpu-section tpu-section--reviews py-16 overflow-hidden">
      <div className="tpu-container">
        {/* Section Header */}
        <BlurFade delay={0} direction="up" offset={15} blur="6px">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            {/* Trust Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', padding: '0.5rem 1rem', marginBottom: '1.5rem' }}>
              <GoogleIcon size={20} />
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 500 }}>Google Reviews</span>
            </div>

            {/* Main Stats */}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 700, color: 'white' }}>4.9</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ marginBottom: '0.25rem' }}>
                    <StarRating rating={5} size={20} />
                  </div>
                  <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>out of 5</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '4rem', backgroundColor: 'rgba(255,255,255,0.2)' }} />

              {/* Review Count */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#FF6B35' }}>
                  <NumberTicker value={803} delay={0.3} suffix="+" />
                </div>
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>5-Star Reviews</span>
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '4rem', backgroundColor: 'rgba(255,255,255,0.2)' }} />

              {/* Orders Delivered */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#22c55e' }}>
                  <NumberTicker value={500} delay={0.5} suffix="K+" />
                </div>
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Orders Delivered</span>
              </div>
            </div>

            {/* Subtitle */}
            <p style={{ color: '#9ca3af', fontSize: '1rem', maxWidth: '36rem', margin: '0 auto' }}>
              Trusted by trailer professionals across the nation for quality parts and exceptional service.
            </p>
          </div>
        </BlurFade>
      </div>

      {/* Review Marquee - Full width overflow */}
      <BlurFade delay={0.2} direction="up" offset={20} blur="8px">
        <div style={{ position: 'relative' }}>
          {/* Gradient fades on edges */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6rem', background: 'linear-gradient(to right, #0f0f0f, transparent)', zIndex: 10, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '6rem', background: 'linear-gradient(to left, #0f0f0f, transparent)', zIndex: 10, pointerEvents: 'none' }} />

          {/* First row - scrolls left */}
          <div style={{ marginBottom: '1rem' }}>
            <Marquee pauseOnHover>
              {reviews.slice(0, 5).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </Marquee>
          </div>

          {/* Second row - scrolls right (reversed) */}
          <Marquee pauseOnHover reverse>
            {reviews.slice(5).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </Marquee>
        </div>
      </BlurFade>

      {/* CTA Button */}
      <div className="tpu-container">
        <BlurFade delay={0.4} direction="up" offset={15} blur="6px">
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              <GoogleIcon size={20} />
              <span style={{ fontWeight: 500 }}>View All Reviews on Google</span>
              <svg
                width={16}
                height={16}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ flexShrink: 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

export default GoogleReviews;

