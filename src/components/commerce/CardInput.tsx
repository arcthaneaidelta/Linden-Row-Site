import React, { useState } from 'react';
import { Lock, CreditCard, ShieldCheck } from 'lucide-react';
import { CardPayment } from '../../lib/validators';

export interface CardInputProps {
  formData: CardPayment;
  onChange: (data: Partial<CardPayment>) => void;
  errors?: Partial<Record<keyof CardPayment, string>>;
}

export const CardInput: React.FC<CardInputProps> = ({
  formData,
  onChange,
  errors = {},
}) => {
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'unknown'>('visa');

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    if (value.startsWith('4')) {
      setCardBrand('visa');
    } else if (value.startsWith('5')) {
      setCardBrand('mastercard');
    } else if (value.startsWith('3')) {
      setCardBrand('amex');
    } else {
      setCardBrand('unknown');
    }

    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    onChange({ cardNumber: formatted });
  };

  // Format MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    onChange({ expiry: value });
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    onChange({ cvc: value });
  };

  const setTestCard = (type: 'success' | '3ds' | 'decline') => {
    if (type === 'success') {
      onChange({
        cardNumber: '4242 4242 4242 4242',
        expiry: '12/28',
        cvc: '314',
        nameOnCard: 'Amelia Hartwell',
      });
      setCardBrand('visa');
    } else if (type === '3ds') {
      onChange({
        cardNumber: '4000 0027 6000 3184',
        expiry: '09/29',
        cvc: '882',
        nameOnCard: 'Amelia Hartwell',
      });
      setCardBrand('visa');
    } else if (type === 'decline') {
      onChange({
        cardNumber: '4000 0000 0000 0002',
        expiry: '05/27',
        cvc: '102',
        nameOnCard: 'Amelia Hartwell',
      });
      setCardBrand('visa');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stripe-style Card Element Container */}
      <div className="bg-surface-elevated border border-border rounded-sm p-4 divide-y divide-border">
        {/* Card Number */}
        <div className="pb-3">
          <label htmlFor="card-number-input" className="text-xs uppercase tracking-[0.08em] font-medium text-ink-2 mb-1.5 block">
            Card Information
          </label>
          <div className="relative flex items-center">
            <input
              id="card-number-input"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              className={`w-full bg-transparent text-ink text-sm font-mono tracking-wider focus:outline-none placeholder:text-ink-muted/60 ${
                errors.cardNumber ? 'text-error' : ''
              }`}
            />
            <div className="flex items-center gap-1.5 shrink-0 pl-2">
              {cardBrand === 'visa' && (
                <span className="text-[10px] font-mono font-bold bg-[#1A1F71] text-white px-1.5 py-0.5 rounded-xs">
                  VISA
                </span>
              )}
              {cardBrand === 'mastercard' && (
                <span className="text-[10px] font-mono font-bold bg-[#EB001B] text-white px-1.5 py-0.5 rounded-xs">
                  MC
                </span>
              )}
              {cardBrand === 'amex' && (
                <span className="text-[10px] font-mono font-bold bg-[#006FCF] text-white px-1.5 py-0.5 rounded-xs">
                  AMEX
                </span>
              )}
              <CreditCard className="w-4 h-4 text-ink-muted" />
            </div>
          </div>
          {errors.cardNumber && (
            <p className="text-xs text-error mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Expiry and CVC grid */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <div>
            <label htmlFor="card-expiry-input" className="text-xs uppercase tracking-[0.08em] font-medium text-ink-2 mb-1 block">
              Expires
            </label>
            <input
              id="card-expiry-input"
              type="text"
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={handleExpiryChange}
              className={`w-full bg-transparent text-ink text-sm font-mono focus:outline-none placeholder:text-ink-muted/60 ${
                errors.expiry ? 'text-error' : ''
              }`}
            />
            {errors.expiry && <p className="text-xs text-error mt-0.5">{errors.expiry}</p>}
          </div>

          <div>
            <label htmlFor="card-cvc-input" className="text-xs uppercase tracking-[0.08em] font-medium text-ink-2 mb-1 block">
              CVC
            </label>
            <div className="flex items-center justify-between">
              <input
                id="card-cvc-input"
                type="text"
                placeholder="123"
                value={formData.cvc}
                onChange={handleCvcChange}
                className={`w-full bg-transparent text-ink text-sm font-mono focus:outline-none placeholder:text-ink-muted/60 ${
                  errors.cvc ? 'text-error' : ''
                }`}
              />
              <Lock className="w-3.5 h-3.5 text-ink-muted shrink-0" />
            </div>
            {errors.cvc && <p className="text-xs text-error mt-0.5">{errors.cvc}</p>}
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="pt-3">
          <label htmlFor="cardholder-name-input" className="text-xs uppercase tracking-[0.08em] font-medium text-ink-2 mb-1 block">
            Name on Card
          </label>
          <input
            id="cardholder-name-input"
            type="text"
            placeholder="Full Name as shown on card"
            value={formData.nameOnCard}
            onChange={(e) => onChange({ nameOnCard: e.target.value })}
            className="w-full bg-transparent text-ink text-sm focus:outline-none placeholder:text-ink-muted/60"
          />
          {errors.nameOnCard && <p className="text-xs text-error mt-0.5">{errors.nameOnCard}</p>}
        </div>
      </div>

      {/* Security badge & Test card helpers */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          <span>Encrypted with 256-bit TLS · Processed securely by Stripe</span>
        </div>

        {/* Demo Quick Fill Test Card Pills */}
        <div className="p-2.5 bg-secondary/70 rounded-xs border border-border flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-mono uppercase text-ink-muted">Demo cards:</span>
          <button
            type="button"
            onClick={() => setTestCard('success')}
            className="px-2 py-0.5 bg-surface-elevated hover:bg-surface border border-border-strong rounded-xs text-ink font-mono text-[11px] hover:border-ink transition-colors"
          >
            4242 (Success)
          </button>
          <button
            type="button"
            onClick={() => setTestCard('3ds')}
            className="px-2 py-0.5 bg-surface-elevated hover:bg-surface border border-border-strong rounded-xs text-ink font-mono text-[11px] hover:border-ink transition-colors"
          >
            3184 (3DS Challenge)
          </button>
          <button
            type="button"
            onClick={() => setTestCard('decline')}
            className="px-2 py-0.5 bg-surface-elevated hover:bg-surface border border-border-strong rounded-xs text-ink font-mono text-[11px] hover:border-ink transition-colors"
          >
            0002 (Declined)
          </button>
        </div>
      </div>
    </div>
  );
};
