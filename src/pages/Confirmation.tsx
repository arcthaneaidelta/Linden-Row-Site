import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCheckoutStore } from '../state/checkoutStore';
import { type BigCommerceOrder } from '../mock/store';
import { mockApi } from '../mock/mockApi';
import { Button } from '../components/ui/Button';
import { formatMoney } from '../lib/money';
import { Footer } from '../components/marketing/Footer';
import { Check, FileText, ArrowRight, ShieldCheck, Truck, Package } from 'lucide-react';

export const Confirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { latestOrder, setOrderRecordModalOpen, setLatestOrder } = useCheckoutStore();
  const [order, setOrder] = useState<BigCommerceOrder | null>(latestOrder);
  const [isLoading, setIsLoading] = useState(!latestOrder);

  useEffect(() => {
    if (!latestOrder && id) {
      // Look up order in mock store
      const fetchOrder = async () => {
        setIsLoading(true);
        const res = await mockApi.getOrder(id);
        setIsLoading(false);
        if (res.ok && res.data) {
          setOrder(res.data);
          setLatestOrder(res.data);
        }
      };
      fetchOrder();
    }
  }, [id, latestOrder, setLatestOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-ink-muted">Retrieving BigCommerce order record...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center bg-bg px-4 text-center">
        <Package className="w-12 h-12 text-ink-muted mb-4" />
        <h1 className="font-serif text-2xl text-ink font-normal mb-2">We could not find that order</h1>
        <p className="text-xs text-ink-muted max-w-sm mb-6">
          The requested order ID may not exist or the active memory store has been reset.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="md">
            Return to Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-bg">
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 flex-1">
        {/* Animated Stroke Success Icon */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-success stroke-[2.5] animate-check-draw" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-success font-semibold mb-2">
            Payment Confirmed · BigCommerce Order Placed
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight">
            Thank you, {order.customer.firstName}.
          </h1>

          <p className="text-sm text-ink-2 mt-3 max-w-md">
            Your order <strong className="font-mono text-ink">{order.id}</strong> has been received by BigCommerce and is being prepared for dispatch.
          </p>

          <p className="text-xs text-ink-muted mt-1 font-mono">
            A confirmation receipt was sent to {order.customer.email}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-surface-elevated rounded-sm border border-border overflow-hidden shadow-xs space-y-6 p-6 sm:p-8">
          {/* Status & Timing */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-surface rounded-xs border border-border">
                <Truck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono text-ink-muted block">Delivery Method</span>
                <span className="text-sm font-medium text-ink">{order.shippingMethod}</span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs uppercase font-mono text-ink-muted block">Estimated Arrival</span>
              <span className="text-sm font-medium text-ink">In 2 to 4 working days</span>
            </div>
          </div>

          {/* Line Items List */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider text-ink font-semibold">
              Purchased Pieces ({order.lineItems.length})
            </h3>

            <div className="divide-y divide-border/60">
              {order.lineItems.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-medium text-ink block">{item.name}</span>
                    <span className="text-ink-muted font-mono text-[11px]">
                      SKU: {item.sku} · {item.colour} · Size {item.size} · Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-serif text-sm font-medium text-ink">
                    {formatMoney(item.pricePence * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="pt-4 border-t border-border space-y-2 text-xs text-ink-2">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-medium text-ink">{formatMoney(order.itemsTotalPence)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping ({order.shippingMethod})</span>
              <span className="font-medium text-ink">
                {order.shippingCostPence === 0 ? 'Complimentary' : formatMoney(order.shippingCostPence)}
              </span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Taxes (20% UK VAT included)</span>
              <span>{formatMoney(order.taxPence)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border items-baseline">
              <span className="font-serif text-base text-ink font-normal">Total Paid</span>
              <span className="font-serif text-2xl font-normal text-ink">
                {formatMoney(order.grandTotalPence)}
              </span>
            </div>
          </div>

          {/* Address and Payment Details */}
          <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-ink-muted block mb-1">Shipping To</span>
              <p className="text-ink leading-relaxed">
                {order.shippingAddress.addressLine1}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.postcode}
                <br />
                {order.shippingAddress.country}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-ink-muted block mb-1">Payment Method</span>
              <p className="font-mono text-ink leading-relaxed">
                {order.paymentMethod} (Ref: {order.transactionId})
                <br />
                <span className="text-success flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified & Settled</span>
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/shop" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue Shopping
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => setOrderRecordModalOpen(true)}
            leftIcon={<FileText className="w-4 h-4 text-accent" />}
          >
            Inspect BigCommerce JSON Record
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
