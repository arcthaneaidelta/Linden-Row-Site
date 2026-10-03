import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface QuantityStepperProps {
  quantity: number;
  max?: number;
  min?: number;
  onChange: (newQuantity: number) => void;
  size?: 'sm' | 'md';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  max = 99,
  min = 1,
  onChange,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  return (
    <div className={`inline-flex items-center border border-border rounded-xs bg-surface-elevated ${
      isSm ? 'h-7' : 'h-9'
    }`}>
      <button
        type="button"
        disabled={quantity <= min}
        onClick={() => onChange(quantity - 1)}
        className={`flex items-center justify-center text-ink-2 hover:text-ink hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          isSm ? 'w-7 h-full' : 'w-9 h-full'
        }`}
        aria-label="Decrease quantity"
      >
        <Minus className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />
      </button>

      <span className={`flex items-center justify-center font-mono font-medium text-xs text-ink select-none ${
        isSm ? 'w-7' : 'w-8'
      }`}>
        {quantity}
      </span>

      <button
        type="button"
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
        className={`flex items-center justify-center text-ink-2 hover:text-ink hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          isSm ? 'w-7 h-full' : 'w-9 h-full'
        }`}
        aria-label="Increase quantity"
      >
        <Plus className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />
      </button>
    </div>
  );
};
