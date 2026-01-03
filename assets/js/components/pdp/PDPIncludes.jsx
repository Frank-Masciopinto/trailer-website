import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { cn } from '../lib/utils';
import { extractWhatsIncluded } from './pdpUtils';

/**
 * PDPIncludes - "What's Included" card showing kit contents
 * Extracts from custom fields or shows fallback CTA
 */
export function PDPIncludes({ product }) {
  const includedItems = useMemo(() => extractWhatsIncluded(product), [product]);

  // Icon mapping for common kit items
  const getItemIcon = (item) => {
    const lower = item.toLowerCase();
    
    if (lower.includes('hub') || lower.includes('drum')) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    }
    if (lower.includes('bearing')) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    }
    if (lower.includes('seal')) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      );
    }
    if (lower.includes('hardware') || lower.includes('bolt') || lower.includes('nut')) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    }
    if (lower.includes('brake') || lower.includes('pad')) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M12 8v8" />
        </svg>
      );
    }
    if (lower.includes('grease') || lower.includes('lubricant')) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 11h1" />
          <path d="M19 11h2" />
          <path d="M3 11h4" />
          <path d="M11 11h2" />
          <rect x="6" y="8" width="4" height="6" rx="2" />
          <path d="M8 8V5" />
          <path d="M8 14v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5" />
        </svg>
      );
    }
    // Default checkmark
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  };

  // If no items found, show fallback
  if (!includedItems || includedItems.length === 0) {
    return (
      <Card className="tpu-pdp-includes tpu-pdp-includes--empty">
        <CardContent className="tpu-pdp-includes__fallback">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <p className="tpu-pdp-includes__fallback-text">
            See product description for full specifications and included components.
          </p>
          <a href="#description" className="tpu-pdp-includes__fallback-link">
            View Specs Below
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tpu-pdp-includes">
      <CardHeader className="tpu-pdp-includes__header">
        <CardTitle className="tpu-pdp-includes__title">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          What's Included
        </CardTitle>
      </CardHeader>
      <CardContent className="tpu-pdp-includes__content">
        <ul className="tpu-pdp-includes__list">
          {includedItems.map((item, index) => (
            <li key={index} className="tpu-pdp-includes__item">
              <span className="tpu-pdp-includes__item-icon">
                {getItemIcon(item)}
              </span>
              <span className="tpu-pdp-includes__item-text">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default PDPIncludes;

