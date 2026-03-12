import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrderItem } from '@workspace/api-client-react';

export type CartItem = OrderItem & {
  cartId: string; // Unique ID for cart manipulation
  imageUrl?: string | null;
  type: 'product' | 'booking' | 'service';
};

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: Omit<CartItem, 'cartId'>) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addItem: (item) => {
        set((state) => {
          // Try to find existing identical item to stack
          const existingItemIndex = state.items.findIndex(
            (i) => 
              i.productId === item.productId && 
              i.serviceId === item.serviceId && 
              i.bookingId === item.bookingId &&
              i.type === item.type
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems, isOpen: true };
          }

          return {
            items: [...state.items, { ...item, cartId: crypto.randomUUID() }],
            isOpen: true,
          };
        });
      },
      removeItem: (cartId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartId !== cartId),
        })),
      updateQuantity: (cartId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartId === cartId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.priceEur * item.quantity, 0);
      },
    }),
    {
      name: 'fountainhead-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
