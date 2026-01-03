/**
 * PDP Analytics - Event tracking for Product Detail Page
 * Pushes events to window.dataLayer for GTM/GA4
 */

/**
 * Initialize dataLayer if not present
 */
function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
}

/**
 * Push an event to the dataLayer
 * @param {string} eventName - Event name
 * @param {object} eventData - Additional event data
 */
function pushEvent(eventName, eventData = {}) {
  ensureDataLayer();
  window.dataLayer.push({
    event: eventName,
    ...eventData,
  });
}

// =============================================================================
// FITMENT EVENTS
// =============================================================================

/**
 * Track fitment state on page load
 * @param {string} state - 'verified' | 'partial' | 'unverified'
 * @param {object} fitmentData - Detected fitment tags
 */
export function trackFitmentState(state, fitmentData = {}) {
  pushEvent('pdp_fitment_state', {
    fitment_state: state,
    fitment_capacity: fitmentData.capacity || null,
    fitment_bolt_pattern: fitmentData.boltPattern || null,
    fitment_brake_type: fitmentData.brakeType || null,
    fitment_tags_count: Object.values(fitmentData).filter(Boolean).length,
  });
}

/**
 * Track fitment drawer open
 * @param {string} state - Current fitment state when drawer opened
 */
export function trackFitmentDrawerOpen(state) {
  pushEvent('pdp_fitment_drawer_open', {
    fitment_state: state,
  });
}

/**
 * Track fitment drawer submission (Show matching kits)
 * @param {object} selections - User's fitment selections
 */
export function trackFitmentSubmit(selections) {
  pushEvent('pdp_fitment_submit', {
    fitment_capacity: selections.capacity || null,
    fitment_axle_config: selections.axleConfig || null,
    fitment_bolt_pattern: selections.boltPattern || null,
    fitment_brake_type: selections.brakeType || null,
  });
}

// =============================================================================
// BUNDLE EVENTS
// =============================================================================

/**
 * Track one-click bundle add
 * @param {array} products - Array of product IDs in bundle
 * @param {number} totalValue - Total bundle value
 */
export function trackBundleAddRecommended(products, totalValue) {
  pushEvent('pdp_bundle_add_recommended', {
    bundle_product_count: products.length,
    bundle_product_ids: products,
    bundle_total_value: totalValue,
  });
}

/**
 * Track customize bundle expansion
 */
export function trackBundleCustomizeOpen() {
  pushEvent('pdp_bundle_customize_open', {});
}

/**
 * Track custom bundle add (selected items)
 * @param {array} products - Array of selected product IDs
 * @param {number} totalValue - Total value of selected items
 */
export function trackBundleAddSelected(products, totalValue) {
  pushEvent('pdp_bundle_add_selected', {
    bundle_product_count: products.length,
    bundle_product_ids: products,
    bundle_total_value: totalValue,
  });
}

// =============================================================================
// STICKY ATC EVENTS
// =============================================================================

/**
 * Track sticky add-to-cart click
 * @param {number} productId - Product ID
 * @param {string} variantSku - Selected variant SKU
 * @param {number} quantity - Quantity added
 */
export function trackStickyAtcClick(productId, variantSku, quantity) {
  pushEvent('pdp_sticky_atc_click', {
    product_id: productId,
    variant_sku: variantSku,
    quantity: quantity,
  });
}

// =============================================================================
// PRODUCT VIEW EVENTS
// =============================================================================

/**
 * Track product view with enhanced data
 * @param {object} product - Product data
 */
export function trackProductView(product) {
  pushEvent('pdp_view', {
    product_id: product.id,
    product_name: product.title,
    product_sku: product.sku,
    product_price: product.price?.value,
    product_brand: product.brand?.name,
    product_category: product.categories?.[0] || null,
  });
}

/**
 * Track gallery image view
 * @param {number} imageIndex - Index of viewed image
 */
export function trackGalleryImageView(imageIndex) {
  pushEvent('pdp_gallery_image_view', {
    image_index: imageIndex,
  });
}

/**
 * Track accordion section open
 * @param {string} sectionId - ID of opened section
 */
export function trackAccordionOpen(sectionId) {
  pushEvent('pdp_accordion_open', {
    section_id: sectionId,
  });
}

export default {
  trackFitmentState,
  trackFitmentDrawerOpen,
  trackFitmentSubmit,
  trackBundleAddRecommended,
  trackBundleCustomizeOpen,
  trackBundleAddSelected,
  trackStickyAtcClick,
  trackProductView,
  trackGalleryImageView,
  trackAccordionOpen,
};

