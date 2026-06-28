import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-text-primary text-bg-base hover:opacity-90 shadow-[0_1px_2px_rgba(0,0,0,0.12)] border border-transparent dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]',
      premium: 'bg-gradient-to-b from-[#383838] to-[#1E1E1E] dark:from-[#3a3a3a] dark:to-[#222222] text-white border border-[#444] shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:brightness-110',
      secondary: 'bg-bg-surface border border-border-color text-text-primary hover:bg-bg-surface-hover shadow-sm',
      outline: 'bg-transparent border border-border-color text-text-primary hover:bg-bg-surface-hover',
      danger: 'bg-danger text-white hover:opacity-90 shadow-sm border border-transparent',
      ghost: 'bg-transparent text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary',
    };

    const sizes = {
      sm: 'h-7 px-3 text-xs rounded-md',
      md: 'h-8 px-4 text-sm rounded-md',
      lg: 'h-10 px-6 text-sm rounded-lg',
      icon: 'h-8 w-8 rounded-md flex items-center justify-center p-0'
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
