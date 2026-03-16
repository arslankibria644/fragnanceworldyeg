import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import type { Metadata } from "next";
import DecantHero from "@/components/home/DecantHero";
import DecantListing from "@/components/decants/DecantListing";

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

  // Get unique brands from decants
  const brands = Array.from(new Set(decants.map((d) => d.brand.name))).sort();

  return (
    <div className="bg-luxury-cream min-h-screen">
      {/* Video Hero */}
      <DecantHero />

      {/* Listing */}
      <DecantListing decants={decants} brands={brands} />
    </div>
  );
}
