import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from '../ui/Sheet';
import { Alert, AlertTitle, AlertDescription } from '../ui/Alert';
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
import { cn } from '../lib/utils';
import {
  FITMENT_STATES,
  determineFitmentState,
  getFitmentStateConfig,
  buildMatchingKitsUrl,
  buildContactUrl,
  CAPACITY_OPTIONS,
  AXLE_OPTIONS,
  BOLT_PATTERN_OPTIONS,
  BRAKE_TYPE_OPTIONS,
  getSavedFitment,
  saveFitment,
} from './pdpUtils';
import {
  trackFitmentState,
  trackFitmentDrawerOpen,
  trackFitmentSubmit,
} from './pdpAnalytics';

/**
 * PDPFitment - Fitment confidence block with state machine and drawer
 */
export function PDPFitment({ product }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selections, setSelections] = useState(() => getSavedFitment());

  // Determine fitment state from product data
  const { state, tags, tagCount } = useMemo(
    () => determineFitmentState(product),
    [product]
  );

  // Get display configuration for current state
  const stateConfig = useMemo(() => getFitmentStateConfig(state), [state]);

  // Track fitment state on mount
  useEffect(() => {
    trackFitmentState(state, tags);
  }, [state, tags]);

  // Persist selections to localStorage
  useEffect(() => {
    saveFitment(selections);
  }, [selections]);

  // Handle drawer open
  const handleDrawerOpen = (open) => {
    setDrawerOpen(open);
    if (open) {
      trackFitmentDrawerOpen(state);
    }
  };

  // Handle selection changes
  const handleCapacityChange = (value) => {
    setSelections((prev) => ({ ...prev, capacity: value }));
  };

  const handleAxleChange = (value) => {
    setSelections((prev) => ({ ...prev, axleConfig: value }));
  };

  const handleBoltPatternChange = (value) => {
    setSelections((prev) => ({ ...prev, boltPattern: value }));
  };

  const handleBrakeTypeChange = (value) => {
    setSelections((prev) => ({ ...prev, brakeType: value }));
  };

  // Handle "Show matching kits" click
  const handleShowMatchingKits = () => {
    trackFitmentSubmit(selections);
    const url = buildMatchingKitsUrl(selections);
    window.location.href = url;
  };

  // Build contact URL with product info
  const contactUrl = useMemo(() => buildContactUrl(product), [product]);

  // Format tag display
  const formatTag = (label, value) => {
    if (!value) return null;
    return (
      <span className="tpu-pdp-fitment__tag">
        <span className="tpu-pdp-fitment__tag-label">{label}:</span>
        <span className="tpu-pdp-fitment__tag-value">{value}</span>
      </span>
    );
  };

  return (
    <div className="tpu-pdp-fitment">
      <Sheet open={drawerOpen} onOpenChange={handleDrawerOpen}>
        {/* Fitment Alert Card */}
        <Alert
          variant={stateConfig.variant}
          className={cn(
            'tpu-pdp-fitment__alert',
            `tpu-pdp-fitment__alert--${state}`
          )}
        >
          <div className="tpu-pdp-fitment__alert-content">
            {/* Icon */}
            <div className="tpu-pdp-fitment__icon">
              {state === FITMENT_STATES.VERIFIED && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )}
              {state === FITMENT_STATES.PARTIAL && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              {state === FITMENT_STATES.UNVERIFIED && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              )}
            </div>

            {/* Text Content */}
            <div className="tpu-pdp-fitment__text">
              <AlertTitle className="tpu-pdp-fitment__title">
                {stateConfig.title}
              </AlertTitle>
              
              {/* Show detected tags for verified/partial */}
              {tagCount > 0 && (
                <div className="tpu-pdp-fitment__tags">
                  {formatTag('Capacity', tags.capacity)}
                  {formatTag('Bolt Pattern', tags.boltPattern)}
                  {formatTag('Brake Type', tags.brakeType)}
                </div>
              )}
              
              {tagCount === 0 && (
                <AlertDescription className="tpu-pdp-fitment__description">
                  {stateConfig.description}
                </AlertDescription>
              )}
            </div>

            {/* CTA Button */}
            <SheetTrigger asChild>
              <Button
                variant={state === FITMENT_STATES.VERIFIED ? 'outline' : 'default'}
                size="sm"
                className="tpu-pdp-fitment__cta"
              >
                {stateConfig.ctaText}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Button>
            </SheetTrigger>
          </div>
        </Alert>

        {/* Fitment Drawer */}
        <SheetContent side="right" className="tpu-pdp-fitment__drawer">
          <SheetHeader>
            <SheetTitle>Confirm Your Fitment</SheetTitle>
            <SheetDescription>
              Select your trailer specs to find compatible products
            </SheetDescription>
          </SheetHeader>

          <div className="tpu-pdp-fitment__drawer-body">
            {/* Axle Count - Toggle Group */}
            <div className="tpu-pdp-fitment__field">
              <label className="tpu-pdp-fitment__label">Axle Count</label>
              <ToggleGroup
                type="single"
                value={selections.axleConfig}
                onValueChange={handleAxleChange}
                className="tpu-pdp-fitment__toggle-group"
              >
                {AXLE_OPTIONS.map((option) => (
                  <ToggleGroupItem
                    key={option.id}
                    value={option.id}
                    aria-label={option.label}
                  >
                    <span className="tpu-pdp-fitment__toggle-icon">
                      {option.id === 'single' && '1'}
                      {option.id === 'tandem' && '2'}
                      {option.id === 'triple' && '3'}
                    </span>
                    <span className="tpu-pdp-fitment__toggle-text">
                      {option.shortLabel}
                    </span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Capacity Select */}
            <div className="tpu-pdp-fitment__field">
              <label className="tpu-pdp-fitment__label">Axle Capacity</label>
              <Select value={selections.capacity} onValueChange={handleCapacityChange}>
                <SelectTrigger aria-label="Select axle capacity">
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  {CAPACITY_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bolt Pattern Select */}
            <div className="tpu-pdp-fitment__field">
              <label className="tpu-pdp-fitment__label">Bolt Pattern</label>
              <Select value={selections.boltPattern} onValueChange={handleBoltPatternChange}>
                <SelectTrigger aria-label="Select bolt pattern">
                  <SelectValue placeholder="Select bolt pattern" />
                </SelectTrigger>
                <SelectContent>
                  {BOLT_PATTERN_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brake Type Select */}
            <div className="tpu-pdp-fitment__field">
              <label className="tpu-pdp-fitment__label">Brake Type</label>
              <Select value={selections.brakeType} onValueChange={handleBrakeTypeChange}>
                <SelectTrigger aria-label="Select brake type">
                  <SelectValue placeholder="Select brake type" />
                </SelectTrigger>
                <SelectContent>
                  {BRAKE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter className="tpu-pdp-fitment__drawer-footer">
            <Button
              onClick={handleShowMatchingKits}
              className="tpu-pdp-fitment__submit"
              size="lg"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Show Matching Kits
            </Button>

            <a href={contactUrl} className="tpu-pdp-fitment__help-link">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Ask an Expert
            </a>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default PDPFitment;

