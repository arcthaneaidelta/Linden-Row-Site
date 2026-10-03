import React from 'react';
import { Check } from 'lucide-react';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  showSuccessCheck?: boolean;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  showSuccessCheck,
  required,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || `field_${label.toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-[0.08em] text-ink-2">
          {label} {required && <span className="text-accent">*</span>}
        </label>
        {showSuccessCheck && !error && (
          <span className="flex items-center text-xs text-success gap-1">
            <Check className="w-3.5 h-3.5" />
            <span className="text-[11px]">Verified</span>
          </span>
        )}
      </div>

      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className={`w-full bg-surface-elevated text-ink px-3.5 py-2.5 rounded-sm border text-sm transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-info focus:ring-offset-2 ${
          error ? 'border-error ring-1 ring-error' : 'border-border hover:border-border-strong'
        } ${className}`}
        {...props}
      />

      {/* Reserved error / helper text container to avoid CLS */}
      <div className="min-h-[20px] pt-1">
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-error transition-opacity duration-fast">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-ink-muted">
            {helperText}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  description,
  id,
  checked,
  onChange,
  className = '',
  ...props
}) => {
  const inputId = id || `checkbox_${label.toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div className={`flex items-start gap-3 select-none py-1.5 cursor-pointer ${className}`}>
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 w-4 h-4 rounded-xs border-border-strong text-primary focus:ring-info accent-primary cursor-pointer"
        {...props}
      />
      <label htmlFor={inputId} className="text-sm text-ink cursor-pointer leading-tight">
        <span className="font-medium text-ink">{label}</span>
        {description && <p className="text-xs text-ink-2 mt-0.5">{description}</p>}
      </label>
    </div>
  );
};
