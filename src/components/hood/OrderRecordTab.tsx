import React from 'react';
import { useCheckoutStore } from '../../state/checkoutStore';
import { mockStore } from '../../mock/store';
import { FileText, Clock, ShoppingBag } from 'lucide-react';
import { formatMoney } from '../../lib/money';

export const OrderRecordTab: React.FC = () => {
  const latestOrder = useCheckoutStore((s) => s.latestOrder);

  // If no order yet, pick the most recent one from mockStore if any
  const order = latestOrder || Array.from(mockStore.orders.values()).pop();

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#16191A] text-[#9A958B] font-mono text-xs">
        <ShoppingBag className="w-8 h-8 text-[#2C3234] mb-3" />
        <p>No BigCommerce orders created in this session.</p>
        <p className="text-[11px] text-[#9A958B]/60 mt-1">
          Complete a checkout flow to inspect the server-side BigCommerce order payload.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#16191A] p-4 font-mono text-xs overflow-y-auto custom-scrollbar space-y-4">
      <div className="pb-3 border-b border-[#2C3234] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold">
            <FileText className="w-4 h-4 text-hood-accent" />
            <span>BigCommerce Order {order.id}</span>
          </div>
          <span className="text-[11px] text-[#9A958B]">Internal Ref: {order.bigCommerceId}</span>
        </div>

        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-xs text-[10px] uppercase font-semibold">
          {order.paymentStatus}
        </span>
      </div>

      {/* Downstream workflow timeline */}
      <div className="p-3 bg-[#1F2324] rounded-xs border border-[#2C3234]">
        <div className="flex items-center gap-1.5 text-white font-semibold text-xs mb-2">
          <Clock className="w-3.5 h-3.5 text-hood-accent" />
          <span>Fulfillment & Marketing Pipeline</span>
        </div>

        <div className="space-y-2">
          {order.timeline.map((evt, idx) => (
            <div key={idx} className="flex items-start justify-between text-[11px] py-1 border-b border-[#2C3234]/60 last:border-0">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${evt.status === 'completed' ? 'bg-emerald-400' : 'bg-hood-accent'}`} />
                  <span className="text-[#E6E2DA] font-semibold">{evt.event}</span>
                  {evt.status === 'simulated' && (
                    <span className="text-[9px] uppercase px-1 bg-[#2C3234] text-[#9A958B] rounded-xs">
                      Simulated
                    </span>
                  )}
                </div>
                <p className="text-[#9A958B] text-[10px] mt-0.5">{evt.detail}</p>
              </div>
              <span className="text-[10px] text-[#9A958B] shrink-0 ml-2">{evt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="p-3 bg-[#1F2324] rounded-xs border border-[#2C3234] space-y-2 text-[11px]">
        <div className="flex justify-between">
          <span className="text-[#9A958B]">Transaction Reference:</span>
          <span className="text-[#E6E2DA]">{order.transactionId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#9A958B]">Customer:</span>
          <span className="text-[#E6E2DA]">{order.customer.firstName} {order.customer.lastName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#9A958B]">Destination:</span>
          <span className="text-[#E6E2DA]">{order.shippingAddress.city}, {order.shippingAddress.postcode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#9A958B]">Grand Total:</span>
          <span className="text-emerald-400 font-semibold">{formatMoney(order.grandTotalPence)}</span>
        </div>
      </div>

      {/* Line Items */}
      <div className="p-3 bg-[#1F2324] rounded-xs border border-[#2C3234] space-y-2 text-[11px]">
        <span className="text-[10px] uppercase text-[#9A958B] font-semibold">Ordered SKUs</span>
        {order.lineItems.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-[#E6E2DA]">
            <span>{item.quantity}× {item.sku} ({item.name}, {item.size})</span>
            <span className="font-semibold">{formatMoney(item.pricePence * item.quantity)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
