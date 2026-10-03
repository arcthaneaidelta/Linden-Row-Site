import React, { useState } from 'react';
import { formatMoney } from '../../lib/money';
import { Tooltip } from '../ui/Tooltip';
import { BigCommerceCheckout } from '../../mock/store';
import { ChevronDown, ChevronUp, Server, ShieldCheck } from 'lucide-react';

export interface OrderSummaryProps {
  checkout: BigCommerceCheckout;
  isCollapsibleMobile?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  checkout,
  isCollapsibleMobile = true,
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const shippingCost = checkout.shippingCostPence;
  const total = checkout.grandTotalPence;

  return (
    <aside aria-label="Order Summary" className="w-full bg-surface rounded-md border border-border overflow-hidden">
      {/* Mobile Collapsible Header */}
      {isCollapsibleMobile && (
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="lg:hidden w-full px-4 py-3 bg-secondary/50 flex items-center justify-between border-b border-border text-xs text-ink"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium uppercase tracking-wider">
              {mobileExpanded ? 'Hide order summary' : 'Show order summary'}
            </span>
            {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          <span className="font-serif text-sm font-semibold">{formatMoney(total)}</span>
        </button>
      )}

      {/* Summary Content */}
      <div className={`p-6 ${isCollapsibleMobile && !mobileExpanded ? 'hidden lg:block' : 'block'}`}>
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="font-serif text-lg font-normal text-ink">Order Summary</h3>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-ink-muted">
            <Server className="w-3 h-3 text-success" />
            <span>BigCommerce Engine</span>
          </div>
        </div>

        {/* Items List */}
        <div className="py-4 space-y-3.5 max-h-64 overflow-y-auto custom-scrollbar-light divide-y divide-border/60">
          {checkout.items.map((item, idx) => (
            <div key={`${item.sku}-${idx}`} className="flex items-center gap-3.5 pt-3 first:pt-0">
              <div className="relative w-14 h-16 bg-bg rounded-xs overflow-hidden border border-border shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-surface text-[10px] font-mono rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-sm font-normal text-ink truncate leading-tight">
                  {item.name}
                </h4>
                <p className="text-xs text-ink-muted mt-0.5">
                  {item.colour} · Size {item.size}
                </p>
              </div>

              <div className="text-right shrink-0">
                <Tooltip content="Price authoritative from BigCommerce">
                  <span className="text-xs font-medium text-ink cursor-help border-b border-dotted border-border-strong">
                    {formatMoney(item.totalPence)}
                  </span>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>

        {/* Cost Breakdown */}
        <div className="pt-4 border-t border-border space-y-2.5 text-xs text-ink-2">
          <div className="flex justify-between items-center">
            <span>Subtotal</span>
            <Tooltip content="Calculated by BigCommerce API">
              <span className="font-medium text-ink cursor-help border-b border-dotted border-border-strong">
                {formatMoney(checkout.subtotalPence)}
              </span>
            </Tooltip>
          </div>

          <div className="flex justify-between items-center">
            <span>Delivery</span>
            <Tooltip content="Calculated by BigCommerce Consignments">
              <span className="font-medium text-ink cursor-help border-b border-dotted border-border-strong">
                {shippingCost === 0
                  ? checkout.selectedConsignment
                    ? 'Complimentary'
                    : 'Calculated next step'
                  : formatMoney(shippingCost)}
              </span>
            </Tooltip>
          </div>

          <div className="flex justify-between items-center text-ink-muted">
            <span>Taxes (20% UK VAT included)</span>
            <Tooltip content="UK VAT calculated server-side">
              <span className="cursor-help border-b border-dotted border-border-strong">
                {formatMoney(checkout.taxPence)}
              </span>
            </Tooltip>
          </div>
        </div>

        {/* Grand Total */}
        <div className="pt-4 mt-4 border-t border-border flex items-baseline justify-between">
          <div>
            <span className="font-serif text-base text-ink block font-normal">Total to pay</span>
            <span className="text-[11px] text-ink-muted font-mono">GBP (incl. VAT)</span>
          </div>

          <Tooltip content="Authoritative total locked by BigCommerce">
            <span className="font-serif text-2xl font-normal text-ink cursor-help border-b border-dotted border-border-strong">
              {formatMoney(total)}
            </span>
          </Tooltip>
        </div>

        {/* Trust signal notice */}
        <div className="mt-5 p-2.5 bg-surface-elevated rounded-xs border border-border flex items-center gap-2 text-[11px] text-ink-muted">
          <ShieldCheck className="w-4 h-4 text-success shrink-0" />
          <span>Browser is never trusted for totals. All amounts locked by BigCommerce.</span>
        </div>
      </div>
    </aside>
  );
};
