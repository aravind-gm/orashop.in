import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  totalPrice: number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId);
          let newItems;
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            newItems = [...state.items, item];
          }
          const totalPrice = newItems.reduce((total, i) => total + i.price * i.quantity, 0);
          return { items: newItems, totalPrice };
        }),
      removeItem: (productId) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.productId !== productId);
          const totalPrice = newItems.reduce((total, item) => total + item.price * item.quantity, 0);
          return { items: newItems, totalPrice };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const newItems = state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );
          const totalPrice = newItems.reduce((total, item) => total + item.price * item.quantity, 0);
          return { items: newItems, totalPrice };
        }),
      clearCart: () => set({ items: [], totalPrice: 0 }),
      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'ora-cart',
    }
  )
);
