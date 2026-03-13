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

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-title">You May Also Like</h2>
          <div className="gold-divider mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
              isNew={product.isNewArrival}
              isBestSeller={product.isBestSeller}
              variants={product.variants}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
