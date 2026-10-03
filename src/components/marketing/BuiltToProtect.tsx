import React from 'react';
import { ShieldCheck, Lock, CopyX, ArrowRight } from 'lucide-react';
import { armFailureScenario } from '../../mock/failures';
import { useToast } from '../ui/Toast';

export const BuiltToProtect: React.FC = () => {
  const { toast } = useToast();

  const handleArmTest = (scenario: 'tamper_price' | 'double_click' | 'declined_card', label: string) => {
    armFailureScenario(scenario);
    toast(`Armed test: ${label}. Open checkout or Under the Hood to test.`, 'info');
  };

  const columns = [
    {
      title: 'Price and stock from BigCommerce only',
      description: 'Even if a malicious actor modifies prices or quantities inside the browser DevTools, the serverless middleware fetches authoritative totals directly from BigCommerce.',
      testLabel: 'Arm Price Tamper Test',
      action: () => handleArmTest('tamper_price', 'Price Tamper'),
      icon: <Lock className="w-5 h-5 text-accent" />,
    },
    {
      title: 'One order per payment (Idempotent)',
      description: 'Every payment attempt generates an Idempotency-Key. Double-clicking or connection retries will never charge a customer twice or create duplicate orders in BigCommerce.',
      testLabel: 'Arm Double-Submit Test',
      action: () => handleArmTest('double_click', 'Double-Click Pay'),
      icon: <CopyX className="w-5 h-5 text-accent" />,
    },
    {
      title: 'No credentials in the browser',
      description: 'Private BigCommerce OAuth access tokens and Stripe Secret Keys reside entirely within Vercel environment secrets—never packaged into client-side JS bundles.',
      testLabel: 'Arm Card Decline Test',
      action: () => handleArmTest('declined_card', 'Card Decline (0002)'),
      icon: <ShieldCheck className="w-5 h-5 text-accent" />,
    },
  ];

  return (
    <section id="failure-lab-anchor" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
      <div className="max-w-xl mb-12">
        <span className="text-xs uppercase font-mono tracking-[0.08em] text-accent font-semibold block mb-2">
          Security Guarantees
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
          Built to protect your launch day.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className="p-6 bg-surface rounded-xs border border-border flex flex-col justify-between hover:border-border-strong transition-colors"
          >
            <div>
              <div className="mb-4">{col.icon}</div>
              <h3 className="font-serif text-lg text-ink font-normal leading-snug mb-2">
                {col.title}
              </h3>
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                {col.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <button
                onClick={col.action}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-accent hover:text-ink transition-colors"
              >
                <span>{col.testLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
