import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../state/cartStore';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const totalQuantity = useCartStore((s) => s.totalQuantity());
  const openDrawer = useCartStore((s) => s.openDrawer);
  const badgePulsing = useCartStore((s) => s.badgePulsing);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 h-16 sm:h-16 flex items-center transition-colors duration-med ${
          !isHome || isScrolled
            ? 'bg-bg/95 backdrop-blur-md border-b border-border shadow-xs'
            : 'bg-transparent text-ink'
        }`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Brand Wordmark */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="font-serif text-xl sm:text-2xl font-normal tracking-[0.02em] text-ink lowercase select-none"
            >
              linden row
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.08em] font-medium text-ink-2">
              <Link to="/shop" className="hover:text-ink transition-colors">
                Shop
              </Link>
              <a href="/#lookbook" className="hover:text-ink transition-colors">
                Lookbook
              </a>
              <Link to="/proposal" className="hover:text-ink transition-colors">
                Delivery Plan
              </Link>
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-1.5 text-xs uppercase tracking-wider text-ink-2 hover:text-ink p-1.5 transition-colors"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
              <span className="text-[11px] font-mono hidden lg:inline">Search</span>
            </Link>

            {/* Cart Bag Icon with pulse badge */}
            <button
              onClick={openDrawer}
              className="relative p-2 text-ink hover:text-primary transition-transform duration-fast active:scale-95"
              aria-label={`Shopping bag containing ${totalQuantity} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span
                  className={`absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-primary text-surface text-[10px] font-mono rounded-full flex items-center justify-center transition-transform ${
                    badgePulsing ? 'scale-125 bg-accent' : 'scale-100'
                  }`}
                >
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-ink hover:text-primary transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm h-full bg-surface border-r border-border p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-med">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <span className="font-serif text-2xl lowercase">linden row</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-ink-muted hover:text-ink"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-6 font-serif text-2xl text-ink">
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
                  The Collection
                </Link>
                <a href="/#lookbook" onClick={() => setMobileMenuOpen(false)}>
                  Lookbook
                </a>
                <Link to="/proposal" onClick={() => setMobileMenuOpen(false)}>
                  Delivery Plan
                </Link>
                <Link to="/checkout" onClick={() => setMobileMenuOpen(false)}>
                  Demo Checkout
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-border text-xs text-ink-muted font-mono">
              <p>Considered wardrobe staples.</p>
              <p className="mt-1">Headless Webflow × BigCommerce × Stripe</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
