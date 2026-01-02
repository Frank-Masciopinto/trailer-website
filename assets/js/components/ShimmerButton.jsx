import React from 'react';

/**
 * ShimmerButton - A button with a shimmering light effect
 * Inspired by Magic UI's shimmer-button
 */
export function ShimmerButton({
    children,
    className = '',
    shimmerColor = '#ff6b35',
    background = 'rgba(255, 107, 53, 1)',
    borderRadius = '8px',
    href = '#',
    onClick,
    ...props
}) {
    const styles = {
        '--shimmer-color': shimmerColor,
        '--bg': background,
        '--radius': borderRadius,
    };

    const buttonClasses = `
        tpu-shimmer-btn
        group relative z-0 flex cursor-pointer items-center justify-center 
        overflow-hidden border border-white/10 px-6 py-3 
        whitespace-nowrap text-white font-semibold uppercase tracking-wide
        transform-gpu transition-transform duration-300 ease-in-out 
        hover:scale-105 active:scale-95
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const content = (
        <>
            {/* Shimmer effect container */}
            <div className="tpu-shimmer-btn__shimmer">
                <div className="tpu-shimmer-btn__shimmer-inner" />
            </div>
            
            {/* Button content */}
            <span className="tpu-shimmer-btn__content">
                {children}
            </span>
            
            {/* Highlight overlay */}
            <div className="tpu-shimmer-btn__highlight" />
            
            {/* Background */}
            <div className="tpu-shimmer-btn__bg" />
        </>
    );

    if (href && href !== '#') {
        return (
            <a href={href} className={buttonClasses} style={styles} {...props}>
                {content}
            </a>
        );
    }

    return (
        <button className={buttonClasses} style={styles} onClick={onClick} {...props}>
            {content}
        </button>
    );
}

export default ShimmerButton;

