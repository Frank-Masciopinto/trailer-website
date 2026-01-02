import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

/**
 * ScrollProgress - Animated scroll progress bar
 * Inspired by Magic UI's scroll-progress component
 */
export function ScrollProgress({ className = '' }) {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className={`tpu-scroll-progress-react ${className}`}
            style={{
                scaleX,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #ff6b35, #ffc107, #ff6b35)',
                backgroundSize: '200% 100%',
                transformOrigin: 'left',
                zIndex: 9999,
            }}
        />
    );
}

export default ScrollProgress;

