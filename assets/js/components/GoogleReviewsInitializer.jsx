/**
 * GoogleReviewsInitializer
 * Initializes Google Reviews component on the homepage
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import GoogleReviews from './GoogleReviews';

/**
 * Initialize Google Reviews section
 * Call this function after the DOM is ready on the homepage
 */
export function initializeGoogleReviews() {
    const container = document.getElementById('google-reviews-root');
    
    if (!container) {
        return null;
    }
    
    // Check if already initialized
    if (container.hasAttribute('data-reviews-initialized')) {
        return null;
    }
    
    // Mark as initialized
    container.setAttribute('data-reviews-initialized', 'true');
    
    try {
        const root = createRoot(container);
        root.render(<GoogleReviews />);
        return root;
    } catch (error) {
        console.warn('Failed to initialize Google Reviews:', error);
        return null;
    }
}

export default initializeGoogleReviews;

