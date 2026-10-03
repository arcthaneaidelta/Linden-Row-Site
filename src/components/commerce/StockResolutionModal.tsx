import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useCheckoutStore } from '../../state/checkoutStore';
import { useCartStore } from '../../state/cartStore';
import { AlertTriangle } from 'lucide-react';

export const StockResolutionModal: React.FC = () => {
  const { stockResolutionModal, closeStockResolution } = useCheckoutStore();
  const { updateQuantity, removeItem, openDrawer } = useCartStore();

  if (!stockResolutionModal || !stockResolutionModal.isOpen) return null;

  const { sku, name, colour, size, availableStock } = stockResolutionModal;
  const cartItemId = `${sku}-${size}`;

  const handleUpdate = () => {
    if (availableStock > 0) {
      updateQuantity(cartItemId, availableStock);
    } else {
      removeItem(cartItemId);
    }
    closeStockResolution();
    openDrawer();
  };

  const handleRemove = () => {
    removeItem(cartItemId);
    closeStockResolution();
    openDrawer();
  };

  return (
    <Modal
      isOpen={true}
      onClose={closeStockResolution}
      title="Inventory Update"
      preventBackdropClose={true}
      showCloseButton={false}
      maxWidth="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 p-3 bg-accent-soft/60 rounded-xs border border-accent/20">
          <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-ink leading-relaxed">
            {availableStock > 0 ? (
              <p>
                Only <strong className="font-semibold text-accent">{availableStock} left</strong> of{' '}
                <strong>{name}</strong> ({colour}, Size {size}). Another customer may have just placed an order.
              </p>
            ) : (
              <p>
                <strong>{name}</strong> ({colour}, Size {size}) has just sold out.
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-ink-2">
          We never silently alter your order. Please choose how you would like to proceed:
        </p>

        <div className="flex flex-col gap-2 pt-2">
          {availableStock > 0 ? (
            <Button variant="primary" size="md" onClick={handleUpdate}>
              Update my bag to {availableStock} {availableStock === 1 ? 'unit' : 'units'}
            </Button>
          ) : null}

          <Button
            variant={availableStock === 0 ? 'primary' : 'secondary'}
            size="md"
            onClick={handleRemove}
          >
            Remove item from bag
          </Button>
        </div>
      </div>
    </Modal>
  );
};
