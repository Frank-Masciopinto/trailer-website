import React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '../lib/utils';

/**
 * Separator - Visual divider based on shadcn/ui
 * Built on Radix UI Separator primitives
 */

const Separator = React.forwardRef(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'tpu-separator',
        orientation === 'horizontal' ? 'tpu-separator--horizontal' : 'tpu-separator--vertical',
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

