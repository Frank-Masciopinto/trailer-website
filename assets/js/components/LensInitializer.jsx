/**
 * LensInitializer
 * Initializes Lens components on all product card images
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Lens } from './Lens';

/**
 * Single product image with Lens effect
 */
function ProductImageWithLens({ src, alt }) {
    return (
        <Lens
            zoomFactor={1.8}
            lensSize={140}
            lensColor="rgba(255, 255, 255, 0.98)"
        >
            <img
                src={src}
                alt={alt || 'Product image'}
                className="card-image"
            />
        </Lens>
    );
}

/**
 * Initialize Lens effect on all product card images
 * Call this function after the DOM is ready
 */
export function initializeLensImages() {
    // Only initialize in dark theme sections (where cards are displayed)
    const darkThemeContainers = document.querySelectorAll('.tpu-dark-theme');
    
    darkThemeContainers.forEach(container => {
        const imageContainers = container.querySelectorAll('[data-lens-image]');
        
        imageContainers.forEach(imgContainer => {
            const src = imgContainer.getAttribute('data-lens-src');
            const alt = imgContainer.getAttribute('data-lens-alt');
            
            // Skip if no image source or already initialized
            if (!src || imgContainer.hasAttribute('data-lens-initialized')) {
                return;
            }
            
            // Mark as initialized
            imgContainer.setAttribute('data-lens-initialized', 'true');
            
            // Clear existing content
            imgContainer.innerHTML = '';
            
            // Create and render React root
            try {
                const root = createRoot(imgContainer);
                root.render(
                    <ProductImageWithLens src={src} alt={alt} />
                );
            } catch (error) {
                console.warn('Failed to initialize Lens on image:', error);
                // Fallback: restore original image
                imgContainer.innerHTML = `<img src="${src}" alt="${alt || 'Product'}" class="card-image" />`;
            }
        });
    });
}

/**
 * Initialize Lens with intersection observer for lazy loading
 * Only mounts Lens components when images come into view
 */
export function initializeLensImagesLazy() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback to immediate initialization
        initializeLensImages();
        return;
    }
    
    const darkThemeContainers = document.querySelectorAll('.tpu-dark-theme');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const imgContainer = entry.target;
                const src = imgContainer.getAttribute('data-lens-src');
                const alt = imgContainer.getAttribute('data-lens-alt');
                
                if (src && !imgContainer.hasAttribute('data-lens-initialized')) {
                    imgContainer.setAttribute('data-lens-initialized', 'true');
                    imgContainer.innerHTML = '';
                    
                    try {
                        const root = createRoot(imgContainer);
                        root.render(
                            <ProductImageWithLens src={src} alt={alt} />
                        );
                    } catch (error) {
                        console.warn('Failed to initialize Lens on image:', error);
                        imgContainer.innerHTML = `<img src="${src}" alt="${alt || 'Product'}" class="card-image" />`;
                    }
                }
                
                // Stop observing this element
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '100px', // Start loading slightly before visible
        threshold: 0.1
    });
    
    darkThemeContainers.forEach(container => {
        const imageContainers = container.querySelectorAll('[data-lens-image]');
        imageContainers.forEach(imgContainer => {
            observer.observe(imgContainer);
        });
    });
}

export default initializeLensImages;

