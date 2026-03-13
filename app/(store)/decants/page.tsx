import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import { Droplets } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fragrance Decants",
  description: "Try luxury fragrances in 2ml, 5ml, 10ml, and 15ml decants. Sample before you commit.",
};

export default async function DecantsPage() {
  const decants = await prisma.product.findMany({
    where: { type: "DECANT" },
    include: { brand: true, variants: true },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gray-900 text-white p-12 md:p-20 text-center mb-12">
        <Droplets size={40} className="text-gold-400 mx-auto mb-4" />
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Fragrance Decants</h1>
        <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-6" />
        <p className="text-gray-300 text-lg max-w-xl mx-auto mb-6">
          Sample the world's finest fragrances before committing to a full bottle.
          Available in 2ml, 5ml, 10ml, and 15ml sizes.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {["2ml", "5ml", "10ml", "15ml"].map((size) => (
            <span key={size} className="border border-gold-400 text-gold-400 px-4 py-1 text-sm">
              {size} available
            </span>
          ))}
        </div>
      </div>

      {decants.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No decants available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {decants.map((product) => (
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
      )}
    </div>
  );
}
