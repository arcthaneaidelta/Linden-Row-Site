import React from 'react';
import { Hero } from '../components/marketing/Hero';
import { ProductCard } from '../components/commerce/ProductCard';
import { ArchitectureStory } from '../components/marketing/ArchitectureStory';
import { BuiltToProtect } from '../components/marketing/BuiltToProtect';
import { Lookbook } from '../components/marketing/Lookbook';
import { TimelineSection } from '../components/marketing/TimelineSection';
import { Footer } from '../components/marketing/Footer';
import { CATALOGUE } from '../mock/catalogue';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  // 4 Featured products
  const featured = [CATALOGUE[0], CATALOGUE[1], CATALOGUE[2], CATALOGUE[5]];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Featured Pieces Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-[0.08em] text-accent font-semibold block mb-1">
              Curated Wardrobe
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
              Featured Pieces
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs uppercase font-medium tracking-[0.08em] text-ink-2 hover:text-ink transition-colors"
          >
            <span>View All 12 Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Column Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Architecture Story & Diagram (Section 5.2 #3) */}
      <ArchitectureStory />

      {/* 4. Built to Protect Launch Day (Section 5.2 #4) */}
      <BuiltToProtect />

      {/* 5. Editorial Lookbook Strip (Section 5.2 #5) */}
      <Lookbook />

      {/* 6. 10-Day Delivery Roadmap (Section 5.2 #6) */}
      <TimelineSection />

      {/* 7. Proposal Closing CTA & Footer (Section 5.4) */}
      <Footer />
    </div>
  );
};
