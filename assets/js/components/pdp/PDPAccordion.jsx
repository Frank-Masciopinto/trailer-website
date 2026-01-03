import React, { useMemo } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/Accordion';
import { cn } from '../lib/utils';
import { isLightingProduct } from './pdpUtils';
import { trackAccordionOpen } from './pdpAnalytics';

/**
 * PDPAccordion - Below-fold collapsible content sections
 * Includes Shipping & Returns, Fitment Help, Install Guide, Warranty, Compliance
 */
export function PDPAccordion({ product, onOpenFitmentDrawer }) {
  const showCompliance = useMemo(() => isLightingProduct(product), [product]);

  // Handle accordion value change for analytics
  const handleValueChange = (value) => {
    if (value) {
      trackAccordionOpen(value);
    }
  };

  return (
    <div className="tpu-pdp-accordion" id="product-details-accordion">
      <Accordion
        type="single"
        collapsible
        onValueChange={handleValueChange}
        className="tpu-pdp-accordion__container"
      >
        {/* Shipping & Returns */}
        <AccordionItem value="shipping-returns" id="shipping-returns">
          <AccordionTrigger className="tpu-pdp-accordion__trigger">
            <span className="tpu-pdp-accordion__trigger-content">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Shipping & Returns
            </span>
          </AccordionTrigger>
          <AccordionContent className="tpu-pdp-accordion__content">
            <div className="tpu-pdp-accordion__section">
              <h4>Shipping</h4>
              <ul>
                <li>Orders ship from our US and Canada warehouses</li>
                <li>Most orders ship within 1-2 business days</li>
                <li>Free shipping on orders over $99 (continental US)</li>
                <li>Expedited shipping available at checkout</li>
              </ul>
            </div>
            <div className="tpu-pdp-accordion__section">
              <h4>Returns</h4>
              <ul>
                <li>30-day hassle-free returns</li>
                <li>Items must be unused and in original packaging</li>
                <li>Return shipping is customer's responsibility unless item is defective</li>
                <li>Refunds processed within 5-7 business days</li>
              </ul>
              <a href="/shipping-returns/" className="tpu-pdp-accordion__link">
                View Full Return Policy
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Fitment Help */}
        <AccordionItem value="fitment-help">
          <AccordionTrigger className="tpu-pdp-accordion__trigger">
            <span className="tpu-pdp-accordion__trigger-content">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Fitment Help
            </span>
          </AccordionTrigger>
          <AccordionContent className="tpu-pdp-accordion__content">
            <div className="tpu-pdp-accordion__section">
              <h4>How to Confirm Fitment</h4>
              <p>
                Not sure if this product fits your trailer? Our fitment guide helps you
                match products to your specific axle capacity, bolt pattern, and brake type.
              </p>
              <button
                type="button"
                className="tpu-pdp-accordion__action-btn"
                onClick={onOpenFitmentDrawer}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Open Fitment Finder
              </button>
            </div>
            <div className="tpu-pdp-accordion__section">
              <h4>Need Expert Help?</h4>
              <p>
                Our team can help you identify the right parts for your trailer.
                Call or email us with your trailer make, model, and year.
              </p>
              <div className="tpu-pdp-accordion__contact">
                <a href="/contact-us/" className="tpu-pdp-accordion__link">
                  Contact Support
                </a>
                <a href="/pages/helpful-information.html/" className="tpu-pdp-accordion__link">
                  Identify by Bearing Numbers
                </a>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Install Guide */}
        <AccordionItem value="install-guide">
          <AccordionTrigger className="tpu-pdp-accordion__trigger">
            <span className="tpu-pdp-accordion__trigger-content">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              Install Guide & Torque Specs
            </span>
          </AccordionTrigger>
          <AccordionContent className="tpu-pdp-accordion__content">
            <div className="tpu-pdp-accordion__section">
              <h4>Installation Tips</h4>
              <ul>
                <li>Always use a torque wrench for proper fastener tightness</li>
                <li>Re-pack bearings with fresh grease during installation</li>
                <li>Adjust bearings per manufacturer specifications</li>
                <li>Check wheel lug nuts after first 50 miles</li>
              </ul>
            </div>
            <div className="tpu-pdp-accordion__section">
              <h4>Common Torque Specifications</h4>
              <table className="tpu-pdp-accordion__table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Torque (ft-lbs)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1/2" Wheel Lug Nuts</td>
                    <td>75-85</td>
                  </tr>
                  <tr>
                    <td>9/16" Wheel Lug Nuts</td>
                    <td>90-120</td>
                  </tr>
                  <tr>
                    <td>Castle Nut (bearing)</td>
                    <td>Hand tight + 1/4 turn</td>
                  </tr>
                  <tr>
                    <td>U-Bolt Nuts</td>
                    <td>45-65</td>
                  </tr>
                </tbody>
              </table>
              <p className="tpu-pdp-accordion__note">
                * Always refer to manufacturer specifications for exact values
              </p>
            </div>
            <a href="/pages/helpful-information.html/" className="tpu-pdp-accordion__link">
              View All Install Guides
            </a>
          </AccordionContent>
        </AccordionItem>

        {/* Warranty */}
        <AccordionItem value="warranty">
          <AccordionTrigger className="tpu-pdp-accordion__trigger">
            <span className="tpu-pdp-accordion__trigger-content">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Warranty
            </span>
          </AccordionTrigger>
          <AccordionContent className="tpu-pdp-accordion__content">
            <div className="tpu-pdp-accordion__section">
              <h4>Manufacturer Warranty</h4>
              <p>
                This product is covered by the manufacturer's warranty against defects
                in materials and workmanship. Warranty duration varies by product category:
              </p>
              <ul>
                <li><strong>Axles:</strong> 1 year limited warranty</li>
                <li><strong>Hubs & Drums:</strong> 1 year limited warranty</li>
                <li><strong>Bearings & Seals:</strong> 90 days</li>
                <li><strong>Lights & Electrical:</strong> 1 year</li>
                <li><strong>Brakes:</strong> 1 year limited warranty</li>
              </ul>
            </div>
            <div className="tpu-pdp-accordion__section">
              <h4>What's Covered</h4>
              <ul>
                <li>Manufacturing defects</li>
                <li>Premature failure under normal use</li>
              </ul>
              <h4>What's Not Covered</h4>
              <ul>
                <li>Normal wear and tear</li>
                <li>Improper installation</li>
                <li>Overloading or misuse</li>
                <li>Accident damage</li>
              </ul>
            </div>
            <a href="/pages/terms-and-conditions.html" className="tpu-pdp-accordion__link">
              View Full Warranty Policy
            </a>
          </AccordionContent>
        </AccordionItem>

        {/* Compliance - Only for lighting products */}
        {showCompliance && (
          <AccordionItem value="compliance">
            <AccordionTrigger className="tpu-pdp-accordion__trigger">
              <span className="tpu-pdp-accordion__trigger-content">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                DOT Compliance
              </span>
            </AccordionTrigger>
            <AccordionContent className="tpu-pdp-accordion__content">
              <div className="tpu-pdp-accordion__section">
                <h4>FMVSS/CMVSS 108 Compliance</h4>
                <p>
                  This lighting product meets FMVSS 108 (USA) and CMVSS 108 (Canada)
                  safety standards when installed per the included wiring diagram.
                </p>
                <ul>
                  <li>DOT/SAE approved for on-road use</li>
                  <li>Meets reflectivity and visibility requirements</li>
                  <li>Waterproof rated for trailer applications</li>
                </ul>
                <p className="tpu-pdp-accordion__note">
                  * Proper installation and wiring is required for compliance.
                  Always follow the included installation instructions.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}

export default PDPAccordion;

