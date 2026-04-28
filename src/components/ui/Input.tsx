import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const baseInputClass =
  'w-full px-3.5 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-shadow';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseInputClass} ${error ? 'border-[var(--danger)] focus:ring-[var(--danger)]' : ''} ${className}`}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-[var(--text-muted)] mt-1.5">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-[var(--danger)] mt-1.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`${baseInputClass} resize-none ${error ? 'border-[var(--danger)] focus:ring-[var(--danger)]' : ''} ${className}`}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-[var(--text-muted)] mt-1.5">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-[var(--danger)] mt-1.5">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
