import React from 'react';
import { CheckoutConsignment } from '../../mock/store';
import { formatMoney } from '../../lib/money';

export interface ShippingOptionProps {
  method: CheckoutConsignment;
  isSelected: boolean;
  onSelect: (method: CheckoutConsignment) => void;
}

export const ShippingOption: React.FC<ShippingOptionProps> = ({
  method,
  isSelected,
  onSelect,
}) => {
  return (
    <label
      onClick={() => onSelect(method)}
      className={`relative flex items-center justify-between p-4 rounded-sm border cursor-pointer select-none transition-all duration-fast ${
        isSelected
          ? 'border-ink bg-surface-elevated ring-1 ring-ink shadow-xs'
          : 'border-border bg-surface hover:border-border-strong hover:bg-surface-elevated'
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="shipping_method"
          checked={isSelected}
          onChange={() => onSelect(method)}
          className="w-4 h-4 text-primary accent-primary border-border-strong focus:ring-info"
        />
        <div>
          <span className="text-sm font-medium text-ink block">{method.shippingMethodName}</span>
          <span className="text-xs text-ink-muted block mt-0.5">{method.estimatedDelivery}</span>
        </div>
      </div>

      <div className="text-right">
        <span className="text-sm font-medium text-ink">
          {method.shippingCostPence === 0 ? 'Complimentary' : formatMoney(method.shippingCostPence)}
        </span>
      </div>
    </label>
  );
};
