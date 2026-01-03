import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '../lib/utils';

/**
 * Checkbox - Checkbox input component based on shadcn/ui
 * Built on Radix UI Checkbox primitives
 */

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn('tpu-checkbox', className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="tpu-checkbox__indicator">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

/**
 * CheckboxWithLabel - Checkbox with integrated label for forms
 */
const CheckboxWithLabel = React.forwardRef(
  ({ className, label, description, id, disabled, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('tpu-checkbox-field', disabled && 'tpu-checkbox-field--disabled', className)}>
        <Checkbox ref={ref} id={checkboxId} disabled={disabled} {...props} />
        <div className="tpu-checkbox-field__content">
          <label htmlFor={checkboxId} className="tpu-checkbox-field__label">
            {label}
          </label>
          {description && (
            <p className="tpu-checkbox-field__description">{description}</p>
          )}
        </div>
      </div>
    );
  }
);
CheckboxWithLabel.displayName = 'CheckboxWithLabel';

export { Checkbox, CheckboxWithLabel };

