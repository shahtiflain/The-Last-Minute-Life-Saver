import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'premium' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-bg-surface-hover text-text-primary border-border-color',
    premium: 'bg-primary/5 text-primary border-primary/20 shadow-sm',
    success: 'bg-success/5 text-success border-success/20',
    warning: 'bg-warning/5 text-warning border-warning/20',
    danger: 'bg-danger/5 text-danger border-danger/20',
    outline: 'bg-transparent text-text-secondary border-border-color',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
