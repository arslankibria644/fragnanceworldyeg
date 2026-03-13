"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface ShopFiltersProps {
  brands: { id: string; name: string; slug: string }[];
  categories: { id: string; name: string; slug: string }[];
}

const genders = [
  { label: "Men's", value: "MENS" },
  { label: "Women's", value: "WOMENS" },
  { label: "Unisex", value: "UNISEX" },
];

const types = [
  { label: "Full Bottle", value: "FULL_BOTTLE" },
  { label: "Decant", value: "DECANT" },
];

const filterOptions = [
  { label: "New Arrivals", value: "new" },
  { label: "Best Sellers", value: "bestsellers" },
  { label: "Featured", value: "featured" },
];

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export default function ShopFilters({ brands, categories }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasFilters = searchParams.toString().length > 0;
  const currentBrand = searchParams.get("brand");
  const currentCategory = searchParams.get("category");
  const currentGender = searchParams.get("gender");
  const currentType = searchParams.get("type");
  const currentFilter = searchParams.get("filter");

  return (
    <div>
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-xs text-gold-500 mb-4 hover:text-gold-600 transition-colors uppercase tracking-wider"
        >
          <X size={12} /> Clear All Filters
        </button>
      )}

      <FilterSection title="Category">
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`block w-full text-left text-sm py-1 transition-colors ${
                currentCategory === cat.slug ? "text-gold-500 font-medium" : "text-gray-600 hover:text-gold-500"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brand">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => updateFilter("brand", brand.slug)}
              className={`block w-full text-left text-sm py-1 transition-colors ${
                currentBrand === brand.slug ? "text-gold-500 font-medium" : "text-gray-600 hover:text-gold-500"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Gender">
        <div className="space-y-2">
          {genders.map((g) => (
            <button
              key={g.value}
              onClick={() => updateFilter("gender", g.value)}
              className={`block w-full text-left text-sm py-1 transition-colors ${
                currentGender === g.value ? "text-gold-500 font-medium" : "text-gray-600 hover:text-gold-500"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Type">
        <div className="space-y-2">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => updateFilter("type", t.value)}
              className={`block w-full text-left text-sm py-1 transition-colors ${
                currentType === t.value ? "text-gold-500 font-medium" : "text-gray-600 hover:text-gold-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Special">
        <div className="space-y-2">
          {filterOptions.map((f) => (
            <button
              key={f.value}
              onClick={() => updateFilter("filter", f.value)}
              className={`block w-full text-left text-sm py-1 transition-colors ${
                currentFilter === f.value ? "text-gold-500 font-medium" : "text-gray-600 hover:text-gold-500"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
