import React, { useCallback, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';

/**
 * MagicCard - A spotlight effect that follows mouse cursor
 * Based on MagicUI's magic-card component
 */
export function MagicCard({
  children,
  className = '',
  gradientSize = 200,
  gradientColor = '#262626',
  gradientOpacity = 0.8,
  gradientFrom = '#ff6b35',
  gradientTo = '#ffc107',
}) {
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const reset = useCallback(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [gradientSize, mouseX, mouseY]);

  const handlePointerMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const handleGlobalPointerOut = (e) => {
      if (!e.relatedTarget) {
        reset();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') {
        reset();
      }
    };

    window.addEventListener('pointerout', handleGlobalPointerOut);
    window.addEventListener('blur', reset);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('pointerout', handleGlobalPointerOut);
      window.removeEventListener('blur', reset);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
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
      className={`tpu-magic-card group ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerEnter={reset}
    >
      {/* Border gradient that follows mouse */}
      <motion.div
        className="tpu-magic-card__border"
        style={{ background }}
      />
      
      {/* Inner background */}
      <div className="tpu-magic-card__bg" />
      
      {/* Spotlight effect on hover */}
      <motion.div
        className="tpu-magic-card__spotlight"
        style={{
          background: spotlightBackground,
          opacity: gradientOpacity,
        }}
      />
      
      {/* Content */}
      <div className="tpu-magic-card__content">
        {children}
      </div>
    </div>
  );
}

export default MagicCard;

