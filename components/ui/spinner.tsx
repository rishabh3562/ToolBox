import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const spinnerVariants = cva(
  'animate-spin rounded-full border-solid border-current border-r-transparent',
  {
    variants: {
      size: {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-3', 
        lg: 'w-8 h-8 border-4',
      },
      color: {
        primary: 'text-primary',
        secondary: 'text-secondary',
        input: 'text-input',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
    },
  }
);

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'size'>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, color, ...props }, ref) => {
    return (
      <div
        className={cn(spinnerVariants({ size, color, className }))}
        role="status"
        ref={ref}
        {...props}
      >
        {/* Screen Reader only text for accessibility */}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };