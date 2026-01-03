import React, { useState, useCallback, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { ToggleGroup, ToggleGroupItem } from '../ui/ToggleGroup';
import { RadioGroup, RadioGroupItem, RadioGroupSwatch } from '../ui/RadioGroup';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/Tooltip';
import { cn } from '../lib/utils';
import {
  areRequiredOptionsSelected,
  getOptionRenderType,
  formatOptionValue,
} from './pdpUtils';
import { PDPFitment } from './PDPFitment';

/**
 * PDPBuyBox - Main product purchase interface
 * Includes title, price, rating, trust badges, options, quantity, and ATC
 */
export function PDPBuyBox({
  product,
  onAddToCart,
  onOptionChange,
  isAddingToCart = false,
  atcRef,
}) {
  const [quantity, setQuantity] = useState(product.min_purchase_quantity || 1);
  const [optionSelections, setOptionSelections] = useState({});
  const formRef = useRef(null);

  // Check if all required options are selected
  const canAddToCart = useMemo(
    () => areRequiredOptionsSelected(product.options, optionSelections),
    [product.options, optionSelections]
  );

  // Handle option change
  const handleOptionChange = useCallback(
    (optionId, value) => {
      setOptionSelections((prev) => ({
        ...prev,
        [optionId]: value,
      }));
      if (onOptionChange) {
        onOptionChange(optionId, value);
      }
    },
    [onOptionChange]
  );

  // Handle quantity change
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newValue = prev + delta;
      const min = product.min_purchase_quantity || 1;
      const max = product.max_purchase_quantity || 9999;
      return Math.max(min, Math.min(max, newValue));
    });
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart({
        productId: product.id,
        quantity,
        options: optionSelections,
      });
    }
  };

  // Format price display
  const formatPrice = (price) => {
    if (!price) return '';
    return price.formatted || `$${price.value?.toFixed(2)}`;
  };

  // Render product options
  const renderOption = (option) => {
    const renderType = getOptionRenderType(option);
    const currentValue = optionSelections[option.id];

    switch (renderType) {
      case 'swatch':
        return (
          <div key={option.id} className="tpu-pdp-buybox__option">
            <label className="tpu-pdp-buybox__option-label">
              {option.display_name}
              {option.required && <span className="tpu-pdp-buybox__required">*</span>}
            </label>
            <RadioGroup
              value={currentValue}
              onValueChange={(value) => handleOptionChange(option.id, value)}
              className="tpu-pdp-buybox__swatches"
            >
              {option.values?.map((value) => (
                <TooltipProvider key={value.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <RadioGroupSwatch
                        value={String(value.id)}
                        label={value.label}
                        color={value.data?.colors?.[0]}
                        image={value.data?.image_url}
                        disabled={!value.is_default && value.data?.is_unavailable}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {value.label}
                      {value.data?.is_unavailable && ' (Unavailable)'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </RadioGroup>
          </div>
        );

      case 'radio':
        return (
          <div key={option.id} className="tpu-pdp-buybox__option">
            <label className="tpu-pdp-buybox__option-label">
              {option.display_name}
              {option.required && <span className="tpu-pdp-buybox__required">*</span>}
            </label>
            <ToggleGroup
              type="single"
              value={currentValue}
              onValueChange={(value) => handleOptionChange(option.id, value)}
              className="tpu-pdp-buybox__radio-group"
            >
              {option.values?.map((value) => (
                <TooltipProvider key={value.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem
                        value={String(value.id)}
                        disabled={value.data?.is_unavailable}
                        aria-label={value.label}
                      >
                        {value.label}
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    {value.data?.is_unavailable && (
                      <TooltipContent>Not available with current selections</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </ToggleGroup>
          </div>
        );

      case 'select':
      default:
        return (
          <div key={option.id} className="tpu-pdp-buybox__option">
            <label className="tpu-pdp-buybox__option-label">
              {option.display_name}
              {option.required && <span className="tpu-pdp-buybox__required">*</span>}
            </label>
            <Select
              value={currentValue}
              onValueChange={(value) => handleOptionChange(option.id, value)}
            >
              <SelectTrigger aria-label={`Select ${option.display_name}`}>
                <SelectValue placeholder={`Select ${option.display_name}`} />
              </SelectTrigger>
              <SelectContent>
                {option.values?.map((value) => (
                  <SelectItem
                    key={value.id}
                    value={String(value.id)}
                    disabled={value.data?.is_unavailable}
                  >
                    {value.label}
                    {value.data?.price_modifier && ` (+${value.data.price_modifier})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
    }
  };

  return (
    <div className="tpu-pdp-buybox">
      {/* Product Title */}
      <h1 className="tpu-pdp-buybox__title">{product.title}</h1>

      {/* Brand */}
      {product.brand && (
        <a href={product.brand.url} className="tpu-pdp-buybox__brand">
          {product.brand.name}
        </a>
      )}

      {/* Rating Summary */}
      {product.rating && product.num_reviews > 0 && (
        <div className="tpu-pdp-buybox__rating">
          <div className="tpu-pdp-buybox__stars" aria-label={`${product.rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={cn(
                  'tpu-pdp-buybox__star',
                  star <= product.rating && 'tpu-pdp-buybox__star--filled'
                )}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={star <= product.rating ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <a href="#reviews" className="tpu-pdp-buybox__review-link">
            {product.num_reviews} {product.num_reviews === 1 ? 'review' : 'reviews'}
          </a>
        </div>
      )}

      {/* Price */}
      <div className="tpu-pdp-buybox__price">
        {product.price?.rrp?.value > product.price?.without_tax?.value && (
          <span className="tpu-pdp-buybox__price-compare">
            {formatPrice(product.price.rrp)}
          </span>
        )}
        <span className="tpu-pdp-buybox__price-current">
          {formatPrice(product.price?.without_tax || product.price?.with_tax)}
        </span>
        {product.price?.saved && (
          <Badge variant="destructive" className="tpu-pdp-buybox__price-savings">
            Save {formatPrice(product.price.saved)}
          </Badge>
        )}
      </div>

      {/* SKU */}
      {product.sku && (
        <p className="tpu-pdp-buybox__sku">
          SKU: <span data-product-sku>{product.sku}</span>
        </p>
      )}

      {/* Trust Badges */}
      <div className="tpu-pdp-buybox__trust-row">
        <Badge variant="outline" className="tpu-pdp-buybox__trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          Fast Shipping
        </Badge>
        <Badge variant="outline" className="tpu-pdp-buybox__trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          Easy Returns
        </Badge>
        <Badge variant="outline" className="tpu-pdp-buybox__trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Fitment Help
        </Badge>
      </div>

      {/* Fitment Block */}
      <PDPFitment product={product} />

      {/* Product Options */}
      <form ref={formRef} onSubmit={handleAddToCart} className="tpu-pdp-buybox__form">
        <input type="hidden" name="action" value="add" />
        <input type="hidden" name="product_id" value={product.id} />

        {/* Render all product options */}
        {product.options?.length > 0 && (
          <div className="tpu-pdp-buybox__options">
            {product.options.map(renderOption)}
          </div>
        )}

        {/* Quantity Selector */}
        {product.show_quantity_input !== false && (
          <div className="tpu-pdp-buybox__quantity">
            <label className="tpu-pdp-buybox__option-label">Quantity</label>
            <div className="tpu-pdp-buybox__quantity-control">
              <button
                type="button"
                className="tpu-pdp-buybox__quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= (product.min_purchase_quantity || 1)}
                aria-label="Decrease quantity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <input
                type="number"
                name="qty[]"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min={product.min_purchase_quantity || 1}
                max={product.max_purchase_quantity || 9999}
                className="tpu-pdp-buybox__quantity-input"
                aria-label="Quantity"
              />
              <button
                type="button"
                className="tpu-pdp-buybox__quantity-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= (product.max_purchase_quantity || 9999)}
                aria-label="Increase quantity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="tpu-pdp-buybox__actions" ref={atcRef}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="tpu-pdp-buybox__atc-wrapper">
                  <Button
                    type="submit"
                    size="lg"
                    className="tpu-pdp-buybox__atc"
                    disabled={!canAddToCart || isAddingToCart || product.out_of_stock}
                  >
                    {isAddingToCart ? (
                      <>
                        <svg className="tpu-pdp-buybox__spinner" width="20" height="20" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="60" strokeLinecap="round" />
                        </svg>
                        Adding...
                      </>
                    ) : product.out_of_stock ? (
                      'Out of Stock'
                    ) : product.pre_order ? (
                      'Pre-Order'
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              {!canAddToCart && product.options?.length > 0 && (
                <TooltipContent>
                  Please select all required options
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Out of Stock Message */}
        {product.out_of_stock && (
          <div className="tpu-pdp-buybox__stock-message">
            {product.out_of_stock_message || 'This product is currently out of stock.'}
          </div>
        )}
      </form>
    </div>
  );
}

export default PDPBuyBox;

