import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../state/cartStore';
import { useCheckoutStore } from '../../state/checkoutStore';
import { ArrowRight, Server, ShieldCheck, Zap, Globe, CheckCircle2, Lock } from 'lucide-react';

export const ArchitectureStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const navigate = useNavigate();
  const openDrawer = useCartStore((s) => s.openDrawer);
  const fillSampleDetails = useCheckoutStore((s) => s.fillSampleDetails);

  const steps = [
    {
      number: 1,
      title: 'Cart & Identifiers in Webflow',
      description: 'The customer shops the polished Webflow UI. When checkout starts, the browser transmits ONLY product SKUs and quantities—never prices or totals.',
      targetNode: 'webflow',
      actionLabel: 'Open Sample Bag',
      action: () => openDrawer(),
    },
    {
      number: 2,
      title: 'Server-Authoritative Check in Vercel',
      description: 'Vercel serverless middleware creates a BigCommerce checkout session. BigCommerce calculates authoritative prices, taxes, and checks live inventory.',
      targetNode: 'vercel',
      actionLabel: 'Test Price Tamper Resistance',
      action: () => {
        // open drawer & trigger session
        openDrawer();
      },
    },
    {
      number: 3,
      title: 'Real-Time Consignments & Shipping',
      description: 'Customer enters shipping details. BigCommerce computes destination tax and returns verified carrier delivery rates.',
      targetNode: 'bigcommerce',
      actionLabel: 'Jump to Delivery Step',
      action: () => {
        fillSampleDetails();
        navigate('/checkout');
      },
    },
    {
      number: 4,
      title: 'Stripe 3DS / SCA Payment & Idempotency',
      description: 'Card details are processed via Stripe with mandatory Idempotency-Keys to prevent duplicate charges and bank 3DS SCA challenges.',
      targetNode: 'stripe',
      actionLabel: 'Try 3DS Test Card',
      action: () => navigate('/checkout'),
    },
    {
      number: 5,
      title: 'Paid Order Generated in BigCommerce',
      description: 'Upon verified payment confirmation and webhook backstop, BigCommerce generates a paid order record, locks stock, and triggers Klaviyo/WMS workflows.',
      targetNode: 'bigcommerce',
      actionLabel: 'View Sample Order Payload',
      action: () => {
        useCheckoutStore.setState({ isOrderRecordModalOpen: true });
        navigate('/checkout');
      },
    },
  ];

  return (
    <section id="architecture-story" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
      {/* Section Header */}
      <div className="max-w-2xl mb-16">
        <span className="text-xs uppercase font-mono tracking-[0.08em] text-accent font-semibold block mb-2">
          Architecture & Data Flow
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
          How the headless checkout protects your launch day.
        </h2>
        <p className="text-sm sm:text-base text-ink-2 mt-4 leading-relaxed">
          Webflow delivers the editorial brand look, while BigCommerce remains the impenetrable single source of truth for stock, price, tax, and orders.
        </p>
      </div>

      {/* Two Column Layout: Steps on Left, Interactive Pinned Diagram on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Numbered Story */}
        <div className="lg:col-span-6 space-y-6">
          {steps.map((step) => {
            const isActive = activeStep === step.number;

            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(step.number)}
                className={`p-6 rounded-xs border transition-all duration-med cursor-pointer ${
                  isActive
                    ? 'bg-surface-elevated border-ink ring-1 ring-ink shadow-sm'
                    : 'bg-surface/60 border-border hover:border-border-strong hover:bg-surface'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors ${
                      isActive
                        ? 'bg-primary text-surface'
                        : 'bg-secondary text-ink-muted'
                    }`}
                  >
                    0{step.number}
                  </span>

                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-ink font-normal leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-2 mt-2 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          step.action();
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-ink underline-offset-4 hover:underline transition-colors"
                      >
                        <span>{step.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Architectural Live Diagram */}
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <div className="bg-[#16191A] text-[#E6E2DA] p-6 sm:p-8 rounded-md border border-[#2C3234] shadow-md font-mono text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#2C3234] mb-6">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-hood-accent" />
                <span className="font-semibold text-white">System Architecture Topology</span>
              </div>
              <span className="text-[10px] text-hood-success bg-hood-success/15 px-2 py-0.5 rounded-xs border border-hood-success/30">
                ACTIVE PIPELINE
              </span>
            </div>

            {/* Diagram Nodes Grid */}
            <div className="space-y-4">
              {/* Node 1: Webflow Storefront */}
              <div
                className={`p-4 rounded-xs border transition-all duration-med ${
                  steps[activeStep - 1].targetNode === 'webflow'
                    ? 'bg-[#1F2324] border-hood-accent ring-1 ring-hood-accent shadow-sm'
                    : 'bg-[#1A1D1E] border-[#2C3234] opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#4353FF]" />
                    <span className="font-semibold text-white">1. Webflow Frontend Storefront</span>
                  </div>
                  <span className="text-[10px] text-[#9A958B] uppercase">Client Untrusted</span>
                </div>
                <p className="text-[11px] text-[#9A958B] mt-1.5">
                  Editorial lookbook & bag drawer. Transmits only SKU <span className="text-white">LR-OS-001</span> & Qty.
                </p>
              </div>

              {/* Connecting Pipe */}
              <div className="flex justify-center -my-2">
                <div className="h-4 w-[2px] bg-hood-accent" />
              </div>

              {/* Node 2: Vercel Middleware */}
              <div
                className={`p-4 rounded-xs border transition-all duration-med ${
                  steps[activeStep - 1].targetNode === 'vercel'
                    ? 'bg-[#1F2324] border-hood-accent ring-1 ring-hood-accent shadow-sm'
                    : 'bg-[#1A1D1E] border-[#2C3234] opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-white" />
                    <span className="font-semibold text-white">2. Vercel Serverless Middleware</span>
                  </div>
                  <span className="text-[10px] text-hood-accent uppercase">Security Barrier</span>
                </div>
                <p className="text-[11px] text-[#9A958B] mt-1.5">
                  Validates inputs, handles Idempotency-Keys, stores private API secrets out of browser reach.
                </p>
              </div>

              {/* Connecting Pipe */}
              <div className="flex justify-center -my-2">
                <div className="h-4 w-[2px] bg-hood-accent" />
              </div>

              {/* Node 3: BigCommerce Engine */}
              <div
                className={`p-4 rounded-xs border transition-all duration-med ${
                  steps[activeStep - 1].targetNode === 'bigcommerce'
                    ? 'bg-[#1F2324] border-emerald-400 ring-1 ring-emerald-400 shadow-sm'
                    : 'bg-[#1A1D1E] border-[#2C3234] opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">3. BigCommerce Commerce Engine</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 uppercase">Source of Truth</span>
                </div>
                <p className="text-[11px] text-[#9A958B] mt-1.5">
                  Authoritative pricing, tax calculations, live inventory deduction, order state creation.
                </p>
              </div>

              {/* Connecting Pipe */}
              <div className="flex justify-center -my-2">
                <div className="h-4 w-[2px] bg-hood-accent" />
              </div>

              {/* Node 4: Stripe Payments */}
              <div
                className={`p-4 rounded-xs border transition-all duration-med ${
                  steps[activeStep - 1].targetNode === 'stripe'
                    ? 'bg-[#1F2324] border-[#635BFF] ring-1 ring-[#635BFF] shadow-sm'
                    : 'bg-[#1A1D1E] border-[#2C3234] opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#635BFF]" />
                    <span className="font-semibold text-white">4. Stripe Gateway & Webhooks</span>
                  </div>
                  <span className="text-[10px] text-purple-300 uppercase">SCA 3DS Protected</span>
                </div>
                <p className="text-[11px] text-[#9A958B] mt-1.5">
                  Processes PaymentIntents, verifies bank authentication, dispatches webhook confirmations.
                </p>
              </div>
            </div>

            {/* Diagram Footer */}
            <div className="mt-6 pt-4 border-t border-[#2C3234] flex items-center justify-between text-[11px] text-[#9A958B]">
              <span>Active Inspection Step: 0{activeStep} of 05</span>
              <button
                onClick={() => {
                  const el = document.getElementById('failure-lab-anchor');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-hood-accent hover:underline"
              >
                View Failure Cases →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
