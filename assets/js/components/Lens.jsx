/**
 * Lens Component - Magic UI
 * An interactive component that enables zooming into images on hover
 * Pure CSS approach for better compatibility
 */

import React, { useCallback, useRef, useState } from 'react';
import { cn } from './lib/utils';

export function Lens({
    children,
    zoomFactor = 1.8,
    lensSize = 140,
    ariaLabel = 'Zoom Area',
    className,
    style,
}) {
    const [isHovering, setIsHovering] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        // Use the container ref to get consistent positioning
        const container = containerRef.current;
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    const { x, y } = mousePosition;
    const radius = lensSize / 2;
    
    // Mask for the circular lens
    const maskImageValue = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 100%, transparent 100%)`;

    // Clamp ring position to stay within container bounds
    const clampedX = Math.max(radius, Math.min(x, 200));
    const clampedY = Math.max(radius, Math.min(y, 200));

    return (
        <div
            ref={containerRef}
            className={cn('relative z-20 rounded-xl', className)}
            style={{ 
                ...style, 
                overflow: 'visible',
                cursor: isHovering ? 'none' : 'zoom-in', // Hide cursor when lens is active
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            role="region"
            aria-label={ariaLabel}
            tabIndex={0}
        >
            {/* Event capture layer - covers entire container area */}
            <div 
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    // Use a 1x1 transparent image to ensure this div captures mouse events
                    background: 'url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")',
                    cursor: 'inherit',
                }}
                onMouseMove={handleMouseMove}
            />
            {/* Children rendered below the event layer - fills container */}
            <div style={{ 
                position: 'relative', 
                zIndex: 2, 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
            }}>
                {children}
            </div>
            {/* Lens overlay - shows zoomed content in circular mask */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    opacity: isHovering ? 1 : 0,
                    transition: 'opacity 0.15s ease-out',
                    zIndex: 100, // Above the event capture layer
                    borderRadius: 'inherit',
                    maskImage: maskImageValue,
                    WebkitMaskImage: maskImageValue,
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        transform: `scale(${zoomFactor})`,
                        transformOrigin: `${x}px ${y}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {children}
                </div>
            </div>
            {/* Lens border ring - always visible circle at cursor */}
            <div
                style={{
                    position: 'absolute',
                    width: lensSize,
                    height: lensSize,
                    borderRadius: '50%',
                    border: '3px solid rgba(255, 107, 53, 0.9)',
                    boxShadow: '0 0 25px rgba(255, 107, 53, 0.5), 0 0 10px rgba(255, 107, 53, 0.3), inset 0 0 15px rgba(255, 107, 53, 0.2)',
                    background: 'rgba(255, 107, 53, 0.05)',
                    pointerEvents: 'none',
                    opacity: isHovering ? 1 : 0,
                    transition: 'opacity 0.15s ease-out',
                    zIndex: 101, // Above the overlay
                    left: x - radius,
                    top: y - radius,
                    transform: 'translateZ(0)', // Force GPU acceleration
                }}
            />
        </div>
    );
}

export default Lens;

