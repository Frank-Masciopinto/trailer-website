import React from 'react';

/**
 * GradientText - Animated gradient text component
 * Based on reactbits GradientText for wrapping CountUp and other content
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display with gradient
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.from - Starting gradient color
 * @param {string} props.via - Middle gradient color (optional)
 * @param {string} props.to - Ending gradient color
 * @param {number} props.animationSpeed - Speed of gradient animation in seconds
 * @param {boolean} props.animate - Whether to animate the gradient
 */
export function GradientText({
  children,
  className = '',
  from = '#FF6B35', // TPU orange
  via = '#FFB347', // Light orange/gold
  to = '#FF6B35',  // TPU orange
  animationSpeed = 3,
  animate = true,
  ...props
}) {
  const gradientStyle = {
    background: via 
      ? `linear-gradient(90deg, ${from}, ${via}, ${to}, ${via}, ${from})`
      : `linear-gradient(90deg, ${from}, ${to}, ${from})`,
    backgroundSize: animate ? '200% 100%' : '100% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: animate ? `gradient-flow ${animationSpeed}s ease-in-out infinite` : 'none',
    display: 'inline-block',
  };

  return (
    <span
      className={`tpu-gradient-counter ${className}`}
      style={gradientStyle}
      {...props}
    >
      {children}
    </span>
  );
}

export default GradientText;

