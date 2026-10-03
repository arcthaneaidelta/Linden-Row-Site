import React from 'react';
import { Loader2, Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'outline' | 'wallet-apple' | 'wallet-google' | 'wallet-link' | 'hood-primary' | 'hood-danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isSuccess?: boolean;
  loadingText?: string;
  successText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isSuccess = false,
  loadingText,
  successText,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-sans font-medium transition-all duration-fast select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:translate-y-[1px]";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-sm gap-1.5 h-8",
    md: "px-4 py-2.5 text-sm rounded-sm gap-2 h-11",
    lg: "px-6 py-3.5 text-base rounded-sm gap-2.5 h-13",
  };

  const variantClasses = {
    primary: "bg-primary text-surface hover:bg-primary-hover active:bg-primary-active border border-transparent shadow-sm",
    secondary: "bg-secondary text-ink hover:bg-[#DDD5C7] border border-border-strong",
    outline: "bg-transparent text-ink border border-border-strong hover:bg-surface hover:border-ink",
    text: "bg-transparent text-ink hover:text-accent underline-offset-4 hover:underline p-0 h-auto font-normal",
    'wallet-apple': "bg-black text-white hover:bg-neutral-900 border border-black",
    'wallet-google': "bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-50 shadow-sm",
    'wallet-link': "bg-[#00D66F] text-[#0A2540] hover:bg-[#00c264] border border-transparent font-semibold",
    'hood-primary': "bg-hood-accent text-hood-bg hover:opacity-90 font-mono text-xs",
    'hood-danger': "bg-hood-error text-white hover:opacity-90 font-mono text-xs",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading || isSuccess}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{loadingText || children}</span>
        </>
      ) : isSuccess ? (
        <>
          <Check className="w-4 h-4 shrink-0 text-success" />
          <span>{successText || 'Completed'}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
