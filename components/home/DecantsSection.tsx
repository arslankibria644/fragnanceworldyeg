import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { Droplets } from "lucide-react";

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

export default function DecantsSection({ products }: { products: Product[] }) {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Droplets className="text-gold-400 mx-auto mb-4" size={32} />
          <p className="text-gold-400 text-xs uppercase tracking-[0.4em] mb-2">Try Before You Buy</p>
          <h2 className="section-title text-white">Fragrance Decants</h2>
          <div className="gold-divider mx-auto" />
          <p className="text-gray-400 mt-4 text-sm max-w-lg mx-auto">
            Sample luxury fragrances in small quantities. Available in 2ml, 5ml, 10ml, and 15ml sizes.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800">
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
                isNew={product.isNewArrival}
                isBestSeller={product.isBestSeller}
                variants={product.variants}
              />
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/decants" className="btn-gold">Explore All Decants</Link>
        </div>
      </div>
    </section>
  );
}
