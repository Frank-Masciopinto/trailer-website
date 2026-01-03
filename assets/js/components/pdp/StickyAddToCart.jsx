import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/Tooltip';
import { cn } from '../lib/utils';
import { trackStickyAtcClick } from './pdpAnalytics';

/**
 * StickyAddToCart - Mobile sticky add-to-cart bar
 * Appears when main ATC button scrolls out of view
 */
export function StickyAddToCart({
  product,
  quantity = 1,
  selectedVariant = null,
  canAddToCart = true,
  isAddingToCart = false,
  onAddToCart,
  mainAtcRef,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  // Use IntersectionObserver to detect when main ATC is out of view
  useEffect(() => {
    if (!mainAtcRef?.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Show sticky when main ATC is NOT intersecting (out of view)
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px', // Trigger a bit before it's completely out
      }
    );

    observerRef.current.observe(mainAtcRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [mainAtcRef]);

  // Handle add to cart
  const handleAddToCart = () => {
    trackStickyAtcClick(product.id, selectedVariant?.sku || product.sku, quantity);
    if (onAddToCart) {
      onAddToCart();
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return '';
    return price.formatted || `$${price.value?.toFixed(2)}`;
  };

  // Get variant summary text
  const getVariantSummary = () => {
    if (!selectedVariant) return null;
    // Build summary from selected options
    const parts = [];
    if (selectedVariant.options) {
      Object.values(selectedVariant.options).forEach((opt) => {
        if (opt.label) parts.push(opt.label);
      });
    }
    return parts.length > 0 ? parts.join(' / ') : null;
  };

  const variantSummary = getVariantSummary();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="tpu-sticky-atc"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          role="complementary"
          aria-label="Quick add to cart"
        >
          <div className="tpu-sticky-atc__container">
            {/* Product Info */}
            <div className="tpu-sticky-atc__info">
              <div className="tpu-sticky-atc__price">
                {formatPrice(product.price?.without_tax || product.price?.with_tax)}
              </div>
              {variantSummary && (
                <div className="tpu-sticky-atc__variant">
                  {variantSummary}
                </div>
              )}
              {quantity > 1 && (
                <div className="tpu-sticky-atc__qty">
                  Qty: {quantity}
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="tpu-sticky-atc__btn-wrapper">
                    <Button
                      onClick={handleAddToCart}
                      disabled={!canAddToCart || isAddingToCart || product.out_of_stock}
                      className="tpu-sticky-atc__btn"
                      size="lg"
                    >
                      {isAddingToCart ? (
                        <>
                          <svg
                            className="tpu-sticky-atc__spinner"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray="60"
                              strokeLinecap="round"
                            />
                          </svg>
                          Adding
                        </>
                      ) : product.out_of_stock ? (
                        'Out of Stock'
                      ) : (
                        <>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </span>
                </TooltipTrigger>
                {!canAddToCart && !product.out_of_stock && (
                  <TooltipContent side="top">
                    Please select all required options above
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StickyAddToCart;

