"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ShopContentProps {
  brands: { id: string; name: string; slug: string }[];
  categories: { id: string; name: string; slug: string }[];
  searchParams: any;
}

export default function ShopContent({ brands, categories, searchParams }: ShopContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState(searchParams.sort || "newest");

  const page = Number(searchParams.page) || 1;

  useEffect(() => {
    const params = new URLSearchParams(searchParams as any);
    params.set("sort", sort);
    setLoading(true);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      })
      .finally(() => setLoading(false));
  }, [searchParams, sort]);

  const handleSortChange = (value: string) => {
    setSort(value);
    const params = new URLSearchParams(searchParams as any);
    params.set("sort", value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams as any);
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex gap-8">
      {/* Filters Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <ShopFilters brands={brands} categories={categories} />
      </aside>

      {/* Mobile Filter Overlay */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
            </div>
            <ShopFilters brands={brands} categories={categories} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm hover:border-gold-400 transition-colors"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <p className="text-sm text-gray-500">{total} products found</p>
          </div>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gold-400 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 mb-3" />
                <div className="h-3 bg-gray-200 mb-2 rounded" />
                <div className="h-4 bg-gray-200 mb-2 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No fragrances found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 border border-gray-200 disabled:opacity-40 hover:border-gold-400 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 text-sm transition-colors ${page === pageNum ? "bg-gold-400 text-white" : "border border-gray-200 hover:border-gold-400"}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 border border-gray-200 disabled:opacity-40 hover:border-gold-400 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
