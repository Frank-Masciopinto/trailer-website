import React, { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import { GradientText } from './GradientText';

/**
 * CountUpWithGradient - Animated counter with gradient text effect
 * Based on reactbits pattern of wrapping CountUp with GradientText
 * 
 * @param {Object} props
 * @param {number} props.end - Target number to count to
 * @param {number} props.start - Starting number (default: 0)
 * @param {number} props.duration - Animation duration in seconds (default: 2.5)
 * @param {string} props.suffix - Text to append after number (e.g., '+', '%')
 * @param {boolean} props.enableScrollSpy - Start animation when in viewport
 * @param {number} props.scrollSpyDelay - Delay before starting after in view
 * @param {string} props.from - Gradient start color
 * @param {string} props.via - Gradient middle color
 * @param {string} props.to - Gradient end color
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.decimals - Number of decimal places
 * @param {string} props.separator - Thousands separator (default: ',')
 */
export function CountUpWithGradient({
  end,
  start = 0,
  duration = 2.5,
  suffix = '',
  enableScrollSpy = true,
  scrollSpyDelay = 0,
  scrollSpyOnce = true,
  from = '#FF6B35',
  via = '#FFB347',
  to = '#FF6B35',
  className = '',
  decimals = 0,
  separator = ',',
  animateGradient = true,
  gradientSpeed = 3,
}) {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!enableScrollSpy) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsInView(true);
            }, scrollSpyDelay);
            if (scrollSpyOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!scrollSpyOnce) {
            setIsInView(false);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px',
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [enableScrollSpy, scrollSpyDelay, scrollSpyOnce]);

  return (
    <span ref={elementRef} className={`tpu-countup-gradient ${className}`}>
      <GradientText
        from={from}
        via={via}
        to={to}
        animate={animateGradient}
        animationSpeed={gradientSpeed}
      >
        {isInView ? (
          <CountUp
            start={start}
            end={end}
            duration={duration}
            separator={separator}
            decimals={decimals}
            preserveValue
          />
        ) : (
          start.toLocaleString()
        )}
      </GradientText>
      {suffix && (
        <GradientText
          from={from}
          via={via}
          to={to}
          animate={animateGradient}
          animationSpeed={gradientSpeed}
          className="tpu-countup-gradient__suffix"
        >
          {suffix}
        </GradientText>
      )}
    </span>
  );
}

export default CountUpWithGradient;

