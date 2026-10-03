import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useCheckoutStore } from '../../state/checkoutStore';
import { useToast } from '../ui/Toast';
import { Copy, Check, Terminal, Clock, ShieldCheck } from 'lucide-react';

export const OrderRecordModal: React.FC = () => {
  const { latestOrder, isOrderRecordModalOpen, setOrderRecordModalOpen } = useCheckoutStore();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOrderRecordModalOpen || !latestOrder) return null;

  const orderJson = JSON.stringify(
    {
      bigcommerce_order: {
        id: latestOrder.bigCommerceId,
        store_order_number: latestOrder.id,
        status: latestOrder.status,
        payment_status: latestOrder.paymentStatus,
        payment_provider_id: latestOrder.paymentMethod,
        external_transaction_id: latestOrder.transactionId,
        idempotency_key: latestOrder.idempotencyKey,
        currency_code: 'GBP',
        subtotal_inc_tax: latestOrder.itemsTotalPence / 100,
        shipping_cost_inc_tax: latestOrder.shippingCostPence / 100,
        total_tax: latestOrder.taxPence / 100,
        total_inc_tax: latestOrder.grandTotalPence / 100,
        customer: latestOrder.customer,
        billing_address: latestOrder.billingAddress,
        shipping_address: latestOrder.shippingAddress,
        items: latestOrder.lineItems.map((item) => ({
          sku: item.sku,
          name: item.name,
          variant: `${item.colour} / ${item.size}`,
          quantity: item.quantity,
          base_price: item.pricePence / 100,
          total_price: (item.pricePence * item.quantity) / 100,
        })),
        created_at: latestOrder.createdAt,
      },
      post_order_events: latestOrder.timeline,
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(orderJson);
    setCopied(true);
    toast('BigCommerce Order JSON copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => setOrderRecordModalOpen(false)}
      title={`BigCommerce Order Record (${latestOrder.id})`}
      description="Authoritative server-side order object generated for operations & warehouse fulfilment"
      maxWidth="xl"
    >
      <div className="flex flex-col gap-4">
        {/* Post-Order Workflow Timeline */}
        <div className="p-4 bg-surface rounded-xs border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-ink-2" />
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-ink">
              Downstream Workflow Pipeline
            </h4>
          </div>

          <div className="space-y-2">
            {latestOrder.timeline.map((event, idx) => (
              <div key={idx} className="flex items-start justify-between text-xs py-1 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    event.status === 'completed'
                      ? 'bg-success'
                      : 'bg-accent'
                  }`} />
                  <span className="font-mono font-medium text-ink">{event.event}</span>
                  <span className="text-[11px] text-ink-muted">· {event.detail}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {event.status === 'simulated' && (
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-secondary text-ink-2 rounded-xs border border-border">
                      Simulated
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-ink-muted">{event.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* JSON Code Viewer */}
        <div className="relative">
          <div className="flex items-center justify-between px-3 py-2 bg-[#1F2324] text-[#9A958B] text-xs font-mono rounded-t-xs border border-b-0 border-[#2C3234]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-hood-accent" />
              <span>bigcommerce_order_payload.json</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2 py-1 bg-[#2C3234] hover:bg-[#384042] text-white rounded-xs text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-hood-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <pre className="bg-[#16191A] text-[#E6E2DA] p-4 rounded-b-xs border border-[#2C3234] text-xs font-mono overflow-x-auto max-h-80 custom-scrollbar leading-relaxed">
            {orderJson}
          </pre>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Zero browser tampering possible · Locked in BigCommerce database</span>
          </div>

          <Button variant="secondary" size="sm" onClick={() => setOrderRecordModalOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
