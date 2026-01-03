import React from 'react';
import { motion } from 'motion/react';

/**
 * AxleToggleGroup - Segmented control for selecting axle configuration
 * Single / Tandem / Triple axle kits
 */
export function AxleToggleGroup({ value, onChange, availableAxles = ['single', 'tandem', 'triple'] }) {
  const options = [
    { id: 'single', label: 'Single Axle', shortLabel: '1 Axle' },
    { id: 'tandem', label: 'Tandem Axle', shortLabel: '2 Axle' },
    { id: 'triple', label: 'Triple Axle', shortLabel: '3 Axle' },
  ];

  return (
    <div className="tpu-axle-toggle">
      <div className="tpu-axle-toggle__group" role="radiogroup" aria-label="Select axle configuration">
        {options.map((option) => {
          const isSelected = value === option.id;
          const isAvailable = availableAxles.includes(option.id);
          
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-disabled={!isAvailable}
              disabled={!isAvailable}
              className={`tpu-axle-toggle__button ${isSelected ? 'tpu-axle-toggle__button--selected' : ''} ${!isAvailable ? 'tpu-axle-toggle__button--disabled' : ''}`}
              onClick={() => isAvailable && onChange(option.id)}
            >
              {isSelected && (
                <motion.div
                  className="tpu-axle-toggle__indicator"
                  layoutId="axle-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="tpu-axle-toggle__label">
                <span className="tpu-axle-toggle__label-full">{option.label}</span>
                <span className="tpu-axle-toggle__label-short">{option.shortLabel}</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="tpu-axle-toggle__helper">
        Axle count = number of axles (not wheels)
      </p>
    </div>
  );
}

export default AxleToggleGroup;

