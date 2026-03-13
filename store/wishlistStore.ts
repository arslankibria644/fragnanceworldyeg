import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) {
            return state;
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      toggleItem: (item) => {
        const isIn = get().isInWishlist(item.productId);
        if (isIn) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "luxe-scents-wishlist",
    }
  )
);
