import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATALOGUE } from '../mock/catalogue';
import { mockStore } from '../mock/store';
import { formatMoney } from '../lib/money';
import { SizeSelector } from '../components/commerce/SizeSelector';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../state/cartStore';
import { useCheckoutStore } from '../state/checkoutStore';
import { Footer } from '../components/marketing/Footer';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const product = CATALOGUE.find((p) => p.slug === slug) || CATALOGUE[0];
  const liveStock = mockStore.getStock(product.sku);

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<string | null>('materials');

  const addItem = useCartStore((s: any) => s.addItem);
  const openDrawer = useCartStore((s: any) => s.openDrawer);
  const openWalletSheet = useCheckoutStore((s: any) => s.openWalletSheet);

  const isLowStock = liveStock > 0 && liveStock <= 3;
  const isSoldOut = liveStock === 0;

  // Reset selected size when product changes
  useEffect(() => {
    if (product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product.slug]);

  const handleAddToBag = () => {
    if (isSoldOut) return;
    setIsAdding(true);

    setTimeout(() => {
      addItem({
        sku: product.sku,
        name: product.name,
        colour: product.colour,
        size: selectedSize,
        quantity: 1,
        pricePence: product.pricePence,
        image: product.images[0],
        slug: product.slug,
        maxStock: liveStock,
      });

      setIsAdding(false);
      setJustAdded(true);

      setTimeout(() => {
        setJustAdded(false);
        openDrawer();
      }, 600);
    }, 450);
  };

  const handleExpressWallet = (type: 'Apple Pay' | 'Google Pay') => {
    openWalletSheet(type, {
      sku: product.sku,
      name: product.name,
      pricePence: product.pricePence,
      size: selectedSize,
      image: product.images[0],
    });
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-bg">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="border-b border-border bg-surface px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-ink transition-colors">The Collection</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink-2 font-medium truncate">{product.name}</span>
        </div>
      </nav>

      {/* Main Product Two-Column Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Image Gallery (58%) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Featured Image */}
            <div className="aspect-[4/5] bg-surface rounded-xs overflow-hidden border border-border">
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`aspect-[4/5] bg-surface rounded-xs overflow-hidden border transition-all ${
                    selectedImageIdx === idx
                      ? 'border-ink ring-1 ring-ink'
                      : 'border-border opacity-70 hover:opacity-100 hover:border-border-strong'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Product Details (42%) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink leading-tight">
                  {product.name}
                </h1>
                <span className="font-serif text-2xl font-normal text-ink shrink-0">
                  {formatMoney(product.pricePence)}
                </span>
              </div>

              <p className="text-xs text-ink-muted mt-1">
                SKU: <span className="font-mono text-ink-2">{product.sku}</span> · Currency: GBP (incl. 20% VAT)
              </p>
            </div>

            <p className="text-sm text-ink-2 leading-relaxed">
              {product.description}
            </p>

            {/* Colour Selector */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium uppercase tracking-[0.08em] text-ink-2">Colour</span>
                <span className="text-ink font-medium">{product.colour}</span>
              </div>

              <div className="flex items-center gap-3">
                {product.availableColours.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/product/${c.slug}`}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      c.slug === product.slug
                        ? 'ring-2 ring-ink ring-offset-2 ring-offset-bg'
                        : 'hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                    title={c.name}
                  >
                    <span
                      className="w-full h-full rounded-full border border-border-strong shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              stockCount={liveStock}
            />

            {/* Live Stock Indicator (Reads from BigCommerce Store) */}
            <div className="pt-1 flex items-center gap-2 text-xs font-mono">
              {isSoldOut ? (
                <span className="text-error font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error" />
                  Sold Out in BigCommerce Catalog
                </span>
              ) : isLowStock ? (
                <span className="text-accent font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Only {liveStock} {liveStock === 1 ? 'unit' : 'units'} left in BigCommerce
                </span>
              ) : (
                <span className="text-success font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  In Stock ({liveStock} available in BigCommerce)
                </span>
              )}
            </div>

            {/* Add To Bag Primary CTA */}
            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-sm font-medium"
                isLoading={isAdding}
                isSuccess={justAdded}
                loadingText="Adding to bag..."
                successText="Added to bag"
                disabled={isSoldOut}
                onClick={handleAddToBag}
              >
                {isSoldOut ? 'Sold Out' : 'Add to Bag'}
              </Button>

              {/* Express Checkout Wallets (Apple Pay / Google Pay) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                    Phase 2 Preview · Instant 1-Tap Checkout
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="wallet-apple"
                    size="md"
                    className="w-full text-xs"
                    disabled={isSoldOut}
                    onClick={() => handleExpressWallet('Apple Pay')}
                  >
                    Apple Pay
                  </Button>

                  <Button
                    variant="wallet-google"
                    size="md"
                    className="w-full text-xs"
                    disabled={isSoldOut}
                    onClick={() => handleExpressWallet('Google Pay')}
                  >
                    Google Pay
                  </Button>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-border pt-4 divide-y divide-border text-xs">
              {/* Materials */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('materials')}
                  className="w-full flex items-center justify-between font-medium uppercase tracking-[0.08em] text-ink-2 text-left"
                >
                  <span>Materials & Care</span>
                  {openAccordion === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'materials' && (
                  <div className="mt-2 text-ink-muted leading-relaxed space-y-1.5">
                    <p>{product.materials}</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Fit */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('fit')}
                  className="w-full flex items-center justify-between font-medium uppercase tracking-[0.08em] text-ink-2 text-left"
                >
                  <span>Fit & Sizing</span>
                  {openAccordion === 'fit' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'fit' && (
                  <div className="mt-2 text-ink-muted leading-relaxed">
                    <p>{product.fit}</p>
                  </div>
                )}
              </div>

              {/* Delivery & Returns */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('delivery')}
                  className="w-full flex items-center justify-between font-medium uppercase tracking-[0.08em] text-ink-2 text-left"
                >
                  <span>Delivery & Returns</span>
                  {openAccordion === 'delivery' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'delivery' && (
                  <div className="mt-2 text-ink-muted leading-relaxed">
                    <p>{product.deliveryAndReturns}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
