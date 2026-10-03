import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CATALOGUE } from '../../mock/catalogue';

export const Hero: React.FC = () => {
  const scrollToArchitecture = () => {
    const el = document.getElementById('architecture-story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroItem = CATALOGUE[0]; // Wool Overshirt

  return (
    <section className="relative w-full pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F6F2EC] border-b border-[#E2DBD0]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Collection pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FBF9F5] rounded-full border border-[#E2DBD0] shadow-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-[#B5654A] animate-pulse" />
              <span className="text-[11px] uppercase font-mono tracking-widest text-[#4A453F] font-medium">
                Autumn / Winter 2026 Collection
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1E1B18] tracking-[-0.02em] leading-[1.05]">
              Wardrobe staples, made in small runs.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-[#4A453F] max-w-xl font-normal leading-relaxed">
              Portuguese wool, hand-finished linings, delivered in two days. Powered by a headless BigCommerce engine and Stripe payments.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Link to="/shop">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-8 bg-[#26332C] hover:bg-[#1B251F] text-[#FBF9F5]"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Shop the Collection
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 bg-[#FBF9F5] border-[#C9C0B2] text-[#1E1B18] hover:bg-[#E9E2D6]"
                onClick={scrollToArchitecture}
              >
                See How Checkout Works
              </Button>
            </div>

            {/* Trust Chips */}
            <div className="mt-12 pt-8 border-t border-[#E2DBD0] w-full grid grid-cols-3 gap-4 text-xs font-mono text-[#7C766D]">
              <div>
                <span className="text-[#B5654A] font-semibold block text-sm">01</span>
                <span className="text-[#1E1B18] font-medium block mt-0.5">Webflow UI</span>
                <span className="text-[11px] text-[#7C766D] hidden sm:block">Pixel-perfect storefront</span>
              </div>
              <div>
                <span className="text-[#B5654A] font-semibold block text-sm">02</span>
                <span className="text-[#1E1B18] font-medium block mt-0.5">BigCommerce</span>
                <span className="text-[11px] text-[#7C766D] hidden sm:block">Authoritative orders & tax</span>
              </div>
              <div>
                <span className="text-[#B5654A] font-semibold block text-sm">03</span>
                <span className="text-[#1E1B18] font-medium block mt-0.5">Stripe 3DS</span>
                <span className="text-[11px] text-[#7C766D] hidden sm:block">Zero-trust SCA checkout</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Hero Campaign Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-[#FBF9F5] p-3 rounded-xs border border-[#E2DBD0] shadow-md group">
              <div className="aspect-[4/5] rounded-xs overflow-hidden bg-[#E9E2D6] relative">
                <img
                  src={heroItem.images[0]}
                  alt="Linden Row Portuguese Melton Wool Overshirt"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-3 left-3 bg-[#1E1B18]/80 backdrop-blur-xs text-[#FBF9F5] px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider">
                  Featured Staple
                </div>

                <div className="absolute bottom-3 inset-x-3 bg-[#FBF9F5]/95 backdrop-blur-sm p-3.5 rounded-xs border border-[#E2DBD0] shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-sm font-medium text-[#1E1B18] leading-tight">
                      {heroItem.name}
                    </h3>
                    <p className="text-[11px] text-[#7C766D] font-mono mt-0.5">
                      {heroItem.colour} · 420gsm Portuguese Wool
                    </p>
                  </div>
                  <span className="font-serif text-base font-medium text-[#1E1B18]">
                    £148.00
                  </span>
                </div>
              </div>
            </div>

            {/* Ambient Background Accent Card */}
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#E9E2D6]/40 -z-10 rounded-xs border border-[#E2DBD0]" />
          </div>
        </div>
      </div>
    </section>
  );
};
