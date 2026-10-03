import React, { useState, useMemo } from 'react';
import { CATALOGUE, Product } from '../mock/catalogue';
import { mockStore } from '../mock/store';
import { ProductCard } from '../components/commerce/ProductCard';
import { Footer } from '../components/marketing/Footer';
import { Button } from '../components/ui/Button';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

export const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = ['All', 'Outerwear', 'Trousers', 'Knitwear', 'Shirts', 'Skirts', 'Dresses', 'Accessories'];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34', '36', 'One size'];

  // Query live store products for dynamic stock updates
  const allProducts: Product[] = useMemo(() => {
    return CATALOGUE.map((catProd) => {
      const liveStock = mockStore.getStock(catProd.sku);
      return { ...catProd, stock: liveStock };
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      if (selectedAvailability === 'in_stock' && product.stock === 0) {
        return false;
      }
      if (selectedAvailability === 'low_stock' && (product.stock === 0 || product.stock > 3)) {
        return false;
      }
      if (selectedSize !== 'All' && !product.sizes.includes(selectedSize)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePence - b.pricePence;
      if (sortBy === 'price-desc') return b.pricePence - a.pricePence;
      return 0; // Default featured order
    });
  }, [allProducts, selectedCategory, selectedAvailability, selectedSize, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedAvailability('All');
    setSelectedSize('All');
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedAvailability !== 'All' || selectedSize !== 'All';

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-bg">
      {/* Header Band */}
      <div className="border-b border-border bg-surface px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
              Storefront Catalog
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
              The Collection
            </h1>
          </div>
          <span className="text-xs font-mono text-ink-muted">
            Showing {filteredProducts.length} of {allProducts.length} pieces
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Desktop Left Filter Rail (240px) */}
          <aside className="hidden lg:block w-60 shrink-0 space-y-8 sticky top-24">
            {/* Category Filter */}
            <div>
              <h3 className="text-xs uppercase font-mono tracking-wider text-ink font-semibold mb-3">
                Category
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-xs py-1 transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'font-semibold text-ink'
                        : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <h3 className="text-xs uppercase font-mono tracking-wider text-ink font-semibold mb-3">
                Availability
              </h3>
              <div className="space-y-1.5">
                {[
                  { id: 'All', label: 'All Items' },
                  { id: 'in_stock', label: 'In Stock' },
                  { id: 'low_stock', label: 'Low Stock Demo (<4)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedAvailability(opt.id)}
                    className={`w-full text-left text-xs py-1 transition-colors flex items-center justify-between ${
                      selectedAvailability === opt.id
                        ? 'font-semibold text-ink'
                        : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedAvailability === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="text-xs uppercase font-mono tracking-wider text-ink font-semibold mb-3">
                Size
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-2 py-1 text-xs rounded-xs border transition-colors ${
                      selectedSize === s
                        ? 'bg-secondary border-ink text-ink font-semibold'
                        : 'bg-surface-elevated border-border text-ink-2 hover:border-border-strong'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            )}
          </aside>

          {/* Right Area: Toolbar and Product Grid */}
          <main className="flex-1 w-full">
            {/* Mobile Filter Button & Sorting Dropdown */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-border gap-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-surface rounded-xs border border-border text-xs font-mono font-medium text-ink"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters && '(Active)'}</span>
              </button>

              <div className="flex items-center gap-2 ml-auto text-xs">
                <span className="text-ink-muted font-mono hidden sm:inline">Sort:</span>
                <div className="relative inline-flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-surface-elevated text-ink px-3 py-2 rounded-xs border border-border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ink appearance-none pr-8 cursor-pointer"
                  >
                    <option value="featured">Featured Pieces</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-surface rounded-sm border border-border p-8">
                <h3 className="font-serif text-xl text-ink font-normal mb-2">
                  Nothing matches those filters
                </h3>
                <p className="text-xs text-ink-muted mb-6 max-w-sm mx-auto">
                  Try clearing some filter criteria to explore the rest of the Linden Row collection.
                </p>
                <Button variant="secondary" size="md" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              /* Product Grid (4 col desktop, 3 col tablet, 2 col mobile) */
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-ink/40"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm h-full bg-surface border-r border-border p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-med overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="font-serif text-lg font-normal">Filters</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-ink-muted hover:text-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs uppercase font-mono font-semibold mb-2">Category</h4>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`w-full text-left text-xs py-1.5 ${
                        selectedCategory === c ? 'font-semibold text-ink' : 'text-ink-2'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-xs uppercase font-mono font-semibold mb-2">Availability</h4>
                <div className="space-y-1">
                  {[
                    { id: 'All', label: 'All Items' },
                    { id: 'in_stock', label: 'In Stock' },
                    { id: 'low_stock', label: 'Low Stock (<4)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedAvailability(opt.id)}
                      className={`w-full text-left text-xs py-1.5 ${
                        selectedAvailability === opt.id ? 'font-semibold text-ink' : 'text-ink-2'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={clearFilters}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
