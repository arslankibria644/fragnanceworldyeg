import Link from "next/link";
import Image from "next/image";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

export default function BrandsShowcase({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null;
  return (
    <section className="py-16 bg-luxury-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold-500 text-xs uppercase tracking-[0.4em] mb-2">Our Partners</p>
          <h2 className="section-title">Luxury Brands</h2>
          <div className="gold-divider mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="flex flex-col items-center p-4 bg-white hover:shadow-gold transition-all duration-300 group"
            >
              {brand.logo ? (
                <Image src={brand.logo} alt={brand.name} width={80} height={40} className="object-contain h-10 grayscale group-hover:grayscale-0 transition-all" />
              ) : (
                <span className="font-serif text-sm font-bold text-gray-700 group-hover:text-gold-500 transition-colors text-center">{brand.name}</span>
              )}
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/brands" className="btn-outline-gold">View All Brands</Link>
        </div>
      </div>
    </section>
  );
}
