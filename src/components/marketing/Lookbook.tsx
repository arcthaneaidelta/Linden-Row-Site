import React, { useRef } from 'react';
import { CATALOGUE } from '../../mock/catalogue';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Lookbook: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const lookbookItems = [
    {
      title: 'No. 01 — Portuguese Wool Melton',
      caption: 'Woven in Covilhã · 420gsm heavy hand-feel',
      image: CATALOGUE[0].images[0],
      tag: 'Outerwear',
    },
    {
      title: 'No. 02 — High-Twist Wool Twill',
      caption: 'Deep forward pleat with clean drape profile',
      image: CATALOGUE[2].images[0],
      tag: 'Tailoring',
    },
    {
      title: 'No. 03 — Seamless 7-Gauge Merino',
      caption: 'Spun in Hawick, Scotland · Botanical dye tint',
      image: CATALOGUE[4].images[0],
      tag: 'Knitwear',
    },
    {
      title: 'No. 04 — Double-Faced Cashmere Blend',
      caption: 'Hand-split perimeter seams taking 14 hours per coat',
      image: CATALOGUE[6].images[0],
      tag: 'Atelier',
    },
    {
      title: 'No. 05 — Egyptian Poplin 120/2',
      caption: 'Giza 87 long-staple cotton with genuine pearl buttons',
      image: CATALOGUE[7].images[0],
      tag: 'Shirting',
    },
    {
      title: 'No. 06 — French Flax Wrap Linen',
      caption: 'Woven in Normandy · Finished with kimono sleeves',
      image: CATALOGUE[10].images[0],
      tag: 'Dresses',
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section id="lookbook" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
      {/* Header with Navigation Arrows */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-xs uppercase font-mono tracking-[0.08em] text-accent font-semibold block mb-2">
            Autumn Lookbook
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
            Considered textures and silhouettes.
          </h2>
        </div>

        {/* Scroll Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-full border border-border bg-surface hover:border-ink hover:bg-surface-elevated transition-colors"
            aria-label="Scroll left in lookbook"
          >
            <ChevronLeft className="w-4 h-4 text-ink" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-full border border-border bg-surface hover:border-ink hover:bg-surface-elevated transition-colors"
            aria-label="Scroll right in lookbook"
          >
            <ChevronRight className="w-4 h-4 text-ink" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Strip */}
      <div
        ref={scrollContainerRef}
        className="flex md:flex-row flex-col gap-6 overflow-x-auto snap-x snap-mandatory pb-4 custom-scrollbar-light"
      >
        {lookbookItems.map((item, idx) => (
          <div
            key={idx}
            className="w-full md:w-[320px] lg:w-[360px] shrink-0 snap-start bg-surface rounded-xs border border-border overflow-hidden group hover:border-border-strong transition-all"
          >
            <div className="aspect-[4/5] bg-bg overflow-hidden relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-[1.02]"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] uppercase font-mono bg-ink/80 text-surface rounded-full">
                {item.tag}
              </span>
            </div>

            <div className="p-4 bg-surface-elevated">
              <h4 className="font-serif text-base text-ink font-normal leading-snug">{item.title}</h4>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
