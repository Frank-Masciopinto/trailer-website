import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

/**
 * NumberTicker - Animate numbers counting up or down
 * Based on MagicUI's number-ticker component
 */
export function NumberTicker({
  value,
  startValue = 0,
  direction = 'up',
  delay = 0,
  className = '',
  decimalPlaces = 0,
  suffix = '',
  prefix = '',
  ...props
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? value : startValue);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '0px' });

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
      if (ref.current) {
        const formatted = Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)));
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [springValue, decimalPlaces, prefix, suffix]);

  return (
    <span
      ref={ref}
      className={`tpu-number-ticker ${className}`}
      {...props}
    >
      {prefix}{startValue}{suffix}
    </span>
  );
}

export default NumberTicker;

