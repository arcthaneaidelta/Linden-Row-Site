import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'row' | 'summary' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
  const variantClasses = {
    text: 'h-4 w-full rounded-xs bg-border/70 animate-skeleton',
    card: 'aspect-[4/5] w-full rounded-xs bg-border/60 animate-skeleton',
    row: 'h-12 w-full rounded-sm bg-border/60 animate-skeleton',
    summary: 'h-24 w-full rounded-sm bg-border/60 animate-skeleton',
  };

  return <div className={`${variantClasses[variant]} ${className}`} aria-hidden="true" />;
};
