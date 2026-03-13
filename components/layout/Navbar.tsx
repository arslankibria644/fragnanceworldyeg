"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Heart, Search, Menu, X, User, ChevronDown, Package, LogOut, Settings } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import SearchModal from "@/components/ui/SearchModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/decants", label: "Decants" },
  { href: "/brands", label: "Brands" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-gold-400 text-center py-2 text-xs tracking-widest uppercase">
        Free shipping on orders over PKR 5,000 | Authentic Fragrances Guaranteed
      </div>

      {/* Main Navbar */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-luxury" : "shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex flex-col items-center">
              <span className="font-serif text-xl md:text-2xl font-bold text-gray-900 tracking-widest">LUXE SCENTS</span>
              <span className="text-gold-400 text-[8px] tracking-[0.4em] uppercase">Premium Fragrances</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? "text-gold-500" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button onClick={() => setSearchOpen(true)} className="p-2 hover:text-gold-500 transition-colors">
                <Search size={20} />
              </button>

              <Link href="/wishlist" className="p-2 hover:text-gold-500 transition-colors relative">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="p-2 hover:text-gold-500 transition-colors relative">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-1 p-2 hover:text-gold-500 transition-colors"
                >
                  <User size={20} />
                  {session && <ChevronDown size={14} />}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-luxury border border-gray-100 z-50">
                    {session ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                        </div>
                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-gold-500 transition-colors">
                          <Package size={14} /> My Orders
                        </Link>
                        {(session.user as any)?.role === "ADMIN" && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-gold-500 transition-colors">
                            <Settings size={14} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-gold-500 transition-colors">Sign In</Link>
                        <Link href="/register" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-gold-500 transition-colors">Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block nav-link py-2 ${pathname === link.href ? "text-gold-500" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
