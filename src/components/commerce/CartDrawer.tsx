import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { QuantityStepper } from './QuantityStepper';
import { useCartStore } from '../../state/cartStore';
import { useCheckoutStore } from '../../state/checkoutStore';
import { formatMoney } from '../../lib/money';
import { mockApi } from '../../mock/mockApi';
import { CATALOGUE } from '../../mock/catalogue';
import { Trash2, RotateCcw, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    undoRemove,
    lastRemovedItem,
    updateQuantity,
    subtotalPence,
    totalQuantity,
  } = useCartStore();

  const {
    isCheckingAvailability,
    setCheckout,
    openStockResolution,
    setServerNotice,
  } = useCheckoutStore();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    useCheckoutStore.setState({ isCheckingAvailability: true });

    // Prepare SKUs & Quantities ONLY (Zero trust in client prices)
    const requestItems = items.map((i) => ({
      sku: i.sku,
      quantity: i.quantity,
      size: i.size,
    }));

    try {
      const res = await mockApi.createCheckoutSession(requestItems);
      useCheckoutStore.setState({ isCheckingAvailability: false });

      if (!res.ok) {
        if (res.error?.code === 'OUT_OF_STOCK' && res.error.details) {
          openStockResolution({
            sku: res.error.details.sku,
            name: res.error.details.name || 'Item',
            colour: res.error.details.colour || '',
            size: res.error.details.size || '',
            availableStock: res.error.details.available,
          });
        } else {
          alert(res.error?.message || 'Failed to start checkout');
        }
        return;
      }

      if (res.data) {
        setCheckout(res.data.checkout);
        if (res.data.priceTamperedNotice) {
          setServerNotice(res.data.priceTamperedNotice);
        }
        closeDrawer();
        navigate('/checkout');
      }
    } catch (err) {
      useCheckoutStore.setState({ isCheckingAvailability: false });
      console.error(err);
    }
  };

  const totalQty = totalQuantity();
  const subtotal = subtotalPence();

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title={`Your Bag (${totalQty})`}
      width="max-w-md"
    >
      <div className="flex flex-col h-full">
        {/* Undo Toast for Deleted Item */}
        {lastRemovedItem && (
          <div className="mx-6 mt-4 p-3 bg-secondary rounded-xs border border-border flex items-center justify-between text-xs">
            <span className="text-ink-2 truncate max-w-[220px]">
              Removed <strong className="text-ink font-medium">{lastRemovedItem.item.name}</strong>
            </span>
            <button
              onClick={undoRemove}
              className="flex items-center gap-1 font-medium text-ink hover:text-accent underline transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Undo</span>
            </button>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty Bag State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            {/* Minimal line hanger illustration */}
            <svg
              className="w-16 h-16 text-border-strong mb-4"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M24 10 C24 6, 21 4, 18 6 C15 8, 17 12, 24 14" />
              <path d="M24 14 L8 28 L40 28 Z" />
              <path d="M8 28 L8 30 C8 34, 40 34, 40 30 L40 28" />
            </svg>
            <h3 className="font-serif text-lg text-ink font-normal mb-1">Your bag is empty</h3>
            <p className="text-xs text-ink-muted mb-6 max-w-[240px]">
              Considered wardrobe staples crafted in small batches.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                closeDrawer();
                navigate('/shop');
              }}
            >
              Browse Collection
            </Button>
          </div>
        ) : (
          /* Cart Line Items */
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border">
            {items.map((item) => {
              const catalogItem = CATALOGUE.find((p) => p.sku === item.sku);
              const imageSrc = item.image || catalogItem?.images[0];

              return (
                <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                  {/* 72px Thumbnail */}
                  <div className="w-[72px] h-[90px] bg-bg rounded-xs overflow-hidden border border-border shrink-0">
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details & Controls */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-normal text-ink leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-xs font-medium text-ink font-sans">
                          {formatMoney(item.pricePence * item.quantity)}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {item.colour} · Size {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <QuantityStepper
                        size="sm"
                        quantity={item.quantity}
                        max={item.maxStock}
                        onChange={(qty) => updateQuantity(item.id, qty)}
                      />

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-ink-muted hover:text-error p-1 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer with Authoritative Total Notice and Checkout Button */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-surface-elevated mt-auto">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs uppercase tracking-[0.08em] text-ink-2 font-medium">Subtotal</span>
              <span className="font-serif text-lg font-normal text-ink">
                {formatMoney(subtotal)}
              </span>
            </div>
            <p className="text-[11px] text-ink-muted mb-4">
              Shipping & taxes calculated server-side in checkout
            </p>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isCheckingAvailability}
              loadingText="Checking availability..."
              onClick={handleCheckout}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Checkout
            </Button>

            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={closeDrawer}
                className="text-xs text-ink-muted hover:text-ink underline transition-colors"
              >
                Continue shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
