"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Heart, Search, Menu, X, User, ChevronDown, Package, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      setTimeout(() => document.addEventListener("click", handleClick), 0);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [userMenuOpen]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-gold-400 text-center py-2.5 text-xs tracking-widest uppercase">
        Free shipping on orders over PKR 5,000 | Authentic Fragrances Guaranteed
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-500 ${
          scrolled ? "shadow-lg shadow-black/5" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
              <motion.div animate={{ rotate: mobileOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.div>
            </button>

            {/* Logo */}
            <Link href="/" className="flex flex-col items-center group">
              <motion.span
                whileHover={{ letterSpacing: "0.2em" }}
                transition={{ duration: 0.3 }}
                className="font-serif text-xl md:text-2xl font-bold text-gray-900 tracking-widest"
              >
                LUXE SCENTS
              </motion.span>
              <span className="text-gold-400 text-[8px] tracking-[0.4em] uppercase group-hover:text-gold-500 transition-colors">
                Premium Fragrances
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link relative group"
                >
                  {link.label}
                  {/* Active/hover underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-gold-400 transition-all duration-300 ${
                      pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:text-gold-500 transition-colors"
              >
                <Search size={20} />
              </motion.button>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href="/wishlist" className="p-2 hover:text-gold-500 transition-colors relative block">
                  <Heart size={20} />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-gold-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href="/cart" className="p-2 hover:text-gold-500 transition-colors relative block">
                  <ShoppingBag size={20} />
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-gold-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium"
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                  className="flex items-center space-x-1 p-2 hover:text-gold-500 transition-colors"
                >
                  <User size={20} />
                  {session && (
                    <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} />
                    </motion.div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white shadow-xl border border-gray-100 z-50 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {session ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                            <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                          </div>
                          <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gold-50 hover:text-gold-600 transition-colors">
                            <Package size={15} /> My Orders
                          </Link>
                          {(session.user as any)?.role === "ADMIN" && (
                            <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gold-50 hover:text-gold-600 transition-colors">
                              <Settings size={15} /> Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => { signOut(); setUserMenuOpen(false); }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                          >
                            <LogOut size={15} /> Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/login" onClick={() => setUserMenuOpen(false)} className="block px-4 py-3 text-sm hover:bg-gold-50 hover:text-gold-600 transition-colors font-medium">
                            Sign In
                          </Link>
                          <Link href="/register" onClick={() => setUserMenuOpen(false)} className="block px-4 py-3 text-sm hover:bg-gold-50 hover:text-gold-600 transition-colors border-t border-gray-50">
                            Create Account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3 px-2 nav-link text-sm ${pathname === link.href ? "text-gold-500 bg-gold-50" : ""}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
