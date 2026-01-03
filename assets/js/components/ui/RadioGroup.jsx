import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '../lib/utils';

/**
 * RadioGroup - Radio button group component based on shadcn/ui
 * Built on Radix UI RadioGroup primitives
 */

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('tpu-radio-group', className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn('tpu-radio-group__item', className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="tpu-radio-group__indicator">
      <div className="tpu-radio-group__dot" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

/**
 * RadioGroupCard - Radio option as a selectable card
 */
const RadioGroupCard = React.forwardRef(
  ({ className, value, label, description, icon, disabled, ...props }, ref) => (
    <RadioGroupPrimitive.Item
      ref={ref}
      value={value}
      disabled={disabled}
      className={cn(
        'tpu-radio-card',
        disabled && 'tpu-radio-card--disabled',
        className
      )}
      {...props}
    >
      <div className="tpu-radio-card__content">
        {icon && <div className="tpu-radio-card__icon">{icon}</div>}
        <div className="tpu-radio-card__text">
          <span className="tpu-radio-card__label">{label}</span>
          {description && (
            <span className="tpu-radio-card__description">{description}</span>
          )}
        </div>
      </div>
      <RadioGroupPrimitive.Indicator className="tpu-radio-card__indicator">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
);
RadioGroupCard.displayName = 'RadioGroupCard';

/**
 * RadioGroupSwatch - Radio option as a color/image swatch
 */
const RadioGroupSwatch = React.forwardRef(
  ({ className, value, label, color, image, disabled, ...props }, ref) => (
    <RadioGroupPrimitive.Item
      ref={ref}
      value={value}
      disabled={disabled}
      className={cn(
        'tpu-radio-swatch',
        disabled && 'tpu-radio-swatch--disabled',
        className
      )}
      aria-label={label}
      {...props}
    >
      {image ? (
        <img src={image} alt={label} className="tpu-radio-swatch__image" />
      ) : (
        <div
          className="tpu-radio-swatch__color"
          style={{ backgroundColor: color }}
        />
      )}
      <RadioGroupPrimitive.Indicator className="tpu-radio-swatch__indicator">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
);
RadioGroupSwatch.displayName = 'RadioGroupSwatch';

export { RadioGroup, RadioGroupItem, RadioGroupCard, RadioGroupSwatch };

