interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 rounded-lg border border-border bg-white text-foreground placeholder:text-muted/60
          focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-error focus:ring-error/40' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
