import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  slug: string;
  viewedAt: number;
}

interface RecentlyViewedStore {
  products: RecentProduct[];
  addProduct: (product: Omit<RecentProduct, "viewedAt">) => void;
  clearHistory: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      products: [],

      addProduct: (product) => {
        set((state) => {
          const filtered = state.products.filter((p) => p.id !== product.id);
          const updated = [
            { ...product, viewedAt: Date.now() },
            ...filtered,
          ].slice(0, 8);
          return { products: updated };
        });
      },

      clearHistory: () => set({ products: [] }),
    }),
    {
      name: "luxe-scents-recently-viewed",
    }
  )
);
