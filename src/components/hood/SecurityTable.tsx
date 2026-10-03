import React from 'react';
import { ShieldCheck, Lock, KeyRound, Server, Check } from 'lucide-react';

export const SecurityTable: React.FC = () => {
  const rules = [
    {
      step: 'Catalog & Session Init',
      runsWhere: 'Vercel Serverless',
      secretNeeded: 'BigCommerce API Token (Server Only)',
      guarantee: 'Browser sends SKUs/Quantities only. Prices calculated authoritatively in BigCommerce.',
    },
    {
      step: 'Consignments & Addresses',
      runsWhere: 'Vercel / BigCommerce',
      secretNeeded: 'BigCommerce Client Secret',
      guarantee: 'Shipping rates calculated server-side; validated against destination zone rules.',
    },
    {
      step: 'Stripe PaymentIntent',
      runsWhere: 'Vercel / Stripe API',
      secretNeeded: 'Stripe Secret Key (sk_live_...)',
      guarantee: 'Unique Idempotency-Key per transaction attempt prevents duplicate charges.',
    },
    {
      step: 'Order Finalization',
      runsWhere: 'BigCommerce Engine',
      secretNeeded: 'BigCommerce OAuth Server Token',
      guarantee: 'Order created in BigCommerce only after verified Stripe payment confirmation.',
    },
    {
      step: 'Webhook Backstop',
      runsWhere: 'Vercel Webhook Endpoint',
      secretNeeded: 'Stripe Webhook Secret (whsec_...)',
      guarantee: 'Captures payment_intent.succeeded even if shopper closes tab during 3DS redirect.',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#16191A] p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
      <div className="mb-4 pb-3 border-b border-[#2C3234]">
        <div className="flex items-center gap-2 text-[#E6E2DA] font-semibold text-sm">
          <ShieldCheck className="w-4 h-4 text-hood-success" />
          <span>Security & Credential Architecture</span>
        </div>
        <p className="text-[11px] text-[#9A958B] mt-1 leading-relaxed">
          Zero-trust client design. All BigCommerce credentials, Stripe secret keys, and pricing logic execute exclusively server-side.
        </p>
      </div>

      <div className="space-y-3">
        {rules.map((rule, idx) => (
          <div key={idx} className="p-3 bg-[#1F2324] rounded-xs border border-[#2C3234] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold text-xs">{rule.step}</span>
              <span className="flex items-center gap-1 text-[10px] text-hood-success bg-hood-success/15 px-1.5 py-0.5 rounded-xs border border-hood-success/30">
                <Check className="w-3 h-3" />
                <span>Zero Browser Trust</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#9A958B]">
              <div>
                <span className="text-[#9A958B]/60 block text-[10px] uppercase">Execution:</span>
                <span className="text-[#E6E2DA]">{rule.runsWhere}</span>
              </div>
              <div>
                <span className="text-[#9A958B]/60 block text-[10px] uppercase">Secret Scope:</span>
                <span className="text-hood-accent">{rule.secretNeeded}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#9A958B] border-t border-[#2C3234] pt-2 mt-1 leading-tight">
              {rule.guarantee}
            </p>
          </div>
        ))}
      </div>

      {/* Audit Checklist */}
      <div className="mt-6 p-3 bg-[#1A1D1E] rounded-xs border border-[#2C3234] space-y-2 text-[11px]">
        <div className="flex items-center gap-2 text-[#E6E2DA] font-semibold">
          <KeyRound className="w-3.5 h-3.5 text-hood-accent" />
          <span>Security Verification Matrix</span>
        </div>
        <ul className="space-y-1.5 text-[#9A958B]">
          <li className="flex items-center gap-1.5 text-hood-success">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>No BigCommerce or Stripe private API keys in client JavaScript</span>
          </li>
          <li className="flex items-center gap-1.5 text-hood-success">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Prices calculated strictly by BigCommerce backend pricing engine</span>
          </li>
          <li className="flex items-center gap-1.5 text-hood-success">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Strict idempotency keys prevent double charge on connection retries</span>
          </li>
          <li className="flex items-center gap-1.5 text-hood-success">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Full 3D Secure 2.2 SCA challenge compliance for European/UK cards</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
