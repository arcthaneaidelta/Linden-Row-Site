import React from 'react';

export interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  disabledSizes?: string[];
  stockCount?: number;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  disabledSizes = [],
  stockCount,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium uppercase tracking-[0.08em] text-ink-2">Size</span>
        <span className="text-ink-muted">Standard UK Sizing</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const isDisabled = disabledSizes.includes(size) || stockCount === 0;

          return (
            <button
              key={size}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectSize(size)}
              className={`relative min-w-[48px] h-10 px-3 text-xs font-medium rounded-xs border transition-all duration-fast flex items-center justify-center ${
                isSelected
                  ? 'border-ink bg-secondary text-ink font-semibold shadow-xs'
                  : isDisabled
                  ? 'border-border/60 text-ink-muted/50 cursor-not-allowed bg-border/20'
                  : 'border-border bg-surface-elevated text-ink hover:border-border-strong hover:bg-secondary/40'
              }`}
            >
              {size}
              {isDisabled && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-[120%] h-[1px] bg-border-strong/70 rotate-45 transform" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
