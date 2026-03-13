"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Heart size={64} className="text-gray-200 mx-auto mb-6" />
        <h1 className="font-serif text-3xl text-gray-900 mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-500 mb-8">Save your favorite fragrances to your wishlist.</p>
        <Link href="/shop" className="btn-gold">Discover Fragrances</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <div key={item.productId} className="bg-white border border-gray-100 shadow-sm group relative">
            <button
              onClick={() => { removeItem(item.productId); toast.success("Removed from wishlist"); }}
              className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 hover:bg-white shadow-sm hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
            <Link href={`/products/${item.slug}`}>
              <div className="aspect-[3/4] relative bg-gray-50 overflow-hidden">
                <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            </Link>
            <div className="p-3">
              <Link href={`/products/${item.slug}`}>
                <p className="font-serif text-sm font-medium text-gray-900 hover:text-gold-500 transition-colors">{item.name}</p>
                <p className="text-xs text-gray-400 mb-2">{item.brand}</p>
                <p className="font-semibold text-gray-900 mb-3">{formatPrice(item.price)}</p>
              </Link>
              <Link href={`/products/${item.slug}`} className="w-full btn-dark flex items-center justify-center gap-2 py-2 text-xs">
                <ShoppingBag size={14} /> View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
