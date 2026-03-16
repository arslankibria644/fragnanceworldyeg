"use client";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { AnimatedHeading, StaggerContainer, StaggerItem } from "@/components/ui/MotionElements";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: { name: string };
  images: string[];
  basePrice: number;
  discount: number;
  averageRating: number;
  totalReviews: number;
  isNewArrival: boolean;
  isBestSeller: boolean;
  variants: { id: string; size: string; price: number; stock: number; sku: string }[];
}

export default function NewArrivals({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="py-20 bg-luxury-cream relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      <div className="px-4 max-w-7xl mx-auto">
        <AnimatedHeading subtitle="Just Arrived" title="New Arrivals" />

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" staggerDelay={0.1}>
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard
                id={product.id}
                slug={product.slug}
                name={product.name}
                brand={product.brand.name}
                image={product.images[0]}
                basePrice={product.basePrice}
                discount={product.discount}
                rating={product.averageRating}
                reviews={product.totalReviews}
                isNew
                isBestSeller={product.isBestSeller}
                variants={product.variants}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/shop?filter=new" className="group inline-flex items-center gap-2 btn-dark">
            <Sparkles size={14} />
            Shop New Arrivals
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
