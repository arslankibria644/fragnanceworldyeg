"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Award,
  Palette, Ticket, Star, BarChart2, ChevronLeft, ChevronRight, Image as ImageIcon, LogOut, Droplets
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/decants", label: "Decants", icon: Droplets },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/brands", label: "Brands", icon: Award },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/theme", label: "Theme", icon: Palette },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`bg-forest-900 text-forest-100 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex-shrink-0`}>
      {/* Logo */}
      <div className={`p-4 border-b border-forest-800 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div>
            <p className="font-serif text-white text-sm tracking-widest">FRAGRANCE WORLD YEG</p>
            <p className="text-gold-400 text-[9px] tracking-wider">Admin Panel</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-white transition-colors">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                active ? "bg-forest-800 text-gold-400 border-r-2 border-gold-400" : "hover:bg-forest-800 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-forest-800 p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={`flex items-center gap-3 text-sm text-gray-400 hover:text-red-400 transition-colors w-full ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
