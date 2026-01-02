/**
 * Lens Component - Magic UI
 * An interactive component that enables zooming into images on hover
 * Adapted from Magic UI for BigCommerce Stencil
 */

import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from './lib/utils';

export function Lens({
    children,
    zoomFactor = 1.5,
    lensSize = 150,
    isStatic = false,
    position = { x: 0, y: 0 },
    defaultPosition,
    duration = 0.1,
    lensColor = 'rgba(255, 255, 255, 0.98)',
    ariaLabel = 'Zoom Area',
    className,
    style,
}) {
    const [isHovering, setIsHovering] = useState(false);
    const [mousePosition, setMousePosition] = useState(position);
    const containerRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') setIsHovering(false);
    }, []);

    // Get current position for lens
    const getCurrentPosition = () => {
        if (isStatic) return position;
        if (defaultPosition && !isHovering) return defaultPosition;
        return mousePosition;
    };

    const currentPos = getCurrentPosition();
    const { x, y } = currentPos;
    const radius = lensSize / 2;
    
    // Create mask image as regular string
    const maskImageValue = `radial-gradient(circle ${radius}px at ${x}px ${y}px, ${lensColor} 100%, transparent 100%)`;

    return (
        <div
            ref={containerRef}
            className={cn('relative z-20 overflow-hidden rounded-xl', className)}
            style={style}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onKeyDown={handleKeyDown}
            role="region"
            aria-label={ariaLabel}
            tabIndex={0}
        >
            {children}
            <AnimatePresence>
                {(isHovering || isStatic || defaultPosition) && (
                    <motion.div
                        key="lens-overlay"
                        initial={{ opacity: 0, scale: 0.58 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration }}
                        className="absolute inset-0 overflow-hidden pointer-events-none"
                        style={{
                            maskImage: maskImageValue,
                            WebkitMaskImage: maskImageValue,
                            transformOrigin: `${x}px ${y}px`,
                            zIndex: 50,
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                transform: `scale(${zoomFactor})`,
                                transformOrigin: `${x}px ${y}px`,
                            }}
                        >
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Lens;

