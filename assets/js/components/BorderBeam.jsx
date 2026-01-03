import React from 'react';
import { motion } from 'motion/react';

/**
 * BorderBeam - An animated beam of light traveling along the border
 * Based on MagicUI's border-beam component
 */
export function BorderBeam({
  className = '',
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = '#ff6b35',
  colorTo = '#ffc107',
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}) {
  return (
    <div
      className={`tpu-border-beam ${className}`}
      style={{
        '--border-beam-width': `${borderWidth}px`,
      }}
    >
      <motion.div
        className="tpu-border-beam__light"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
        }}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay: -delay,
        }}
      />
    </div>
  );
}

export default BorderBeam;

