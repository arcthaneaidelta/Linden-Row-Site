import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../mock/catalogue';
import { formatMoney } from '../../lib/money';
import { useCartStore } from '../../state/cartStore';
import { Plus, Check } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const isLowStock = product.stock > 0 && product.stock <= 3;
  const isSoldOut = product.stock === 0;

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;

    setIsAdding(true);
    setTimeout(() => {
      addItem({
        sku: product.sku,
        name: product.name,
        colour: product.colour,
        size,
        quantity: 1,
        pricePence: product.pricePence,
        image: product.images[0],
        slug: product.slug,
        maxStock: product.stock,
      });
      setIsAdding(false);
      setJustAdded(true);
      setShowSizePicker(false);

      setTimeout(() => {
        setJustAdded(false);
        openDrawer();
      }, 700);
    }, 400);
  };

  return (
    <div
      className="group relative flex flex-col bg-surface-elevated rounded-xs border border-border overflow-hidden transition-all duration-med hover:border-border-strong"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizePicker(false);
      }}
    >
      {/* 4:5 Aspect Ratio Image Container */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] bg-bg overflow-hidden">
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-med ${
            isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {/* Secondary Image on Hover */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-med ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        )}

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="px-2 py-0.5 text-[11px] font-sans font-medium uppercase tracking-wider bg-ink/80 text-surface rounded-full">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 text-[11px] font-sans font-medium uppercase tracking-wider bg-accent-soft text-accent rounded-full border border-accent/20">
              Only {product.stock} Left
            </span>
          ) : null}
        </div>

        {/* Quick Add Overlay on Desktop Hover or Mobile tap */}
        {!isSoldOut && (
          <div
            className={`absolute bottom-3 inset-x-3 transition-all duration-med z-20 ${
              isHovered || showSizePicker ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            {showSizePicker ? (
              <div
                className="bg-surface-elevated/95 backdrop-blur-sm p-2 rounded-sm shadow-md border border-border flex flex-wrap gap-1.5 justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="w-full text-center text-[10px] uppercase font-mono text-ink-muted mb-0.5">
                  Select Size
                </span>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => handleQuickAdd(e, s)}
                    className="px-2.5 py-1 text-xs font-medium border border-border-strong rounded-xs hover:border-ink hover:bg-secondary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (product.sizes.length === 1) {
                    handleQuickAdd(e, product.sizes[0]);
                  } else {
                    setShowSizePicker(true);
                  }
                }}
                disabled={isAdding || justAdded}
                className="w-full bg-primary/95 text-surface text-xs font-medium py-2.5 px-3 rounded-xs shadow-sm hover:bg-primary transition-colors flex items-center justify-center gap-1.5 backdrop-blur-sm"
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-accent-soft" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-surface-elevated">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <Link to={`/product/${product.slug}`} className="font-serif text-base text-ink hover:text-accent transition-colors line-clamp-1 font-normal">
              {product.name}
            </Link>
            <span className="font-sans text-sm font-medium text-ink shrink-0">
              {formatMoney(product.pricePence, false)}
            </span>
          </div>

          <div className="flex items-center justify-between mt-1 text-xs text-ink-muted">
            <span>{product.colour}</span>
            <span>{product.availableColours.length} {product.availableColours.length === 1 ? 'colour' : 'colours'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
