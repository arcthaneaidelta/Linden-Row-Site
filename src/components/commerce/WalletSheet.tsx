import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useCheckoutStore } from '../../state/checkoutStore';
import { useCartStore } from '../../state/cartStore';
import { mockApi } from '../../mock/mockApi';
import { formatMoney } from '../../lib/money';
import { Fingerprint, Check, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export const WalletSheet: React.FC = () => {
  const navigate = useNavigate();
  const { walletSheet, closeWalletSheet, setLatestOrder } = useCheckoutStore();
  const { clearCart, items: cartItems, subtotalPence } = useCartStore();

  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  if (!walletSheet || !walletSheet.isOpen) return null;

  const isExpress = !!walletSheet.expressProduct;
  const walletType = walletSheet.type;

  // Calculate items and totals
  const itemsToCharge = isExpress && walletSheet.expressProduct
    ? [{
        sku: walletSheet.expressProduct.sku,
        name: walletSheet.expressProduct.name,
        quantity: 1,
        size: walletSheet.expressProduct.size,
        pricePence: walletSheet.expressProduct.pricePence,
        image: walletSheet.expressProduct.image,
      }]
    : cartItems;

  const subtotal = isExpress && walletSheet.expressProduct
    ? walletSheet.expressProduct.pricePence
    : subtotalPence();

  const shippingCost = 450; // £4.50 Standard
  const grandTotal = subtotal + shippingCost;

  const handleConfirmPay = async () => {
    setIsAuthorizing(true);

    try {
      const res = await mockApi.processExpressOrder(
        itemsToCharge.map((i) => ({ sku: i.sku, quantity: i.quantity, size: i.size })),
        walletType,
        {
          name: 'Amelia Hartwell',
          email: 'amelia.hartwell@example.com',
          address: '14 Calder Mews',
          city: 'Bristol',
          postcode: 'BS1 5TQ',
        }
      );

      // Simulate biometric delay
      setTimeout(() => {
        setIsAuthorizing(false);
        setAuthSuccess(true);

        setTimeout(() => {
          if (res.ok && res.data) {
            setLatestOrder(res.data.order);
            if (!isExpress) {
              clearCart();
            }
            closeWalletSheet();
            navigate(`/order/${res.data.order.id}`);
          }
        }, 800);
      }, 1200);
    } catch (e) {
      console.error(e);
      setIsAuthorizing(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={closeWalletSheet}
      maxWidth="md"
      showCloseButton={!isAuthorizing}
      className="p-0 overflow-hidden"
    >
      {/* Wallet Brand Header */}
      <div className="bg-primary text-surface p-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-serif text-lg font-normal tracking-wide">Linden Row</span>
          <span className="text-[11px] font-mono opacity-60">· Express Checkout</span>
        </div>
        <span className="text-xs font-mono font-medium bg-surface/10 px-2 py-0.5 rounded-full">
          {walletType}
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Contact & Destination */}
        <div className="space-y-3 text-xs border-b border-border pb-4">
          <div className="flex items-start justify-between">
            <span className="text-ink-muted uppercase tracking-wider text-[10px]">Contact</span>
            <span className="font-medium text-ink text-right">Amelia Hartwell (amelia.hartwell@example.com)</span>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1.5 text-ink-muted">
              <Truck className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider text-[10px]">Ship to</span>
            </div>
            <span className="text-ink text-right">14 Calder Mews, Bristol BS1 5TQ</span>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1.5 text-ink-muted">
              <CreditCard className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider text-[10px]">Payment Card</span>
            </div>
            <span className="font-mono text-ink text-right">•••• 4242 (Apple Cash / Card)</span>
          </div>
        </div>

        {/* Line Items Preview */}
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar-light">
          {itemsToCharge.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <span className="text-ink-2 truncate max-w-[240px]">
                {item.quantity}× {item.name} ({item.size})
              </span>
              <span className="font-medium text-ink">{formatMoney(item.pricePence * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center text-xs text-ink-muted pt-1">
            <span>Standard UK Delivery</span>
            <span>£4.50</span>
          </div>
        </div>

        {/* Total to pay */}
        <div className="flex items-baseline justify-between pt-3 border-t border-border">
          <span className="text-xs uppercase tracking-wider font-semibold text-ink-2">Total</span>
          <span className="font-serif text-2xl font-normal text-ink">{formatMoney(grandTotal)}</span>
        </div>

        {/* Biometric Confirmation Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full relative overflow-hidden"
            disabled={isAuthorizing || authSuccess}
            onClick={handleConfirmPay}
          >
            {authSuccess ? (
              <span className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success" />
                <span>Payment Approved</span>
              </span>
            ) : isAuthorizing ? (
              <span className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 animate-pulse text-accent-soft" />
                <span>Authorizing biometric challenge...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5" />
                <span>Confirm with {walletType === 'Apple Pay' ? 'Face ID' : 'Passkey'}</span>
              </span>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-ink-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>Biometric token routed server-side to BigCommerce & Stripe</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
