import React, { useState, useCallback, useRef } from 'react';
import utils from '@bigcommerce/stencil-utils';
import { TooltipProvider } from '../ui/Tooltip';
import { PDPGallery } from './PDPGallery';
import { PDPBuyBox } from './PDPBuyBox';
import { PDPShipping } from './PDPShipping';
import { PDPIncludes } from './PDPIncludes';
import { PDPBundle } from './PDPBundle';
import { PDPAccordion } from './PDPAccordion';
import { PDPReviews } from './PDPReviews';
import { StickyAddToCart } from './StickyAddToCart';
import { areRequiredOptionsSelected } from './pdpUtils';
import { trackProductView } from './pdpAnalytics';
import { cn } from '../lib/utils';

/**
 * PDPApp - Main Product Detail Page orchestrator
 * Coordinates all PDP components and handles cart operations
 */
export function PDPApp({ product, context }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [optionSelections, setOptionSelections] = useState({});
  const [quantity, setQuantity] = useState(product.min_purchase_quantity || 1);
  const [fitmentDrawerOpen, setFitmentDrawerOpen] = useState(false);

  // Ref for the main ATC button (for sticky ATC intersection observer)
  const mainAtcRef = useRef(null);

  // Track product view on mount
  React.useEffect(() => {
    trackProductView(product);
  }, [product]);

  // Check if all required options are selected
  const canAddToCart = areRequiredOptionsSelected(product.options, optionSelections);

  // Handle option change from buy box
  const handleOptionChange = useCallback((optionId, value) => {
    setOptionSelections((prev) => ({
      ...prev,
      [optionId]: value,
    }));

    // Trigger BigCommerce option change for price/inventory updates
    // This would normally trigger a product attributes update
    if (typeof window !== 'undefined' && window.BCData) {
      // Build form data for option change
      const formData = new FormData();
      formData.append('action', 'add');
      formData.append('product_id', product.id);
      
      // Add all current selections
      const updatedSelections = { ...optionSelections, [optionId]: value };
      Object.entries(updatedSelections).forEach(([id, val]) => {
        formData.append(`attribute[${id}]`, val);
      });

      // Use stencil-utils to get updated product data
      utils.api.productAttributes.optionChange(
        product.id,
        formData,
        'products/bulk-discount-rates',
        (err, response) => {
          if (err) {
            console.error('Option change error:', err);
            return;
          }
          // Response contains updated price, stock, SKU, etc.
          // Could update local state here if needed
        }
      );
    }
  }, [optionSelections, product.id]);

  // Handle add to cart
  const handleAddToCart = useCallback(
    async ({ productId, quantity: qty, options }) => {
      setIsAddingToCart(true);
      setCartError(null);

      try {
        // Build form data
        const formData = new FormData();
        formData.append('action', 'add');
        formData.append('product_id', productId);
        formData.append('qty[]', qty);

        // Add option selections
        Object.entries(options || optionSelections).forEach(([id, value]) => {
          formData.append(`attribute[${id}]`, value);
        });

        // Use stencil-utils for cart add
        return new Promise((resolve, reject) => {
          utils.api.cart.itemAdd(formData, (err, response) => {
            setIsAddingToCart(false);

            if (err) {
              console.error('Add to cart error:', err);
              setCartError(err.message || 'Failed to add to cart');
              reject(err);
              return;
            }

            if (response.data?.error) {
              setCartError(response.data.error);
              reject(new Error(response.data.error));
              return;
            }

            // Success - update cart preview
            const cartQuantity = response.data?.cart_item?.quantity || qty;
            
            // Trigger cart preview update
            if (typeof $ !== 'undefined') {
              $('body').trigger('cart-quantity-update', cartQuantity);
            }

            // Show success (could open cart preview drawer)
            resolve(response);
          });
        });
      } catch (error) {
        setIsAddingToCart(false);
        setCartError(error.message);
        throw error;
      }
    },
    [optionSelections]
  );

  // Handle bundle add to cart
  const handleBundleAddToCart = useCallback(async (addons) => {
    const results = { success: true, added: [], failed: [] };

    for (const addon of addons) {
      try {
        // For bundle items, we'd need actual product IDs
        // This is a simplified version - in production, you'd look up product by SKU
        const formData = new FormData();
        formData.append('action', 'add');
        formData.append('product_id', addon.productId || addon.sku);
        formData.append('qty[]', 1);

        await new Promise((resolve, reject) => {
          utils.api.cart.itemAdd(formData, (err, response) => {
            if (err || response.data?.error) {
              results.failed.push(addon);
              results.success = false;
              resolve(); // Continue with other items
            } else {
              results.added.push(addon);
              resolve();
            }
          });
        });
      } catch (error) {
        results.failed.push(addon);
        results.success = false;
      }
    }

    // Update cart preview
    if (typeof $ !== 'undefined') {
      $('body').trigger('cart-quantity-update');
    }

    return results;
  }, []);

  // Handle write review click
  const handleWriteReviewClick = useCallback(() => {
    // Open review modal (existing BigCommerce functionality)
    if (typeof $ !== 'undefined') {
      $('[data-reveal-id="modal-review-form"]').trigger('click');
    }
  }, []);

  // Handle open fitment drawer
  const handleOpenFitmentDrawer = useCallback(() => {
    setFitmentDrawerOpen(true);
  }, []);

  // Helper to replace BigCommerce image size placeholder
  const resolveImageUrl = (url, size = 'original') => {
    if (!url) return '';
    // Replace {:size} or {size} placeholder with actual size
    return url.replace(/\{:?size\}/gi, size);
  };

  // Prepare images for gallery
  const images = (product.images || []).map((img) => ({
    src: resolveImageUrl(img.data || img.url_zoom || img.url_standard, 'original'),
    thumbnail: resolveImageUrl(img.url_thumbnail || img.url_tiny, '100x100'),
    alt: img.alt || product.title,
  }));

  // Add main image first if not in array
  if (product.main_image) {
    const mainSrc = resolveImageUrl(product.main_image.data || product.main_image.url_zoom, 'original');
    if (!images.find((i) => i.src === mainSrc)) {
      images.unshift({
        src: mainSrc,
        thumbnail: resolveImageUrl(product.main_image.url_thumbnail, '100x100'),
        alt: product.title,
      });
    }
  }

  return (
    <TooltipProvider>
      <div className="tpu-pdp">
        {/* Main Content Grid */}
        <div className="tpu-pdp__main">
          {/* Left Column - Gallery */}
          <div className="tpu-pdp__gallery-col">
            <PDPGallery images={images} productTitle={product.title} />
          </div>

          {/* Right Column - Buy Box */}
          <div className="tpu-pdp__buybox-col">
            <PDPBuyBox
              product={product}
              onAddToCart={handleAddToCart}
              onOptionChange={handleOptionChange}
              isAddingToCart={isAddingToCart}
              atcRef={mainAtcRef}
            />

            {/* Shipping & Stock */}
            <PDPShipping product={product} />

            {/* What's Included */}
            <PDPIncludes product={product} />
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="tpu-pdp__below-fold">
          {/* Bundle Recommendations */}
          <PDPBundle product={product} onAddToCart={handleBundleAddToCart} />

          {/* Accordion Sections */}
          <PDPAccordion
            product={product}
            onOpenFitmentDrawer={handleOpenFitmentDrawer}
          />

          {/* Reviews */}
          <PDPReviews
            product={product}
            onWriteReviewClick={handleWriteReviewClick}
          />
        </div>

        {/* Sticky Add to Cart (Mobile) */}
        <StickyAddToCart
          product={product}
          quantity={quantity}
          selectedVariant={null}
          canAddToCart={canAddToCart}
          isAddingToCart={isAddingToCart}
          onAddToCart={() => handleAddToCart({
            productId: product.id,
            quantity,
            options: optionSelections,
          })}
          mainAtcRef={mainAtcRef}
        />

        {/* Hidden form for traditional submission fallback */}
        <form
          id="pdp-fallback-form"
          method="post"
          action={product.cart_url}
          encType="multipart/form-data"
          style={{ display: 'none' }}
        >
          <input type="hidden" name="action" value="add" />
          <input type="hidden" name="product_id" value={product.id} />
          <input type="hidden" name="qty[]" value={quantity} />
          {Object.entries(optionSelections).map(([id, value]) => (
            <input key={id} type="hidden" name={`attribute[${id}]`} value={value} />
          ))}
        </form>
      </div>
    </TooltipProvider>
  );
}

export default PDPApp;

