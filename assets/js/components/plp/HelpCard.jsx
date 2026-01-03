import React from 'react';
import { MagicCard } from '../MagicCard';
import { BorderBeam } from '../BorderBeam';
import { ShimmerButton } from '../ShimmerButton';

/**
 * HelpCard - Injected card offering fitment assistance
 * Displayed after every 8th product (first), then every 24 products
 */
export function HelpCard({ variant = 'fitment' }) {
  const variants = {
    fitment: {
      title: 'Need Help with Fitment?',
      description: "Not sure which kit fits your trailer? Our experts can help you find the perfect match.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      ),
      ctaText: 'Get Fitment Help',
      ctaLink: '/pages/helpful-information.html/',
      secondaryText: 'Or call 844-898-8687',
    },
    b2b: {
      title: 'Fleet & Dealer Pricing',
      description: 'Buying in bulk? Get wholesale pricing for fleet maintenance and dealer inventory.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      ctaText: 'Request a Quote',
      ctaLink: '/contact-us/',
      secondaryText: 'Volume discounts available',
    },
  };

  const content = variants[variant] || variants.fitment;

  return (
    <div className="tpu-help-card">
      <MagicCard
        className="tpu-help-card__inner"
        gradientSize={200}
        gradientColor="rgba(255, 107, 53, 0.15)"
        gradientFrom="#ff6b35"
        gradientTo="#ffc107"
        gradientOpacity={0.25}
      >
        <BorderBeam 
          size={80}
          duration={10}
          colorFrom="#ff6b35"
          colorTo="#ffc107"
          borderWidth={2}
        />
        
        <div className="tpu-help-card__icon">
          {content.icon}
        </div>
        
        <div className="tpu-help-card__content">
          <h3 className="tpu-help-card__title">{content.title}</h3>
          <p className="tpu-help-card__description">{content.description}</p>
        </div>
        
        <div className="tpu-help-card__actions">
          <ShimmerButton
            href={content.ctaLink}
            className="tpu-help-card__cta"
            shimmerColor="#ffffff"
            background="rgba(255, 107, 53, 1)"
          >
            {content.ctaText}
          </ShimmerButton>
          
          {content.secondaryText && (
            <span className="tpu-help-card__secondary">
              {content.secondaryText}
            </span>
          )}
        </div>
      </MagicCard>
    </div>
  );
}

/**
 * Inject help cards into product grid
 * Called after product listing renders
 */
export function injectHelpCards(containerSelector = '#product-listing-container') {
  if (typeof window === 'undefined') return;

  const container = document.querySelector(containerSelector);
  if (!container) return;

  const productGrid = container.querySelector('.productGrid, .productList');
  if (!productGrid) return;

  const products = productGrid.querySelectorAll('.product, .card');
  if (products.length === 0) return;

  // Determine injection positions: after 8th, then every 24
  const injectionPositions = [8];
  let pos = 8;
  while (pos + 24 < products.length) {
    pos += 24;
    injectionPositions.push(pos);
  }

  // Dynamically import React DOM for mounting
  import('react-dom/client').then(({ createRoot }) => {
    injectionPositions.forEach((position, index) => {
      const product = products[position - 1]; // 0-indexed
      if (!product) return;

      // Check if already injected
      if (product.nextElementSibling?.classList.contains('tpu-help-card-wrapper')) {
        return;
      }

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'tpu-help-card-wrapper';
      
      // Determine variant: first is fitment, alternate with b2b for heavy-duty categories
      const isHeavyDuty = window.categoryName?.toLowerCase().includes('heavy') ||
                          window.categoryName?.toLowerCase().includes('fleet') ||
                          window.categoryName?.toLowerCase().includes('commercial');
      
      const variant = index > 0 && isHeavyDuty ? 'b2b' : 'fitment';

      // Insert after product
      product.parentNode.insertBefore(wrapper, product.nextSibling);

      // Render React component
      const root = createRoot(wrapper);
      root.render(<HelpCard variant={variant} />);
    });
  });
}

export default HelpCard;

