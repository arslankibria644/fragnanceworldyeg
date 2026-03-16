"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";
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
    <Link href={`/products/${slug}`} className="group block">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
      >
        <div className="relative overflow-hidden bg-gray-50">
          <div className="aspect-[3/4] relative">
            <Image
              src={image || "/placeholder-perfume.jpg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-gold-400 text-white text-[10px] px-3 py-1 uppercase tracking-wider font-medium"
              >
                New
              </motion.span>
            )}
            {isBestSeller && (
              <span className="bg-gray-900 text-white text-[10px] px-3 py-1 uppercase tracking-wider font-medium">
                Best Seller
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-3 py-1 uppercase tracking-wider font-medium">
                -{discount}%
              </span>
            )}
          </div>

          {/* Action buttons - slide in from right on hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className="p-2.5 bg-white/95 backdrop-blur-sm shadow-md hover:bg-gold-400 hover:text-white transition-colors"
            >
              <Heart size={15} className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-700"} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 bg-white/95 backdrop-blur-sm shadow-md hover:bg-gold-400 hover:text-white transition-colors"
            >
              <Eye size={15} className="text-gray-700" />
            </motion.button>
          </div>

          {/* Quick Add - slide up on hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
            <button
              onClick={handleAddToCart}
              className="w-full bg-gray-900/95 backdrop-blur-sm text-white py-3.5 text-xs uppercase tracking-widest hover:bg-gold-400 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <ShoppingBag size={14} />
              Quick Add
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-[10px] text-gold-500 uppercase tracking-[0.3em] mb-1 font-medium">{brand}</p>
          <h3 className="font-serif text-sm font-medium text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-gold-600 transition-colors">{name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={11}
                className={star <= Math.round(rating) ? "fill-gold-400 text-gold-400" : "text-gray-200"}
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">({reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-sm">{formatPrice(discountedPrice)}</span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(basePrice)}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
