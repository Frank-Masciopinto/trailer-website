import React, { useMemo } from 'react';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../lib/utils';
import { getStockStatus, getShippingDisplay } from './pdpUtils';

/**
 * PDPShipping - Stock status and shipping information
 * Shows safe copy without unreliable shipping dates
 */
export function PDPShipping({ product }) {
  const stockStatus = useMemo(() => getStockStatus(product), [product]);
  const shippingDisplay = useMemo(() => getShippingDisplay(product), [product]);

  return (
    <Card className="tpu-pdp-shipping">
      <CardContent className="tpu-pdp-shipping__content">
        {/* Stock Status */}
        <div className="tpu-pdp-shipping__row">
          <div className="tpu-pdp-shipping__icon">
            {stockStatus.inStock ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tpu-pdp-shipping__icon--success"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tpu-pdp-shipping__icon--error"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>
          <div className="tpu-pdp-shipping__info">
            <Badge
              variant={stockStatus.variant}
              className="tpu-pdp-shipping__badge"
            >
              {stockStatus.label}
            </Badge>
          </div>
        </div>

        {/* Shipping Info - only show if in stock */}
        {stockStatus.inStock && (
          <div className="tpu-pdp-shipping__row">
            <div className="tpu-pdp-shipping__icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="tpu-pdp-shipping__info">
              <span className="tpu-pdp-shipping__text">
                {shippingDisplay.freeShipping && (
                  <Badge variant="success" className="tpu-pdp-shipping__free">
                    Free Shipping
                  </Badge>
                )}
                <span className="tpu-pdp-shipping__label">
                  {shippingDisplay.label}
                </span>
              </span>
              {shippingDisplay.sublabel && (
                <span className="tpu-pdp-shipping__sublabel">
                  {shippingDisplay.sublabel}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Returns Info */}
        <div className="tpu-pdp-shipping__row">
          <div className="tpu-pdp-shipping__icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </div>
          <div className="tpu-pdp-shipping__info">
            <span className="tpu-pdp-shipping__label">Easy 30-day returns</span>
            <a href="#shipping-returns" className="tpu-pdp-shipping__link">
              View policy
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PDPShipping;

