"use client";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowRight, Heart } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/MotionElements";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-forest-100">
      {/* Newsletter */}
      <div className="bg-luxury-darker py-16 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-400 rounded-full blur-[200px]"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeUp>
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-3">Join the Fragrance Circle</h3>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">Subscribe for exclusive offers, new arrivals, and fragrance tips from our experts</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/5 border border-white/10 text-white px-5 py-4 text-sm focus:outline-none focus:border-gold-400 transition-all duration-300 placeholder:text-gray-500 hover:border-white/20"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-gold whitespace-nowrap inline-flex items-center gap-2 justify-center"
              >
                Subscribe
                <ArrowRight size={14} />
              </motion.button>
            </form>
          </FadeUp>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10" staggerDelay={0.1}>
            {/* Brand */}
            <StaggerItem>
              <div>
                <h2 className="font-serif text-2xl text-white mb-1 tracking-widest">FRAGRANCE WORLD</h2>
                <p className="text-gold-400 text-[9px] tracking-[0.4em] uppercase mb-5">YEG &middot; Premium Fragrances</p>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Your destination for authentic luxury perfumes and exclusive decants. Every bottle tells a story.
                </p>
                <div className="flex space-x-3">
                  {[Instagram, Facebook, Twitter].map((Icon, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 border border-forest-700 hover:border-gold-400 hover:text-gold-400 hover:bg-gold-400/10 transition-all duration-300"
                    >
                      <Icon size={16} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </StaggerItem>

            {/* Quick Links */}
            <StaggerItem>
              <div>
                <h4 className="text-white font-medium mb-5 uppercase tracking-widest text-xs">Quick Links</h4>
                <ul className="space-y-3">
                  {[
                    { href: "/shop", label: "Shop All" },
                    { href: "/decants", label: "Decants" },
                    { href: "/brands", label: "Brands" },
                    { href: "/categories", label: "Categories" },
                    { href: "/contact", label: "Contact Us" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="group text-sm text-gray-400 hover:text-gold-400 transition-colors inline-flex items-center gap-2">
                        <span className="w-0 group-hover:w-3 h-[1px] bg-gold-400 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>

            {/* Customer Service */}
            <StaggerItem>
              <div>
                <h4 className="text-white font-medium mb-5 uppercase tracking-widest text-xs">Customer Service</h4>
                <ul className="space-y-3">
                  {[
                    { href: "/dashboard", label: "My Account" },
                    { href: "/dashboard/orders", label: "Track Order" },
                    { href: "/wishlist", label: "Wishlist" },
                    { href: "/shipping-policy", label: "Shipping Policy" },
                    { href: "/return-policy", label: "Returns & Exchanges" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="group text-sm text-gray-400 hover:text-gold-400 transition-colors inline-flex items-center gap-2">
                        <span className="w-0 group-hover:w-3 h-[1px] bg-gold-400 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>

            {/* Contact */}
            <StaggerItem>
              <div>
                <h4 className="text-white font-medium mb-5 uppercase tracking-widest text-xs">Get In Touch</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm text-gray-400 group">
                    <MapPin size={16} className="text-gold-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span>Lahore, Pakistan</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-400 group">
                    <Phone size={16} className="text-gold-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <a href="tel:+923001234567" className="hover:text-gold-400 transition-colors">+92 300 1234567</a>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-400 group">
                    <Mail size={16} className="text-gold-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <a href="mailto:info@luxescents.com" className="hover:text-gold-400 transition-colors">info@luxescents.com</a>
                  </li>
                </ul>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-forest-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart size={10} className="text-gold-400 fill-gold-400" /> by Fragrance World YEG &copy; 2024
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-gold-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gold-400 transition-colors">Terms</Link>
          </div>
          <div className="flex items-center gap-2">
            {["VISA", "MC", "STRIPE"].map((name) => (
              <span key={name} className="text-[10px] text-gray-500 bg-forest-800/40 border border-forest-700/50 px-3 py-1.5 font-medium tracking-wider">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
