import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

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
    <section className="py-16 bg-luxury-cream">
      <div className="px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold-500 text-xs uppercase tracking-[0.4em] mb-2">Just Arrived</p>
          <h2 className="section-title">New Arrivals</h2>
          <div className="gold-divider mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
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
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/shop?filter=new" className="btn-dark">Shop New Arrivals</Link>
        </div>
      </div>
    </section>
  );
}
