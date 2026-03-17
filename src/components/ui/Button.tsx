interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary text-white hover:bg-primary-light',
  secondary: 'bg-accent text-primary hover:bg-accent-light',
  outline: 'border border-border text-foreground hover:bg-card-hover',
  ghost: 'text-muted hover:text-foreground hover:bg-card-hover',
  danger: 'bg-error text-white hover:bg-red-600',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer
        ${variantClasses[variant]} ${sizeClasses[size]}
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
