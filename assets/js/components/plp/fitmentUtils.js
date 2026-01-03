/**
 * Fitment Utilities - Product name parsing and localStorage helpers for PLP
 * Used by Fitment Finder, Product Card Badges, and Quick Path Chips
 */

// =============================================================================
// STATIC DATA - Fitment Options
// =============================================================================

export const CAPACITY_OPTIONS = [
  { id: '3500', label: '3,500 lb (3.5K)', value: '3500', shortLabel: '3.5K' },
  { id: '5200', label: '5,200 lb (5.2K)', value: '5200', shortLabel: '5.2K' },
  { id: '6000', label: '6,000 lb (6K)', value: '6000', shortLabel: '6K' },
  { id: '7000', label: '7,000 lb (7K)', value: '7000', shortLabel: '7K' },
  { id: '8000', label: '8,000 lb (8K)', value: '8000', shortLabel: '8K' },
  { id: '10000', label: '10,000 lb (10K)', value: '10000', shortLabel: '10K' },
  { id: '12000', label: '12,000 lb (12K)', value: '12000', shortLabel: '12K' },
];

export const AXLE_OPTIONS = [
  { id: 'single', label: 'Single Axle', value: 'single', shortLabel: '1 Axle' },
  { id: 'tandem', label: 'Tandem Axle', value: 'tandem', shortLabel: '2 Axle' },
  { id: 'triple', label: 'Triple Axle', value: 'triple', shortLabel: '3 Axle' },
];

export const BOLT_PATTERN_OPTIONS = [
  { id: '5-4.5', label: '5 on 4.5"', value: '5-4.5' },
  { id: '5-4.75', label: '5 on 4.75"', value: '5-4.75' },
  { id: '5-5', label: '5 on 5"', value: '5-5' },
  { id: '6-5.5', label: '6 on 5.5"', value: '6-5.5' },
  { id: '8-6.5', label: '8 on 6.5"', value: '8-6.5' },
];

export const BRAKE_TYPE_OPTIONS = [
  { id: 'electric', label: 'Electric Brakes', value: 'electric' },
  { id: 'hydraulic', label: 'Hydraulic Brakes', value: 'hydraulic' },
  { id: 'idler', label: 'No Brakes (Idler)', value: 'idler' },
];

// =============================================================================
// QUICK PATH CHIPS - Pre-configured filter shortcuts
// =============================================================================

export const QUICK_PATH_CHIPS = [
  {
    id: 'most-popular',
    label: 'Most Popular',
    icon: 'star',
    filterParams: { sort: 'bestselling' },
    categories: ['all'],
  },
  {
    id: 'boat-trailer',
    label: 'Boat Trailer',
    sublabel: 'Corrosion-resistant',
    icon: 'anchor',
    filterParams: { 'Finish[]': 'Galvanized' },
    categories: ['axles', 'single-axle', 'tandem-axle'],
  },
  {
    id: 'rv-electric',
    label: 'RV Electric',
    sublabel: 'Electric brake kits',
    icon: 'zap',
    filterParams: { 'Brake Type[]': 'Electric' },
    categories: ['axles', 'tandem-axle', 'triple-axle'],
  },
  {
    id: 'idler-kits',
    label: 'No Brakes',
    sublabel: 'Idler kits',
    icon: 'circle-off',
    filterParams: { 'Brake Type[]': 'Idler' },
    categories: ['axles', 'single-axle'],
  },
  {
    id: 'heavy-duty-8lug',
    label: '8-Lug Heavy Duty',
    sublabel: '10K-12K capacity',
    icon: 'shield',
    filterParams: { 'Bolt Pattern[]': '8 on 6.5' },
    categories: ['axles', 'tandem-axle', 'triple-axle'],
  },
];

// =============================================================================
// LOCALSTORAGE KEYS & HELPERS
// =============================================================================

const STORAGE_KEYS = {
  capacity: 'tpuCapacity',
  axleConfig: 'tpuAxleConfig',
  boltPattern: 'tpuBoltPattern',
  brakeType: 'tpuBrakeType',
};

/**
 * Get saved fitment selections from localStorage
 */
export function getSavedFitment() {
  if (typeof window === 'undefined') return {};
  
  return {
    capacity: localStorage.getItem(STORAGE_KEYS.capacity) || '',
    axleConfig: localStorage.getItem(STORAGE_KEYS.axleConfig) || '',
    boltPattern: localStorage.getItem(STORAGE_KEYS.boltPattern) || '',
    brakeType: localStorage.getItem(STORAGE_KEYS.brakeType) || '',
  };
}

/**
 * Save fitment selections to localStorage
 */
export function saveFitment(fitment) {
  if (typeof window === 'undefined') return;
  
  if (fitment.capacity !== undefined) {
    localStorage.setItem(STORAGE_KEYS.capacity, fitment.capacity);
  }
  if (fitment.axleConfig !== undefined) {
    localStorage.setItem(STORAGE_KEYS.axleConfig, fitment.axleConfig);
  }
  if (fitment.boltPattern !== undefined) {
    localStorage.setItem(STORAGE_KEYS.boltPattern, fitment.boltPattern);
  }
  if (fitment.brakeType !== undefined) {
    localStorage.setItem(STORAGE_KEYS.brakeType, fitment.brakeType);
  }
}

/**
 * Clear all saved fitment selections
 */
export function clearSavedFitment() {
  if (typeof window === 'undefined') return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// =============================================================================
// PRODUCT NAME PARSING
// =============================================================================

/**
 * Parse fitment information from product name and SKU
 * @param {string} name - Product name
 * @param {string} sku - Product SKU (optional)
 * @returns {object} Parsed fitment data
 */
export function parseFitmentFromProduct(name, sku = '') {
  const text = `${name} ${sku}`.toLowerCase();
  
  const fitment = {
    capacity: parseCapacity(text),
    axleType: parseAxleType(text),
    boltPattern: parseBoltPattern(text),
    brakeType: parseBrakeType(text),
  };
  
  // Check if we found any meaningful fitment data
  fitment.hasFitmentData = !!(
    fitment.capacity || 
    fitment.axleType || 
    fitment.boltPattern || 
    fitment.brakeType
  );
  
  return fitment;
}

/**
 * Parse capacity from text
 * Matches patterns: 7K, 7000, 7,000, 7000lb, 7000 lb, 7k lbs
 */
function parseCapacity(text) {
  // Match patterns like "7K", "7k", "7000", "7,000", "7000 lb", etc.
  const patterns = [
    /\b(\d{1,2})k\b/i,                    // 7K, 7k
    /\b(\d{1,2})[,.]?(\d{3})\s*(?:lb|lbs)?\b/i,  // 7000, 7,000, 7000 lb
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let value;
      if (match[2]) {
        // Full number like 7000
        value = parseInt(match[1] + match[2], 10);
      } else {
        // K notation like 7K
        value = parseInt(match[1], 10) * 1000;
      }
      
      // Find matching option
      const option = CAPACITY_OPTIONS.find(opt => parseInt(opt.value, 10) === value);
      if (option) {
        return option.shortLabel;
      }
    }
  }
  
  return null;
}

/**
 * Parse axle type from text
 * Matches: single, tandem, triple, dual, 1-axle, 2-axle, 3-axle
 */
function parseAxleType(text) {
  if (/\btriple\b|\b3[- ]?axle\b/i.test(text)) return 'Triple';
  if (/\btandem\b|\bdual\b|\b2[- ]?axle\b/i.test(text)) return 'Tandem';
  if (/\bsingle\b|\b1[- ]?axle\b/i.test(text)) return 'Single';
  return null;
}

/**
 * Parse bolt pattern from text
 * Matches patterns: 5-4.5, 5x4.5, 5 on 4.5, 5-lug 4.5, etc.
 */
function parseBoltPattern(text) {
  const patterns = [
    /\b(\d)[- x]on[- ](\d+\.?\d*)/i,     // 5 on 4.5
    /\b(\d)[- x](\d+\.?\d*)/i,           // 5-4.5, 5x4.5
    /\b(\d)[- ]?lug[- ](\d+\.?\d*)/i,    // 5-lug 4.5
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const formatted = `${match[1]}-${match[2]}`;
      const option = BOLT_PATTERN_OPTIONS.find(opt => opt.value === formatted);
      if (option) {
        return option.label;
      }
      // Return formatted even if not in our list
      return `${match[1]} on ${match[2]}"`;
    }
  }
  
  return null;
}

/**
 * Parse brake type from text
 * Matches: electric, hydraulic, idler, no brakes
 */
function parseBrakeType(text) {
  if (/\belectric\b/i.test(text)) return 'Electric';
  if (/\bhydraulic\b|\bhydro\b/i.test(text)) return 'Hydraulic';
  if (/\bidler\b|\bno[- ]?brake/i.test(text)) return 'Idler';
  return null;
}

// =============================================================================
// URL / FILTER HELPERS
// =============================================================================

/**
 * Build filter URL from fitment selections
 * @param {object} fitment - Fitment selections
 * @param {string} baseUrl - Base URL (defaults to current pathname)
 * @returns {string} URL with filter query params
 */
export function buildFilterUrl(fitment, baseUrl = window.location.pathname) {
  const params = new URLSearchParams();
  
  if (fitment.capacity) {
    // Map capacity to facet value format
    const option = CAPACITY_OPTIONS.find(opt => opt.id === fitment.capacity);
    if (option) {
      params.append('Capacity[]', `${option.value} lb`);
    }
  }
  
  if (fitment.axleConfig) {
    // Map axle config to facet value
    const axleLabel = fitment.axleConfig.charAt(0).toUpperCase() + fitment.axleConfig.slice(1);
    params.append('Axle Type[]', axleLabel);
  }
  
  if (fitment.boltPattern) {
    const option = BOLT_PATTERN_OPTIONS.find(opt => opt.id === fitment.boltPattern);
    if (option) {
      params.append('Bolt Pattern[]', option.label);
    }
  }
  
  if (fitment.brakeType) {
    const option = BRAKE_TYPE_OPTIONS.find(opt => opt.id === fitment.brakeType);
    if (option) {
      params.append('Brake Type[]', option.label);
    }
  }
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Build URL with quick path chip filters
 */
export function buildQuickPathUrl(chip, baseUrl = window.location.pathname) {
  const params = new URLSearchParams();
  
  Object.entries(chip.filterParams).forEach(([key, value]) => {
    params.append(key, value);
  });
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Get current URL filters
 */
export function getCurrentFilters() {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const filters = {};
  
  for (const [key, value] of params.entries()) {
    if (filters[key]) {
      if (Array.isArray(filters[key])) {
        filters[key].push(value);
      } else {
        filters[key] = [filters[key], value];
      }
    } else {
      filters[key] = value;
    }
  }
  
  return filters;
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters() {
  const filters = getCurrentFilters();
  return Object.keys(filters).length > 0;
}

/**
 * Get clear filters URL
 */
export function getClearFiltersUrl() {
  return window.location.pathname;
}

// =============================================================================
// KIT INCLUDES - Standard components in axle kits
// =============================================================================

export const KIT_INCLUDES = [
  { id: 'hubs', label: 'Hubs', icon: 'circle' },
  { id: 'drums', label: 'Drums', icon: 'disc' },
  { id: 'bearings', label: 'Bearings', icon: 'cog' },
  { id: 'seals', label: 'Seals', icon: 'ring' },
  { id: 'hardware', label: 'Hardware', icon: 'wrench' },
];

/**
 * Get standard kit includes (all axle kits typically include these)
 */
export function getKitIncludes() {
  return KIT_INCLUDES;
}

// =============================================================================
// CATEGORY HELPERS
// =============================================================================

/**
 * Check if current category is relevant for a quick path chip
 */
export function isChipRelevantForCategory(chip, categoryName) {
  if (!categoryName) return chip.categories.includes('all');
  
  const normalizedCategory = categoryName.toLowerCase().replace(/\s+/g, '-');
  
  return chip.categories.some(cat => {
    if (cat === 'all') return true;
    return normalizedCategory.includes(cat);
  });
}

/**
 * Get category name from page context
 */
export function getCategoryName() {
  if (typeof window !== 'undefined' && window.categoryName) {
    return window.categoryName;
  }
  return null;
}

