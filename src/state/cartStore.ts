import { create } from 'zustand';

export interface CartItem {
  id: string; // SKU + Size combo
  sku: string;
  name: string;
  colour: string;
  size: string;
  quantity: number;
  pricePence: number;
  image: string;
  slug: string;
  maxStock: number;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  lastRemovedItem: { item: CartItem; index: number } | null;
  undoTimeoutId: any | null;
  badgePulsing: boolean;

  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  undoRemove: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotalPence: () => number;
  totalQuantity: () => number;
}

// Initial sample cart items per PRD (Wool Overshirt Slate M, Pleated Trouser Ink 32)
const initialItems: CartItem[] = [
  {
    id: 'LR-OS-001-M',
    sku: 'LR-OS-001',
    name: 'Wool Overshirt',
    colour: 'Slate',
    size: 'M',
    quantity: 1,
    pricePence: 14800,
    image: '', // Will be updated on load
    slug: 'wool-overshirt-slate',
    maxStock: 14,
  },
  {
    id: 'LR-TR-010-32',
    sku: 'LR-TR-010',
    name: 'Pleated Trouser',
    colour: 'Ink',
    size: '32',
    quantity: 1,
    pricePence: 12800,
    image: '',
    slug: 'pleated-trouser-ink',
    maxStock: 22,
  },
];

export const useCartStore = create<CartStore>((set, get) => ({
  items: initialItems,
  isDrawerOpen: false,
  lastRemovedItem: null,
  undoTimeoutId: null,
  badgePulsing: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  addItem: (item) => {
    const id = `${item.sku}-${item.size}`;
    const existing = get().items.find((i) => i.id === id);

    if (existing) {
      const newQty = Math.min(existing.quantity + item.quantity, item.maxStock);
      set({
        items: get().items.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)),
        badgePulsing: true,
      });
    } else {
      set({
        items: [...get().items, { ...item, id }],
        badgePulsing: true,
      });
    }

    setTimeout(() => {
      set({ badgePulsing: false });
    }, 1200);
  },

  removeItem: (id) => {
    const index = get().items.findIndex((i) => i.id === id);
    const item = get().items[index];
    if (!item) return;

    // Clear previous undo timer if active
    if (get().undoTimeoutId) {
      clearTimeout(get().undoTimeoutId);
    }

    const timeoutId = setTimeout(() => {
      set({ lastRemovedItem: null, undoTimeoutId: null });
    }, 4000);

    set({
      items: get().items.filter((i) => i.id !== id),
      lastRemovedItem: { item, index },
      undoTimeoutId: timeoutId,
    });
  },

  undoRemove: () => {
    const last = get().lastRemovedItem;
    if (!last) return;

    if (get().undoTimeoutId) {
      clearTimeout(get().undoTimeoutId);
    }

    const newItems = [...get().items];
    newItems.splice(last.index, 0, last.item);

    set({
      items: newItems,
      lastRemovedItem: null,
      undoTimeoutId: null,
    });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set({
      items: get().items.map((i) => {
        if (i.id === id) {
          return { ...i, quantity: Math.min(quantity, i.maxStock) };
        }
        return i;
      }),
    });
  },

  clearCart: () => set({ items: [], lastRemovedItem: null }),

  subtotalPence: () => {
    return get().items.reduce((sum, item) => sum + item.pricePence * item.quantity, 0);
  },

  totalQuantity: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
