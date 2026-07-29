"use client";
import { useState, useMemo } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { StaggerContainer, StaggerItem, AnimatedHeading } from "@/components/ui/MotionElements";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, SlidersHorizontal, Grid3X3, LayoutGrid, Search, X, Sparkles } from "lucide-react";

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

export default function DecantListing({ decants, brands }: { decants: Product[]; brands: string[] }) {
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const filtered = useMemo(() => {
    let items = [...decants];

    if (selectedBrand !== "All") {
      items = items.filter((d) => d.brand.name === selectedBrand);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (d) => d.name.toLowerCase().includes(q) || d.brand.name.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        items.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "name":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        items.sort((a, b) => b.averageRating - a.averageRating);
        break;
      default:
        break;
    }

    return items;
  }, [decants, selectedBrand, sortBy, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold-500 text-xs uppercase tracking-[0.4em] mb-2 flex items-center justify-center gap-2"
        >
          <Sparkles size={12} />
          {filtered.length} Decant{filtered.length !== 1 ? "s" : ""} Available
          <Sparkles size={12} />
        </motion.p>
      </div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-100 shadow-sm p-4 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search decants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-400 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="border border-gray-200 text-sm px-3 py-2.5 focus:outline-none focus:border-gold-400 bg-white transition-colors flex-1 md:flex-none"
            >
              <option value="All">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 text-sm px-3 py-2.5 focus:outline-none focus:border-gold-400 bg-white transition-colors flex-1 md:flex-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
              <option value="rating">Top Rated</option>
            </select>

            {/* Grid toggle - desktop only */}
            <div className="hidden md:flex items-center border border-gray-200">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2.5 transition-colors ${gridCols === 3 ? "bg-forest-800 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2.5 transition-colors ${gridCols === 4 ? "bg-forest-800 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {(selectedBrand !== "All" || searchQuery) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Active filters:</span>
            {selectedBrand !== "All" && (
              <button
                onClick={() => setSelectedBrand("All")}
                className="inline-flex items-center gap-1 text-xs bg-gold-50 text-gold-600 px-2.5 py-1 border border-gold-200 hover:bg-gold-100 transition-colors"
              >
                {selectedBrand} <X size={10} />
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-1 text-xs bg-gold-50 text-gold-600 px-2.5 py-1 border border-gold-200 hover:bg-gold-100 transition-colors"
              >
                &quot;{searchQuery}&quot; <X size={10} />
              </button>
            )}
            <button
              onClick={() => { setSelectedBrand("All"); setSearchQuery(""); setSortBy("newest"); }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-auto"
            >
              Clear all
            </button>
          </div>
        )}
      </motion.div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white border border-gray-100"
        >
          <Droplets size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium mb-1">No decants found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters or search query</p>
          <button
            onClick={() => { setSelectedBrand("All"); setSearchQuery(""); }}
            className="mt-4 text-sm text-gold-500 hover:text-gold-600 underline"
          >
            Reset filters
          </button>
        </motion.div>
      ) : (
        <StaggerContainer
          className={`grid grid-cols-2 md:grid-cols-3 ${gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 md:gap-6`}
          staggerDelay={0.06}
        >
          {filtered.map((product) => (
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
                isNew={product.isNewArrival}
                isBestSeller={product.isBestSeller}
                variants={product.variants}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Bottom info */}
      {filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-white border border-gray-100 px-8 py-4 shadow-sm">
            <div className="text-center">
              <p className="font-serif text-xl font-bold text-gray-900">{filtered.length}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Decants</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="font-serif text-xl font-bold text-gray-900">{brands.length}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Brands</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="font-serif text-xl font-bold text-gold-500">4</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Sizes</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
