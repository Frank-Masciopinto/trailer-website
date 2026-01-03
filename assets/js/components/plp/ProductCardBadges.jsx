import React from 'react';
import { Badge } from '../ui/Badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';
import { parseFitmentFromProduct, getKitIncludes } from './fitmentUtils';

/**
 * Icon components for kit includes
 */
const IncludeIcon = ({ type }) => {
  const icons = {
    circle: ( // Hubs
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    disc: ( // Drums
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    cog: ( // Bearings
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    ring: ( // Seals
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" opacity="0.5" />
      </svg>
    ),
    wrench: ( // Hardware
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  };

  return (
    <span className="tpu-card-badges__include-icon">
      {icons[type] || icons.wrench}
    </span>
  );
};

/**
 * ProductCardBadges - Displays fitment, includes, and shipping info on product cards
 */
export function ProductCardBadges({ productName, productSku = '', inStock = true, stockLevel = null }) {
  const fitment = parseFitmentFromProduct(productName, productSku);
  const kitIncludes = getKitIncludes();

  // Build fitment string
  const fitmentParts = [];
  if (fitment.capacity) fitmentParts.push(fitment.capacity);
  if (fitment.axleType) fitmentParts.push(fitment.axleType);
  if (fitment.boltPattern) fitmentParts.push(fitment.boltPattern);
  if (fitment.brakeType) fitmentParts.push(fitment.brakeType);

  const fitmentString = fitmentParts.join(' • ');

  return (
    <div className="tpu-card-badges">
      {/* Fits Badge */}
      {fitment.hasFitmentData ? (
        <div className="tpu-card-badges__fits">
          <span className="tpu-card-badges__fits-label">Fits:</span>
          <span className="tpu-card-badges__fits-value">{fitmentString}</span>
        </div>
      ) : (
        <a href="/pages/helpful-information.html/" className="tpu-card-badges__confirm-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
          Confirm fitment
        </a>
      )}

      {/* Kit Includes - Icon row */}
      <TooltipProvider>
        <div className="tpu-card-badges__includes">
          <span className="tpu-card-badges__includes-label">Includes:</span>
          <div className="tpu-card-badges__includes-icons">
            {kitIncludes.slice(0, 5).map(item => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <span className="tpu-card-badges__include-item">
                    <IncludeIcon type={item.icon} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>

      {/* Stock/Shipping Badge */}
      <div className="tpu-card-badges__shipping">
        {inStock ? (
          <Badge variant="success" className="tpu-card-badges__stock-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {stockLevel !== null && stockLevel <= 5 ? (
              <span>Only {stockLevel} left</span>
            ) : (
              <span>In Stock</span>
            )}
          </Badge>
        ) : (
          <Badge variant="secondary" className="tpu-card-badges__stock-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Ships in 2-3 days
          </Badge>
        )}
      </div>
    </div>
  );
}

/**
 * Initialize product card badges on existing cards
 * Called by app.js to enhance existing product cards with React badges
 */
export function initializeProductCardBadges() {
  if (typeof window === 'undefined') return;

  // Find all product cards with badge mount points
  const badgeMounts = document.querySelectorAll('[data-product-badges-mount]');
  
  if (badgeMounts.length === 0) return;

  // Dynamically import React DOM for mounting
  import('react-dom/client').then(({ createRoot }) => {
    badgeMounts.forEach(mount => {
      const productName = mount.dataset.productName || '';
      const productSku = mount.dataset.productSku || '';
      const inStock = mount.dataset.inStock !== 'false';
      const stockLevel = mount.dataset.stockLevel ? parseInt(mount.dataset.stockLevel, 10) : null;

      const root = createRoot(mount);
      root.render(
        <ProductCardBadges
          productName={productName}
          productSku={productSku}
          inStock={inStock}
          stockLevel={stockLevel}
        />
      );
    });
  });
}

export default ProductCardBadges;

