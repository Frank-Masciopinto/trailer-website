import React from 'react';

/**
 * AnimatedShinyText - A text component with a shimmering light effect
 * Inspired by Magic UI's animated-shiny-text component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Text content to animate
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.shimmerWidth - Width of the shimmer effect in pixels (default: 100)
 */
export function AnimatedShinyText({ 
  children, 
  className = '',
  shimmerWidth = 100,
  ...props 
}) {
  return (
    <span
      className={`tpu-shiny-text ${className}`}
      style={{ '--shiny-width': `${shimmerWidth}px` }}
      {...props}
    >
      {children}
    </span>
  );
}

export default AnimatedShinyText;

