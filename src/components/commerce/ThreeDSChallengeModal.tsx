import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useCheckoutStore } from '../../state/checkoutStore';
import { useCartStore } from '../../state/cartStore';
import { mockApi } from '../../mock/mockApi';
import { formatMoney } from '../../lib/money';
import { ShieldAlert, Landmark, CheckCircle, AlertCircle } from 'lucide-react';

export const ThreeDSChallengeModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    is3DSModalOpen,
    close3DSModal,
    checkout,
    currentIdempotencyKey,
    setLatestOrder,
    setPaymentError,
  } = useCheckoutStore();
  const { clearCart } = useCartStore();

  const [authCode, setAuthCode] = useState('123456');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!is3DSModalOpen || !checkout) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await mockApi.submit3DSAuthentication(checkout.id, currentIdempotencyKey, false);
      setIsProcessing(false);

      if (res.ok && res.data) {
        setLatestOrder(res.data.order);
        clearCart();
        close3DSModal();
        navigate(`/order/${res.data.order.id}`);
      } else {
        setErrorMessage(res.error?.message || 'Authentication failed');
      }
    } catch (e) {
      setIsProcessing(false);
      setErrorMessage('Network error during authentication challenge.');
    }
  };

  const handleFail = async () => {
    setIsProcessing(true);
    try {
      const res = await mockApi.submit3DSAuthentication(checkout.id, currentIdempotencyKey, true);
      setIsProcessing(false);
      close3DSModal();
      setPaymentError(res.error?.message || 'Authentication failed. Your card was not charged.');
    } catch (e) {
      setIsProcessing(false);
      close3DSModal();
      setPaymentError('Authentication failed. Your card was not charged.');
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleFail}
      maxWidth="sm"
      showCloseButton={true}
      className="p-0 overflow-hidden border-border-strong"
    >
      {/* Issuing Bank Header */}
      <div className="bg-[#1A2E3B] text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Landmark className="w-5 h-5 text-accent-soft" />
          <div>
            <h4 className="text-sm font-medium tracking-wide">UK Verified by Visa</h4>
            <p className="text-[11px] text-accent-soft/80 font-mono">Strong Customer Authentication (SCA)</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-serif text-lg text-ink font-normal">Verify this payment</h3>
          <p className="text-xs text-ink-2 mt-1">
            To protect your account, your bank requires verification for this transaction with Linden Row.
          </p>
        </div>

        {/* Challenge Summary Box */}
        <div className="bg-surface p-3.5 rounded-xs border border-border space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-ink-muted">Merchant:</span>
            <span className="font-medium text-ink">Linden Row London</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Amount:</span>
            <span className="font-medium text-ink font-mono">{formatMoney(checkout.grandTotalPence)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Card:</span>
            <span className="font-mono text-ink">•••• 3184</span>
          </div>
        </div>

        {/* Verification Code Input */}
        <div>
          <label htmlFor="auth-code-input" className="block text-xs uppercase tracking-wider font-medium text-ink-2 mb-1.5">
            One-Time Passcode (OTP)
          </label>
          <input
            id="auth-code-input"
            type="text"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            maxLength={6}
            placeholder="123456"
            className="w-full text-center text-lg font-mono tracking-widest py-2.5 px-3 rounded-xs border border-border-strong bg-surface-elevated text-ink focus:outline-none focus:ring-2 focus:ring-info"
          />
          <span className="block text-[11px] text-ink-muted mt-1 text-center">
            Demo challenge helper: Use code <strong className="font-mono text-ink">123456</strong>
          </span>
        </div>

        {errorMessage && (
          <div className="p-2.5 bg-error/10 border border-error/20 rounded-xs flex items-center gap-2 text-xs text-error">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full"
            isLoading={isProcessing}
            onClick={handleApprove}
            leftIcon={<CheckCircle className="w-4 h-4" />}
          >
            Approve Payment
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="w-full"
            disabled={isProcessing}
            onClick={handleFail}
          >
            Fail Authentication (Test Decline)
          </Button>
        </div>

        <p className="text-[10px] text-ink-muted text-center pt-1">
          Simulated 3DS 2.2 flow pursuant to EU/UK PSD2 SCA compliance
        </p>
      </div>
    </Modal>
  );
};
