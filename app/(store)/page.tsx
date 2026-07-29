import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import DecantsSection from "@/components/home/DecantsSection";
import BestSellers from "@/components/home/BestSellers";
import BrandsShowcase from "@/components/home/BrandsShowcase";
import CustomerReviews from "@/components/home/CustomerReviews";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { prisma } from "@/lib/prisma";

// Reads live data from the DB — render per request instead of prerendering at build time.
export const dynamic = "force-dynamic";

async function getHomeData() {
  try {
    const [featuredProducts, newArrivals, bestSellers, brands, decants] = await Promise.all([
      prisma.product.findMany({
        where: { isFeatured: true },
        take: 8,
        include: { brand: true, variants: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isNewArrival: true },
        take: 8,
        include: { brand: true, variants: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isBestSeller: true },
        take: 8,
        include: { brand: true, variants: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.brand.findMany({
        where: { featured: true },
        take: 8,
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        where: { type: "DECANT" },
        take: 6,
        include: { brand: true, variants: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { featuredProducts, newArrivals, bestSellers, brands, decants };
  } catch {
    return { featuredProducts: [], newArrivals: [], bestSellers: [], brands: [], decants: [] };
  }
}

export default async function HomePage() {
  const data = await getHomeData();
  return (
    <>
      <HeroBanner />
      <WhyChooseUs />
      <FeaturedProducts products={data.featuredProducts} />
      <NewArrivals products={data.newArrivals} />
      <DecantsSection products={data.decants} />
      <BestSellers products={data.bestSellers} />
      <BrandsShowcase brands={data.brands} />
      <CustomerReviews />
    </>
  );
}
