"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  basePrice: number;
  discount: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  variants?: { id: string; size: string; price: number; stock: number; sku: string }[];
}

export default function ProductCard({
  id, slug, name, brand, image, basePrice, discount, rating, reviews,
  isNew, isBestSeller, variants = [],
}: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const inWishlist = isInWishlist(id);

  const discountedPrice = calculateDiscountedPrice(basePrice, discount);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({ productId: id, name, brand, image, price: discountedPrice, slug });
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const firstVariant = variants[0];
    if (!firstVariant) {
      toast.error("Please select a variant");
      return;
    }
    if (firstVariant.stock === 0) {
      toast.error("Out of stock");
      return;
    }
    addItem({
      id: `${id}-${firstVariant.id}`,
      productId: id,
      variantId: firstVariant.id,
      name,
      brand,
      image,
      size: firstVariant.size,
      price: firstVariant.price,
      quantity: 1,
      stock: firstVariant.stock,
    });
    toast.success("Added to cart!");
  };

  return (
    <Link href={`/products/${slug}`} className="product-card block">
      <div className="relative overflow-hidden bg-gray-50">
        <div className="aspect-[3/4] relative">
          <Image
            src={image || "/placeholder-perfume.jpg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && <span className="badge-gold text-[10px]">New</span>}
          {isBestSeller && <span className="badge-dark text-[10px]">Best Seller</span>}
          {discount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 uppercase tracking-wider">-{discount}%</span>}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
        >
          <Heart size={16} className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"} />
        </button>

        {/* Quick Add - visible on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-gray-900/95 text-white py-3 text-xs uppercase tracking-widest hover:bg-gold-400 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} />
            Quick Add
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[10px] text-gold-500 uppercase tracking-widest mb-1">{brand}</p>
        <h3 className="font-serif text-sm font-medium text-gray-900 mb-2 leading-tight">{name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={11}
              className={star <= Math.round(rating) ? "fill-gold-400 text-gold-400" : "text-gray-300"}
            />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{formatPrice(discountedPrice)}</span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(basePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
