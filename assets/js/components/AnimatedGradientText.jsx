import React from 'react';

/**
 * AnimatedGradientText - Text with an animated gradient background
 * Based on Magic UI's animated-gradient-text component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Text content
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.speed - Animation speed multiplier (default: 1)
 * @param {string} props.colorFrom - Starting gradient color
 * @param {string} props.colorTo - Ending gradient color
 * @param {string} props.as - Element type to render (default: 'span')
 */
export function AnimatedGradientText({
  children,
  className = '',
  speed = 1,
  colorFrom = '#FF6B35', // TPU orange accent
  colorTo = '#FF9F1C',   // Lighter orange/gold
  as: Component = 'span',
  ...props
}) {
  return (
    <Component
      className={`tpu-gradient-text ${className}`}
      style={{
        '--gradient-speed': `${speed * 3}s`,
        '--color-from': colorFrom,
        '--color-to': colorTo,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

export default AnimatedGradientText;

