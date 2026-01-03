import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { AxleToggleGroup } from '../AxleToggleGroup';
import { ShimmerButton } from '../ShimmerButton';
import { BlurFade } from '../BlurFade';
import {
  CAPACITY_OPTIONS,
  AXLE_OPTIONS,
  BOLT_PATTERN_OPTIONS,
  BRAKE_TYPE_OPTIONS,
  getSavedFitment,
  saveFitment,
  buildFilterUrl,
} from './fitmentUtils';

/**
 * FitmentFinder - Guided fitment selection form for category pages
 * Helps customers find the right trailer axle kit by capacity, axle count, bolt pattern, and brake type
 */
export function FitmentFinder({ categoryName = '', onApplyFilters }) {
  // Initialize state from localStorage
  const [fitment, setFitment] = useState(() => getSavedFitment());

  // Persist selections to localStorage
  useEffect(() => {
    saveFitment(fitment);
  }, [fitment]);

  const handleCapacityChange = (value) => {
    setFitment(prev => ({ ...prev, capacity: value }));
  };

  const handleAxleChange = (value) => {
    setFitment(prev => ({ ...prev, axleConfig: value }));
  };

  const handleBoltPatternChange = (value) => {
    setFitment(prev => ({ ...prev, boltPattern: value }));
  };

  const handleBrakeTypeChange = (value) => {
    setFitment(prev => ({ ...prev, brakeType: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const filterUrl = buildFilterUrl(fitment);
    
    if (onApplyFilters) {
      onApplyFilters(fitment, filterUrl);
    } else {
      // Navigate to filtered URL
      window.location.href = filterUrl;
    }
  };

  const hasSelections = Object.values(fitment).some(v => v);

  return (
    <div className="tpu-fitment-finder">
      <BlurFade delay={0.1} direction="up" offset={20}>
        <div className="tpu-fitment-finder__header">
          <h2 className="tpu-fitment-finder__title">Find Your Kit</h2>
          <p className="tpu-fitment-finder__subtitle">
            Match by capacity, axle count, bolt pattern & brake type
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.2} direction="up" offset={15}>
        <form className="tpu-fitment-finder__form" onSubmit={handleSubmit}>
          {/* Axle Count - Segmented Control */}
          <div className="tpu-fitment-finder__field tpu-fitment-finder__field--axle">
            <label className="tpu-fitment-finder__label">Axle Count</label>
            <AxleToggleGroup
              value={fitment.axleConfig}
              onChange={handleAxleChange}
              availableAxles={['single', 'tandem', 'triple']}
            />
          </div>

          {/* Row of selects */}
          <div className="tpu-fitment-finder__selects">
            {/* Capacity Select */}
            <div className="tpu-fitment-finder__field">
              <label className="tpu-fitment-finder__label">Capacity</label>
              <Select value={fitment.capacity} onValueChange={handleCapacityChange}>
                <SelectTrigger aria-label="Select capacity">
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  {CAPACITY_OPTIONS.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bolt Pattern Select */}
            <div className="tpu-fitment-finder__field">
              <label className="tpu-fitment-finder__label">Bolt Pattern</label>
              <Select value={fitment.boltPattern} onValueChange={handleBoltPatternChange}>
                <SelectTrigger aria-label="Select bolt pattern">
                  <SelectValue placeholder="Select bolt pattern" />
                </SelectTrigger>
                <SelectContent>
                  {BOLT_PATTERN_OPTIONS.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brake Type Select */}
            <div className="tpu-fitment-finder__field">
              <label className="tpu-fitment-finder__label">Brake Type</label>
              <Select value={fitment.brakeType} onValueChange={handleBrakeTypeChange}>
                <SelectTrigger aria-label="Select brake type">
                  <SelectValue placeholder="Select brake type" />
                </SelectTrigger>
                <SelectContent>
                  {BRAKE_TYPE_OPTIONS.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="tpu-fitment-finder__actions">
            <ShimmerButton
              type="submit"
              className="tpu-fitment-finder__submit"
              shimmerColor="#ffffff"
              background="rgba(255, 107, 53, 1)"
            >
              <svg 
                className="tpu-fitment-finder__submit-icon"
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
            </ShimmerButton>

            <a href="/pages/helpful-information.html/" className="tpu-fitment-finder__help-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              Not sure? Identify by bearing numbers
            </a>
          </div>
        </form>
      </BlurFade>

      {/* Trust Bar */}
      <BlurFade delay={0.3} direction="up" offset={10}>
        <div className="tpu-fitment-finder__trust">
          <span className="tpu-fitment-finder__trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Fitment Help
          </span>
          <span className="tpu-fitment-finder__trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            Fast Shipping
          </span>
          <span className="tpu-fitment-finder__trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Easy Returns
          </span>
        </div>
      </BlurFade>
    </div>
  );
}

export default FitmentFinder;

