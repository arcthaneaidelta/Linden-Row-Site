import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const schedule = [
    {
      days: 'Days 1–3',
      title: 'Core Serverless Checkout & BigCommerce Engine',
      detail: 'Connect Webflow cart to Vercel middleware, establish BigCommerce checkout session, calculate authoritative totals, and integrate Stripe Elements.',
      milestone: true,
    },
    {
      days: 'Days 4–6',
      title: '3DS SCA Security, Edge Cases & Tamper Testing',
      detail: 'Implement 3D Secure 2.2 authentication, idempotency safeguards, stock depletion validation, and Stripe webhook reconciliation.',
      milestone: false,
    },
    {
      days: 'Days 7–8',
      title: 'Apple Pay & Google Pay Express Wallets',
      detail: 'Deploy 1-click Express wallet sheets on cart drawer and product detail pages with instant order creation.',
      milestone: false,
    },
    {
      days: 'Days 9–10',
      title: 'End-to-End QA, Analytics Handoff & Launch Buffer',
      detail: 'Execute full stress test matrix, verify Klaviyo event triggers, test warehouse WMS ingestion, and perform zero-downtime DNS cutover.',
      milestone: false,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-[0.08em] text-accent font-semibold block mb-2">
            10-Day Launch Roadmap
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
            A calm, predictable path to launch day.
          </h2>
          <p className="text-sm text-ink-2 mt-2 max-w-xl leading-relaxed">
            Working card checkout operational by Day 3. Full testing buffer ahead of your fixed launch deadline.
          </p>
        </div>

        <Link to="/proposal">
          <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View Full Proposal & Architecture
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {schedule.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-xs border flex flex-col justify-between ${
              item.milestone
                ? 'bg-surface-elevated border-ink ring-1 ring-ink shadow-sm'
                : 'bg-surface border-border'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-xs bg-secondary text-ink">
                  {item.days}
                </span>
                {item.milestone && (
                  <span className="text-[10px] font-mono uppercase bg-accent-soft text-accent px-2 py-0.5 rounded-full font-semibold">
                    Core Milestone
                  </span>
                )}
              </div>

              <h3 className="font-serif text-base text-ink font-normal mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-ink-2 leading-relaxed">{item.detail}</p>
            </div>

            <div className="mt-6 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-ink-muted">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>Tested before launch</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
