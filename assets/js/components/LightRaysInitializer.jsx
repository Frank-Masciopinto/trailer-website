/**
 * LightRaysInitializer
 * Mounts LightRays background on sections with data-light-rays attribute
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import LightRays from './LightRays';

/**
 * Initialize LightRays backgrounds on all matching sections
 */
export function initializeLightRays() {
    // Find all sections with data-light-rays attribute
    const sections = document.querySelectorAll('[data-light-rays]');

    sections.forEach((section) => {
        if (section.dataset.lightRaysInitialized) return;

        // Create a container for the LightRays effect
        const container = document.createElement('div');
        container.className = 'light-rays-wrapper';
        container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;

        // Ensure section has relative positioning
        const sectionStyle = getComputedStyle(section);
        if (sectionStyle.position === 'static') {
            section.style.position = 'relative';
        }

        // Insert at the beginning of the section
        section.insertBefore(container, section.firstChild);

        // Get configuration from data attributes
        const config = {
            raysOrigin: section.dataset.raysOrigin || 'top-center',
            raysColor: section.dataset.raysColor || '#ff6b35',
            raysSpeed: parseFloat(section.dataset.raysSpeed) || 0.8,
            lightSpread: parseFloat(section.dataset.lightSpread) || 1.2,
            rayLength: parseFloat(section.dataset.rayLength) || 2.5,
            pulsating: section.dataset.pulsating === 'true',
            fadeDistance: parseFloat(section.dataset.fadeDistance) || 1.0,
            saturation: parseFloat(section.dataset.saturation) || 0.8,
            followMouse: section.dataset.followMouse === 'true',
            mouseInfluence: parseFloat(section.dataset.mouseInfluence) || 0.05,
        };

        // Mount React component
        const root = createRoot(container);
        root.render(<LightRays {...config} />);

        section.dataset.lightRaysInitialized = 'true';
    });
}

/**
 * Initialize with IntersectionObserver for lazy loading
 */
export function initializeLightRaysLazy() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    if (!section.dataset.lightRaysInitialized) {
                        initializeSingleLightRays(section);
                    }
                    observer.unobserve(section);
                }
            });
        },
        {
            rootMargin: '100px',
            threshold: 0.1,
        }
    );

    document.querySelectorAll('[data-light-rays]').forEach((section) => {
        observer.observe(section);
    });
}

function initializeSingleLightRays(section) {
    if (section.dataset.lightRaysInitialized) return;

    const container = document.createElement('div');
    container.className = 'light-rays-wrapper';
    container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;

    const sectionStyle = getComputedStyle(section);
    if (sectionStyle.position === 'static') {
        section.style.position = 'relative';
    }

    section.insertBefore(container, section.firstChild);

    const config = {
        raysOrigin: section.dataset.raysOrigin || 'top-center',
        raysColor: section.dataset.raysColor || '#ff6b35',
        raysSpeed: parseFloat(section.dataset.raysSpeed) || 0.8,
        lightSpread: parseFloat(section.dataset.lightSpread) || 1.2,
        rayLength: parseFloat(section.dataset.rayLength) || 2.5,
        pulsating: section.dataset.pulsating === 'true',
        fadeDistance: parseFloat(section.dataset.fadeDistance) || 1.0,
        saturation: parseFloat(section.dataset.saturation) || 0.8,
        followMouse: section.dataset.followMouse === 'true',
        mouseInfluence: parseFloat(section.dataset.mouseInfluence) || 0.05,
    };

    const root = createRoot(container);
    root.render(<LightRays {...config} />);

    section.dataset.lightRaysInitialized = 'true';
}

