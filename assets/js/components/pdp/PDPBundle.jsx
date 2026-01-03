import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Checkbox, CheckboxWithLabel } from '../ui/Checkbox';
import { Alert, AlertTitle, AlertDescription } from '../ui/Alert';
import { cn } from '../lib/utils';
import {
  getBundleRecommendations,
  calculateBundleTotal,
} from './pdpUtils';
import {
  trackBundleAddRecommended,
  trackBundleCustomizeOpen,
  trackBundleAddSelected,
} from './pdpAnalytics';

/**
 * PDPBundle - "Complete the Job" bundle recommendations
 * Category-aware add-on suggestions with one-click add
 */
export function PDPBundle({ product, onAddToCart }) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [addResult, setAddResult] = useState(null); // 'success' | 'partial' | 'error'

  // Get bundle recommendations based on product category
  const { addons, categoryMatched } = useMemo(
    () => getBundleRecommendations(product),
    [product]
  );

  // Calculate totals
  const allAddonsTotal = useMemo(() => calculateBundleTotal(addons), [addons]);
  
  const selectedItems = useMemo(() => {
    return addons.filter((addon) => selectedAddons[addon.sku]);
  }, [addons, selectedAddons]);
  
  const selectedTotal = useMemo(
    () => calculateBundleTotal(selectedItems),
    [selectedItems]
  );

  // Initialize all addons as selected when customizing opens
  const handleCustomizeOpen = () => {
    if (!isCustomizing) {
      const initial = {};
      addons.forEach((addon) => {
        initial[addon.sku] = true;
      });
      setSelectedAddons(initial);
      trackBundleCustomizeOpen();
    }
    setIsCustomizing(!isCustomizing);
  };

  // Toggle addon selection
  const handleToggleAddon = (sku, checked) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [sku]: checked,
    }));
  };

  // Add recommended bundle (one-click)
  const handleAddRecommended = async () => {
    setIsAdding(true);
    setAddResult(null);

    try {
      const productSkus = addons.map((a) => a.sku);
      trackBundleAddRecommended(productSkus, allAddonsTotal);

      if (onAddToCart) {
        const result = await onAddToCart(addons);
        setAddResult(result.success ? 'success' : 'partial');
      } else {
        // Fallback: simulate success
        setAddResult('success');
      }
    } catch (error) {
      console.error('Bundle add error:', error);
      setAddResult('error');
    } finally {
      setIsAdding(false);
    }
  };

  // Add selected items from customize view
  const handleAddSelected = async () => {
    if (selectedItems.length === 0) return;

    setIsAdding(true);
    setAddResult(null);

    try {
      const productSkus = selectedItems.map((a) => a.sku);
      trackBundleAddSelected(productSkus, selectedTotal);

      if (onAddToCart) {
        const result = await onAddToCart(selectedItems);
        setAddResult(result.success ? 'success' : 'partial');
      } else {
        setAddResult('success');
      }
    } catch (error) {
      console.error('Bundle add error:', error);
      setAddResult('error');
    } finally {
      setIsAdding(false);
    }
  };

  // Format price
  const formatPrice = (price) => `$${price.toFixed(2)}`;

  // Don't render if no addons
  if (!addons || addons.length === 0) {
    return null;
  }

  return (
    <Card className="tpu-pdp-bundle">
      <CardHeader className="tpu-pdp-bundle__header">
        <div className="tpu-pdp-bundle__header-content">
          <CardTitle className="tpu-pdp-bundle__title">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
              <polyline points="7.5 19.79 7.5 14.6 3 12" />
              <polyline points="21 12 16.5 14.6 16.5 19.79" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            Complete the Job
          </CardTitle>
          <Badge variant="secondary" className="tpu-pdp-bundle__badge">
            Recommended
          </Badge>
        </div>
        <p className="tpu-pdp-bundle__subtitle">
          Frequently purchased together with this product
        </p>
      </CardHeader>

      <CardContent className="tpu-pdp-bundle__content">
        {/* Quick View - shown when not customizing */}
        {!isCustomizing && (
          <div className="tpu-pdp-bundle__quick">
            <ul className="tpu-pdp-bundle__items-preview">
              {addons.map((addon) => (
                <li key={addon.sku} className="tpu-pdp-bundle__item-preview">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="tpu-pdp-bundle__item-name">{addon.name}</span>
                  <span className="tpu-pdp-bundle__item-price">{formatPrice(addon.price)}</span>
                </li>
              ))}
            </ul>
            <div className="tpu-pdp-bundle__total">
              <span className="tpu-pdp-bundle__total-label">Bundle Total:</span>
              <span className="tpu-pdp-bundle__total-value">{formatPrice(allAddonsTotal)}</span>
            </div>
          </div>
        )}

        {/* Customize View */}
        <AnimatePresence>
          {isCustomizing && (
            <motion.div
              className="tpu-pdp-bundle__customize"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="tpu-pdp-bundle__items-list">
                {addons.map((addon) => (
                  <li key={addon.sku} className="tpu-pdp-bundle__item">
                    <CheckboxWithLabel
                      checked={selectedAddons[addon.sku]}
                      onCheckedChange={(checked) => handleToggleAddon(addon.sku, checked)}
                      label={addon.name}
                      description={formatPrice(addon.price)}
                    />
                  </li>
                ))}
              </ul>
              {selectedItems.length > 0 && (
                <div className="tpu-pdp-bundle__selected-total">
                  <span className="tpu-pdp-bundle__total-label">
                    Selected ({selectedItems.length}):
                  </span>
                  <span className="tpu-pdp-bundle__total-value">
                    {formatPrice(selectedTotal)}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Alert */}
        <AnimatePresence>
          {addResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {addResult === 'success' && (
                <Alert variant="success" className="tpu-pdp-bundle__alert">
                  <AlertTitle>Added to cart!</AlertTitle>
                  <AlertDescription>
                    Bundle items have been added to your cart.
                  </AlertDescription>
                </Alert>
              )}
              {addResult === 'partial' && (
                <Alert variant="warning" className="tpu-pdp-bundle__alert">
                  <AlertTitle>Partially added</AlertTitle>
                  <AlertDescription>
                    Some items couldn't be added. Check your cart for details.
                  </AlertDescription>
                </Alert>
              )}
              {addResult === 'error' && (
                <Alert variant="destructive" className="tpu-pdp-bundle__alert">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to add items. Please try again.
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="tpu-pdp-bundle__footer">
        {!isCustomizing ? (
          <>
            <Button
              onClick={handleAddRecommended}
              disabled={isAdding}
              className="tpu-pdp-bundle__add-btn"
            >
              {isAdding ? (
                <>
                  <svg className="tpu-pdp-bundle__spinner" width="18" height="18" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="60" strokeLinecap="round" />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Add Recommended Bundle
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCustomizeOpen}
              className="tpu-pdp-bundle__customize-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Customize
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleAddSelected}
              disabled={isAdding || selectedItems.length === 0}
              className="tpu-pdp-bundle__add-btn"
            >
              {isAdding ? (
                'Adding...'
              ) : (
                `Add Selected (${selectedItems.length})`
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleCustomizeOpen}
              className="tpu-pdp-bundle__cancel-btn"
            >
              Cancel
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default PDPBundle;

