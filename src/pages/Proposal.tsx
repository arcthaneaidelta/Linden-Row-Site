import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/marketing/Footer';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { useToast } from '../components/ui/Toast';
import {
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Server,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const Proposal: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) {
      toast('Please provide your name and email', 'error');
      return;
    }
    setSent(true);
    toast('Thanks. I will reply within a few hours.', 'success');
    setTimeout(() => {
      setContactOpen(false);
      setSent(false);
    }, 1800);
  };

  const timelineDays = [
    {
      days: 'Day 1',
      title: 'Repository Setup, Webflow Cart Audit & Middleware Init',
      tasks: [
        'Audit Webflow cart DOM & JavaScript trigger hooks',
        'Configure Vercel serverless middleware environment secrets',
        'Initialize BigCommerce Store API credentials & store channel',
      ],
      milestone: false,
    },
    {
      days: 'Day 2–3',
      title: 'Core Checkout Pipeline & Authoritative Totals',
      tasks: [
        'Deploy /api/checkout/session (SKUs & Quantities payload only)',
        'BigCommerce consignment & shipping rate calculation engine',
        'Stripe Elements card form with backend PaymentIntent creation',
        'WORKING END-TO-END CARD CHECKOUT OPERATIONAL BY DAY 3',
      ],
      milestone: true,
    },
    {
      days: 'Day 4–5',
      title: '3DS SCA, Stock Depletion & Edge Case Hardening',
      tasks: [
        'Implement 3D Secure 2.2 challenge handling for UK/EU cards',
        'Deploy strict Idempotency-Key validation to stop duplicate charges',
        'Connect real-time inventory locking & sell-out resolution modal',
      ],
      milestone: false,
    },
    {
      days: 'Day 6–7',
      title: 'Stripe Webhooks, Order Creation & Downstream Events',
      tasks: [
        'Deploy Stripe webhook receiver for payment_intent.succeeded',
        'Generate authoritative BigCommerce orders with transaction references',
        'Verify Klaviyo "Placed Order" metrics & warehouse fulfillment routing',
      ],
      milestone: false,
    },
    {
      days: 'Day 8',
      title: 'Express Wallets (Apple Pay & Google Pay)',
      tasks: [
        'Deploy 1-click Apple Pay & Google Pay on product pages & cart drawer',
        'Domain verification for Apple Pay & Google Pay Merchant ID',
      ],
      milestone: false,
    },
    {
      days: 'Day 9–10',
      title: 'Cross-Device QA, Load Testing & Launch Day Buffer',
      tasks: [
        'Full mobile & desktop regression test matrix across cards',
        'Zero-downtime DNS deployment & launch monitoring standby',
        'Buffer time to ensure flawless launch day execution',
      ],
      milestone: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-bg">
      {/* Header Banner */}
      <div className="border-b border-border bg-surface px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold block mb-2">
            Engineering Proposal & Delivery Roadmap
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight tracking-[-0.015em]">
            A calm path to launch day.
          </h1>
          <p className="text-base sm:text-lg text-ink-2 mt-4 max-w-2xl leading-relaxed">
            Preserve your finished Webflow storefront design. Let BigCommerce enforce prices, taxes, and inventory. Process payments securely via Stripe.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setContactOpen(true)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start the Conversation
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 flex-1">
        {/* Section 1: Day by Day Plan */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <h2 className="font-serif text-2xl text-ink font-normal">10-Day Delivery Timeline</h2>
          </div>

          <div className="space-y-4">
            {timelineDays.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xs border ${
                  item.milestone
                    ? 'bg-surface-elevated border-ink ring-1 ring-ink shadow-sm'
                    : 'bg-surface border-border'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-secondary text-ink rounded-xs">
                      {item.days}
                    </span>
                    <h3 className="font-serif text-lg text-ink font-normal">{item.title}</h3>
                  </div>

                  {item.milestone && (
                    <span className="text-[10px] font-mono uppercase bg-accent-soft text-accent px-2 py-0.5 rounded-full font-semibold shrink-0">
                      Key Milestone
                    </span>
                  )}
                </div>

                <ul className="space-y-1.5 text-xs text-ink-2 pl-4 list-disc">
                  {item.tasks.map((task, tIdx) => (
                    <li key={tIdx} className={task.includes('OPERATIONAL') ? 'font-semibold text-accent' : ''}>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Technical Questions Addressed */}
        <section className="space-y-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <h2 className="font-serif text-2xl text-ink font-normal">
              Technical Architecture & Risk Mitigation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 bg-surface rounded-xs border border-border space-y-2">
              <h3 className="font-serif text-base text-ink font-normal">
                Q: Why not trust browser prices?
              </h3>
              <p className="text-ink-2 leading-relaxed">
                Browser payloads can easily be manipulated via browser DevTools. In this architecture, the Webflow frontend only sends SKUs and quantities. BigCommerce authoritative catalog prices are calculated server-side.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-xs border border-border space-y-2">
              <h3 className="font-serif text-base text-ink font-normal">
                Q: How do we prevent duplicate charges?
              </h3>
              <p className="text-ink-2 leading-relaxed">
                Every payment request includes a cryptographically unique Idempotency-Key. If a customer clicks twice or network drops, the backend recognizes the key and returns the initial order without double-charging.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-xs border border-border space-y-2">
              <h3 className="font-serif text-base text-ink font-normal">
                Q: What happens if a tab is closed during 3DS?
              </h3>
              <p className="text-ink-2 leading-relaxed">
                A server-side Stripe webhook backstop (/api/webhooks/stripe) captures the payment_intent.succeeded event asynchronously and marks the BigCommerce order as paid even if the customer drops connection.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Credentials Matrix */}
        <section className="p-6 bg-[#16191A] text-[#E6E2DA] rounded-md border border-[#2C3234] font-mono text-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#2C3234] pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-hood-accent" />
              <span className="font-semibold text-white">Zero-Trust Environment Secret Management</span>
            </div>
            <span className="text-hood-success text-[11px]">SOC-2 / PCI DSS LEVEL 1</span>
          </div>

          <p className="text-[#9A958B] text-[11px] leading-relaxed">
            No API secrets (BigCommerce Client Secret, Access Token, or Stripe Secret Key) are ever exposed in client bundles or GitHub commits. All calls route through secure Vercel Serverless Functions.
          </p>
        </section>
      </div>

      {/* Contact Modal */}
      <Modal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Start the Conversation"
        description="Let's align on your launch schedule and technical requirements."
        maxWidth="md"
      >
        {sent ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
            <h4 className="font-serif text-xl text-ink">Thanks. I will reply within a few hours.</h4>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-3 pt-2">
            <FormField
              label="Your Name"
              placeholder="e.g. Amelia Hartwell"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
            <FormField
              label="Work Email"
              type="email"
              placeholder="amelia@brand.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
            <div>
              <label htmlFor="proposal-message-input" className="text-xs font-medium uppercase tracking-[0.08em] text-ink-2 mb-1.5 block">
                Project Notes
              </label>
              <textarea
                id="proposal-message-input"
                rows={3}
                placeholder="Target launch date, current Webflow status, questions..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full bg-surface-elevated text-ink px-3.5 py-2.5 rounded-sm border border-border text-sm focus:outline-none focus:ring-2 focus:ring-info"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" size="md" onClick={() => setContactOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Send Message
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  );
};
