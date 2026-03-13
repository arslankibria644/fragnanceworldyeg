import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-serif text-2xl text-white mb-2">Join the Luxe Circle</h3>
          <p className="text-gray-400 text-sm mb-6">Subscribe for exclusive offers and new arrivals</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold-400 transition-colors"
            />
            <button type="submit" className="btn-gold whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h2 className="font-serif text-xl text-white mb-1 tracking-widest">LUXE SCENTS</h2>
              <p className="text-gold-400 text-[9px] tracking-[0.4em] uppercase mb-4">Premium Fragrances</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your destination for authentic luxury perfumes and exclusive decants. Every bottle tells a story.
              </p>
              <div className="flex space-x-3 mt-6">
                <a href="#" className="p-2 border border-gray-700 hover:border-gold-400 hover:text-gold-400 transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="#" className="p-2 border border-gray-700 hover:border-gold-400 hover:text-gold-400 transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="#" className="p-2 border border-gray-700 hover:border-gold-400 hover:text-gold-400 transition-colors">
                  <Twitter size={16} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-medium mb-4 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { href: "/shop", label: "Shop All" },
                  { href: "/decants", label: "Decants" },
                  { href: "/brands", label: "Brands" },
                  { href: "/categories", label: "Categories" },
                  { href: "/contact", label: "Contact Us" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-white font-medium mb-4 uppercase tracking-widest text-xs">Customer Service</h4>
              <ul className="space-y-2">
                {[
                  { href: "/dashboard", label: "My Account" },
                  { href: "/dashboard/orders", label: "Track Order" },
                  { href: "/wishlist", label: "Wishlist" },
                  { href: "/shipping-policy", label: "Shipping Policy" },
                  { href: "/return-policy", label: "Returns & Exchanges" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-medium mb-4 uppercase tracking-widest text-xs">Get In Touch</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                  <span>Lahore, Pakistan</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <Phone size={16} className="text-gold-400 flex-shrink-0" />
                  <a href="tel:+923001234567" className="hover:text-gold-400 transition-colors">+92 300 1234567</a>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <Mail size={16} className="text-gold-400 flex-shrink-0" />
                  <a href="mailto:info@luxescents.com" className="hover:text-gold-400 transition-colors">info@luxescents.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2024 Luxe Scents. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-gold-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gold-400 transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Secure payments:</span>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1">VISA</span>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1">MC</span>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1">STRIPE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
