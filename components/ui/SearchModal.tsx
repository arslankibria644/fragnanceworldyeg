"use client";
import { useState, useEffect, useRef } from "react";
import { X, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  brand: { name: string };
  images: string[];
  basePrice: number;
  discount: number;
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => setResults(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute top-0 left-0 right-0 bg-white p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border-b-2 border-gold-400 pb-2">
            <Search size={22} className="text-gold-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search fragrances, brands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-lg outline-none bg-transparent"
            />
            {loading && <Loader2 size={18} className="animate-spin text-gold-400" />}
            <button onClick={onClose} className="p-1 hover:text-gold-500 transition-colors">
              <X size={22} />
            </button>
          </div>

          {results.length > 0 && (
            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {results.map((product) => {
                const discountedPrice = product.basePrice - (product.basePrice * product.discount) / 100;
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-14 h-14 bg-gray-100 flex-shrink-0 overflow-hidden">
                      {product.images[0] && (
                        <Image src={product.images[0]} alt={product.name} width={56} height={56} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.brand.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gold-500">PKR {discountedPrice.toLocaleString()}</p>
                      {product.discount > 0 && (
                        <p className="text-xs text-gray-400 line-through">PKR {product.basePrice.toLocaleString()}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {query.length >= 2 && !loading && results.length === 0 && (
            <p className="mt-6 text-center text-gray-500 text-sm">No fragrances found for "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
