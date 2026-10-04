import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-[10px] border border-border-color bg-bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-[3px] focus:ring-primary/10 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:border-border-highlight',
            error && 'border-danger focus:ring-danger/10 focus:border-danger',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
