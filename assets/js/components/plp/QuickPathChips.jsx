import React from 'react';
import { motion } from 'motion/react';
import { MagicCard } from '../MagicCard';
import { BlurFade } from '../BlurFade';
import {
  QUICK_PATH_CHIPS,
  buildQuickPathUrl,
  isChipRelevantForCategory,
} from './fitmentUtils';

/**
 * Icon mapping for quick path chips
 */
const ChipIcon = ({ icon }) => {
  const icons = {
    star: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    anchor: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3" />
        <line x1="12" y1="22" x2="12" y2="8" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
      </svg>
    ),
    zap: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    'circle-off': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  };

  return (
    <span className="tpu-quick-chips__icon">
      {icons[icon] || icons.star}
    </span>
  );
};

/**
 * QuickPathChips - Intent-based shortcut buttons for common filter combinations
 */
export function QuickPathChips({ categoryName = '' }) {
  // Filter chips relevant to current category
  const relevantChips = QUICK_PATH_CHIPS.filter(chip => 
    isChipRelevantForCategory(chip, categoryName)
  );

  if (relevantChips.length === 0) {
    return null;
  }

  const handleChipClick = (chip, e) => {
    // Allow default navigation, but could be enhanced with AJAX
    const url = buildQuickPathUrl(chip);
    
    // Scroll to product grid after navigation
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tpuScrollToGrid', 'true');
    }
  };

  return (
    <div className="tpu-quick-chips">
      <BlurFade delay={0.1} direction="up" offset={10}>
        <h3 className="tpu-quick-chips__title">Quick Filters</h3>
      </BlurFade>
      
      <div className="tpu-quick-chips__list">
        {relevantChips.map((chip, index) => (
          <BlurFade 
            key={chip.id} 
            delay={0.15 + index * 0.05} 
            direction="up" 
            offset={10}
          >
            <a
              href={buildQuickPathUrl(chip)}
              className="tpu-quick-chips__chip"
              onClick={(e) => handleChipClick(chip, e)}
            >
              <MagicCard
                className="tpu-quick-chips__card"
                gradientSize={100}
                gradientColor="rgba(255, 107, 53, 0.12)"
                gradientFrom="#ff6b35"
                gradientTo="#ffc107"
                gradientOpacity={0.2}
              >
                <ChipIcon icon={chip.icon} />
                <div className="tpu-quick-chips__content">
                  <span className="tpu-quick-chips__label">{chip.label}</span>
                  {chip.sublabel && (
                    <span className="tpu-quick-chips__sublabel">{chip.sublabel}</span>
                  )}
                </div>
                <svg 
                  className="tpu-quick-chips__arrow"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </MagicCard>
            </a>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default QuickPathChips;

