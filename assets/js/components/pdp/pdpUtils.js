/**
 * PDP Utilities - Shared helpers for Product Detail Page components
 */

import {
  CAPACITY_OPTIONS,
  AXLE_OPTIONS,
  BOLT_PATTERN_OPTIONS,
  BRAKE_TYPE_OPTIONS,
  parseFitmentFromProduct,
  getSavedFitment,
  saveFitment,
  buildFilterUrl,
} from '../plp/fitmentUtils';

// Re-export fitment utilities for convenience
export {
  CAPACITY_OPTIONS,
  AXLE_OPTIONS,
  BOLT_PATTERN_OPTIONS,
  BRAKE_TYPE_OPTIONS,
  parseFitmentFromProduct,
  getSavedFitment,
  saveFitment,
  buildFilterUrl,
};

// =============================================================================
// FITMENT STATE MACHINE
// =============================================================================

export const FITMENT_STATES = {
  VERIFIED: 'verified',
  PARTIAL: 'partial',
  UNVERIFIED: 'unverified',
};

/**
 * Determine fitment state based on available product data
 * @param {object} product - Product data from context
 * @returns {object} { state, tags, tagCount }
 */
export function determineFitmentState(product) {
  // First try custom fields
  const customFieldTags = extractFitmentFromCustomFields(product);
  
  // Fallback to parsing from name/SKU
  const parsedTags = parseFitmentFromProduct(product.title || '', product.sku || '');
  
  // Merge with custom fields taking priority
  const tags = {
    capacity: customFieldTags.capacity || parsedTags.capacity || null,
    boltPattern: customFieldTags.boltPattern || parsedTags.boltPattern || null,
    brakeType: customFieldTags.brakeType || parsedTags.brakeType || null,
  };
  
  const tagCount = Object.values(tags).filter(Boolean).length;
  
  let state;
  if (tagCount >= 3) {
    state = FITMENT_STATES.VERIFIED;
  } else if (tagCount >= 1) {
    state = FITMENT_STATES.PARTIAL;
  } else {
    state = FITMENT_STATES.UNVERIFIED;
  }
  
  return { state, tags, tagCount };
}

/**
 * Extract fitment tags from product custom fields
 * @param {object} product - Product data
 * @returns {object} Extracted tags
 */
export function extractFitmentFromCustomFields(product) {
  const tags = {
    capacity: null,
    boltPattern: null,
    brakeType: null,
  };
  
  if (!product?.custom_fields) return tags;
  
  const fields = Array.isArray(product.custom_fields)
    ? product.custom_fields
    : Object.values(product.custom_fields || {});
  
  fields.forEach((field) => {
    const name = (field.name || '').toLowerCase();
    const value = field.value || '';
    
    if (name.includes('capacity')) {
      tags.capacity = value;
    } else if (name.includes('bolt') && name.includes('pattern')) {
      tags.boltPattern = value;
    } else if (name.includes('brake') && name.includes('type')) {
      tags.brakeType = value;
    }
  });
  
  return tags;
}

/**
 * Get fitment state display config
 * @param {string} state - Fitment state
 * @returns {object} Display configuration
 */
export function getFitmentStateConfig(state) {
  switch (state) {
    case FITMENT_STATES.VERIFIED:
      return {
        title: 'Fitment: Verified',
        variant: 'success',
        icon: 'check-circle',
        ctaText: 'Double-check fitment',
        description: 'This product fits your trailer specs',
      };
    case FITMENT_STATES.PARTIAL:
      return {
        title: 'Fitment: Likely',
        variant: 'warning',
        icon: 'alert-circle',
        ctaText: 'Confirm in 60 seconds',
        description: 'Some specs match - confirm before ordering',
      };
    case FITMENT_STATES.UNVERIFIED:
    default:
      return {
        title: 'Fitment: Confirm before ordering',
        variant: 'default',
        icon: 'help-circle',
        ctaText: 'Confirm fitment',
        description: 'Verify this fits your trailer',
      };
  }
}

// =============================================================================
// BUNDLE RECOMMENDATIONS
// =============================================================================

/**
 * Static mapping of category keywords to add-on product SKUs
 * SKUs should be updated to match actual store inventory
 */
export const BUNDLE_CATEGORY_MAP = {
  brake: {
    label: 'Brake Products',
    addons: [
      { sku: 'BRAKE-HW-KIT', name: 'Brake Hardware Kit', price: 24.99 },
      { sku: 'BREAKAWAY-KIT', name: 'Breakaway Kit', price: 49.99 },
      { sku: 'BEARING-GREASE-14OZ', name: 'Wheel Bearing Grease (14oz)', price: 12.99 },
    ],
  },
  'hub-drum': {
    label: 'Hub/Drum Products',
    addons: [
      { sku: 'BRAKE-HW-KIT', name: 'Brake Hardware Kit', price: 24.99 },
      { sku: 'BREAKAWAY-KIT', name: 'Breakaway Kit', price: 49.99 },
      { sku: 'BEARING-GREASE-14OZ', name: 'Wheel Bearing Grease (14oz)', price: 12.99 },
    ],
  },
  hub: {
    label: 'Hub Products',
    addons: [
      { sku: 'SEAL-2PACK', name: 'Grease Seals (2-pack)', price: 8.99 },
      { sku: 'BEARING-GREASE-14OZ', name: 'Wheel Bearing Grease (14oz)', price: 12.99 },
      { sku: 'DUST-CAP-PAIR', name: 'Dust Caps (pair)', price: 6.99 },
    ],
  },
  bearing: {
    label: 'Bearing Products',
    addons: [
      { sku: 'SEAL-2PACK', name: 'Grease Seals (2-pack)', price: 8.99 },
      { sku: 'BEARING-GREASE-14OZ', name: 'Wheel Bearing Grease (14oz)', price: 12.99 },
      { sku: 'DUST-CAP-PAIR', name: 'Dust Caps (pair)', price: 6.99 },
    ],
  },
  light: {
    label: 'Lighting Products',
    addons: [
      { sku: 'HEAT-SHRINK-KIT', name: 'Heat Shrink Connector Kit', price: 14.99 },
      { sku: 'JUNCTION-BOX', name: 'Waterproof Junction Box', price: 18.99 },
      { sku: 'WIRE-CLIPS-25', name: 'Wire Clips (25-pack)', price: 5.99 },
    ],
  },
  wiring: {
    label: 'Wiring Products',
    addons: [
      { sku: 'HEAT-SHRINK-KIT', name: 'Heat Shrink Connector Kit', price: 14.99 },
      { sku: 'JUNCTION-BOX', name: 'Waterproof Junction Box', price: 18.99 },
      { sku: 'WIRE-CLIPS-25', name: 'Wire Clips (25-pack)', price: 5.99 },
    ],
  },
  axle: {
    label: 'Axle Products',
    addons: [
      { sku: 'BEARING-BUDDY-PAIR', name: 'Bearing Buddies (pair)', price: 29.99 },
      { sku: 'WHEEL-CHOCK-PAIR', name: 'Wheel Chocks (pair)', price: 19.99 },
      { sku: 'TIE-DOWN-4PACK', name: 'Tie-Down Straps (4-pack)', price: 24.99 },
    ],
  },
  kit: {
    label: 'Trailer Kits',
    addons: [
      { sku: 'BEARING-BUDDY-PAIR', name: 'Bearing Buddies (pair)', price: 29.99 },
      { sku: 'WHEEL-CHOCK-PAIR', name: 'Wheel Chocks (pair)', price: 19.99 },
      { sku: 'TIE-DOWN-4PACK', name: 'Tie-Down Straps (4-pack)', price: 24.99 },
    ],
  },
};

/**
 * Get bundle recommendations based on product categories
 * @param {object} product - Product data
 * @returns {object} { addons, categoryMatched }
 */
export function getBundleRecommendations(product) {
  const categories = product.category || product.categories || [];
  const categoryText = categories.join(' ').toLowerCase();
  const productName = (product.title || product.name || '').toLowerCase();
  const searchText = `${categoryText} ${productName}`;
  
  // Find matching category
  const matchedKeys = Object.keys(BUNDLE_CATEGORY_MAP).filter((key) =>
    searchText.includes(key)
  );
  
  if (matchedKeys.length === 0) {
    // Default fallback for unmatched products
    return {
      addons: BUNDLE_CATEGORY_MAP.axle.addons,
      categoryMatched: 'default',
    };
  }
  
  // Use first matched category (more specific matches come first due to order)
  const primaryKey = matchedKeys[0];
  return {
    addons: BUNDLE_CATEGORY_MAP[primaryKey].addons,
    categoryMatched: primaryKey,
  };
}

/**
 * Calculate total bundle price
 * @param {array} addons - Array of addon objects with prices
 * @returns {number} Total price
 */
export function calculateBundleTotal(addons) {
  return addons.reduce((total, addon) => total + (addon.price || 0), 0);
}

// =============================================================================
// PRODUCT OPTIONS HELPERS
// =============================================================================

/**
 * Check if all required options are selected
 * @param {array} options - Product options
 * @param {object} selections - Current selections
 * @returns {boolean}
 */
export function areRequiredOptionsSelected(options, selections) {
  if (!options || options.length === 0) return true;
  
  return options
    .filter((opt) => opt.required)
    .every((opt) => {
      const value = selections[opt.id];
      return value !== undefined && value !== null && value !== '';
    });
}

/**
 * Get option type for rendering
 * @param {object} option - Product option
 * @returns {string} 'select' | 'swatch' | 'radio' | 'text'
 */
export function getOptionRenderType(option) {
  const type = (option.type || option.display_name || '').toLowerCase();
  
  if (type.includes('swatch') || type.includes('color')) {
    return 'swatch';
  }
  if (type.includes('radio') || type.includes('rectangle')) {
    return 'radio';
  }
  if (type.includes('text') || type.includes('input')) {
    return 'text';
  }
  return 'select';
}

/**
 * Format option value label
 * @param {object} value - Option value
 * @returns {string}
 */
export function formatOptionValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.label || value.data || String(value);
}

// =============================================================================
// SHIPPING / STOCK HELPERS
// =============================================================================

/**
 * Get stock status display config
 * @param {object} product - Product data
 * @returns {object} Display configuration
 */
export function getStockStatus(product) {
  const stockLevel = product.stock_level || product.inventory_level;
  const inStock = product.in_stock !== false && stockLevel !== 0;
  const isTracked = product.inventory_tracking !== 'none';
  
  if (!isTracked) {
    return {
      inStock: true,
      label: 'In Stock',
      variant: 'success',
      showLevel: false,
    };
  }
  
  if (!inStock || stockLevel === 0) {
    return {
      inStock: false,
      label: 'Out of Stock',
      variant: 'destructive',
      showLevel: false,
    };
  }
  
  if (stockLevel <= 5) {
    return {
      inStock: true,
      label: `Only ${stockLevel} left`,
      variant: 'warning',
      showLevel: true,
      level: stockLevel,
    };
  }
  
  return {
    inStock: true,
    label: 'In Stock',
    variant: 'success',
    showLevel: false,
  };
}

/**
 * Get safe shipping copy (no specific dates unless reliable)
 * @param {object} product - Product data
 * @returns {object} Shipping display config
 */
export function getShippingDisplay(product) {
  const shippingInfo = product.shipping || {};
  
  // Check for free shipping
  if (shippingInfo.price?.value === 0 || shippingInfo.free) {
    return {
      freeShipping: true,
      label: 'Free Shipping',
      sublabel: 'Ships fast from US/Canada stock',
    };
  }
  
  // Default safe copy - no specific dates
  return {
    freeShipping: false,
    label: 'Ships fast from US/Canada stock',
    sublabel: null,
  };
}

// =============================================================================
// WHAT'S INCLUDED HELPERS
// =============================================================================

/**
 * Extract "What's Included" from product custom fields or description
 * @param {object} product - Product data
 * @returns {array} Array of included items
 */
export function extractWhatsIncluded(product) {
  const items = [];
  
  // Check custom fields for "Includes" or "Kit Contents"
  const fields = product.custom_fields || [];
  const includesField = fields.find((f) => {
    const name = (f.name || '').toLowerCase();
    return name.includes('include') || name.includes('kit') || name.includes('contents');
  });
  
  if (includesField?.value) {
    // Parse comma or newline separated values
    const parsed = includesField.value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
    items.push(...parsed);
  }
  
  return items;
}

/**
 * Check if product is in a lighting category (for compliance notice)
 * @param {object} product - Product data
 * @returns {boolean}
 */
export function isLightingProduct(product) {
  const categories = product.category || product.categories || [];
  const categoryText = categories.join(' ').toLowerCase();
  const productName = (product.title || '').toLowerCase();
  const searchText = `${categoryText} ${productName}`;
  
  return (
    searchText.includes('light') ||
    searchText.includes('lamp') ||
    searchText.includes('led') ||
    searchText.includes('marker') ||
    searchText.includes('tail') ||
    searchText.includes('clearance')
  );
}

// =============================================================================
// URL HELPERS
// =============================================================================

/**
 * Build contact URL with prefilled product info
 * @param {object} product - Product data
 * @returns {string} URL
 */
export function buildContactUrl(product) {
  const params = new URLSearchParams();
  params.set('product', product.title || '');
  params.set('sku', product.sku || '');
  params.set('subject', 'Fitment question');
  return `/contact-us/?${params.toString()}`;
}

/**
 * Build filtered category URL for "Show matching kits"
 * @param {object} selections - User's fitment selections
 * @returns {string} URL
 */
export function buildMatchingKitsUrl(selections) {
  return buildFilterUrl(selections, '/trailer-axle-kits/');
}

export default {
  FITMENT_STATES,
  determineFitmentState,
  getFitmentStateConfig,
  getBundleRecommendations,
  calculateBundleTotal,
  areRequiredOptionsSelected,
  getOptionRenderType,
  getStockStatus,
  getShippingDisplay,
  extractWhatsIncluded,
  isLightingProduct,
  buildContactUrl,
  buildMatchingKitsUrl,
};

