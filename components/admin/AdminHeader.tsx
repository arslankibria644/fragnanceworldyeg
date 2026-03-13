"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Bell, ShoppingBag, Clock, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface RecentOrder {
  id: string;
  orderNumber: string;
  name: string;
  total: number;
  status: string;
  createdAt: string;
}

const POLL_INTERVAL = 30000; // 30 seconds
const STORAGE_KEY = "admin_notifications_last_seen";

function getLastSeenAt(): string {
  if (typeof window === "undefined") return new Date().toISOString();
  return localStorage.getItem(STORAGE_KEY) || new Date().toISOString();
}

function setLastSeenAt(date: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, date);
  }
}

export default function AdminHeader() {
  const [newCount, setNewCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const lastSeenAt = getLastSeenAt();
      const res = await fetch(`/api/admin/notifications?lastSeenAt=${encodeURIComponent(lastSeenAt)}`);
      if (!res.ok) return;
      const data = await res.json();

      // Play sound if new orders arrived since last poll
      if (data.newOrdersCount > previousCount && previousCount !== -1) {
        try {
          if (!audioRef.current) {
            audioRef.current = new Audio("/notification.mp3");
            audioRef.current.volume = 0.5;
          }
          audioRef.current.play().catch(() => {});
        } catch {}
      }

      setPreviousCount(data.newOrdersCount);
      setNewCount(data.newOrdersCount);
      setRecentOrders(data.recentOrders || []);
    } catch {}
  }, [previousCount]);

  useEffect(() => {
    // Initialize lastSeenAt if not set
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      setLastSeenAt(new Date().toISOString());
    }
    setPreviousCount(-1); // prevent sound on first load
    fetchNotifications();
  }, []);

  // Poll for new notifications
  useEffect(() => {
    const interval = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkAllRead = () => {
    setLastSeenAt(new Date().toISOString());
    setNewCount(0);
    setPreviousCount(0);
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h2 className="text-sm font-medium text-gray-500">Welcome back,</h2>
        <p className="font-serif text-lg font-semibold text-gray-900">Admin Dashboard</p>
      </div>

      <div className="flex items-center gap-4" ref={dropdownRef}>
        {/* Bell Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Bell size={22} className={newCount > 0 ? "text-gold-500" : "text-gray-500"} />
          {newCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 animate-pulse">
              {newCount > 99 ? "99+" : newCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-6 top-14 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-gold-500" />
                <span className="font-semibold text-sm text-gray-800">Order Notifications</span>
              </div>
              {newCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-gold-600 hover:text-gold-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Orders List */}
            <div className="max-h-[400px] overflow-y-auto">
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  No recent orders
                </div>
              ) : (
                recentOrders.map((order) => {
                  const isNew = new Date(order.createdAt) > new Date(getLastSeenAt());
                  return (
                    <Link
                      key={order.id}
                      href={`/admin/orders`}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${isNew ? "bg-gold-50/50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {isNew && (
                              <span className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0" />
                            )}
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {order.orderNumber}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{order.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={11} className="text-gray-400" />
                            <span className="text-[11px] text-gray-400">
                              {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-gold-600">{formatPrice(order.total)}</p>
                          <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded mt-1 ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <Link
              href="/admin/orders"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-center text-sm font-medium text-gold-600 hover:bg-gold-50 border-t border-gray-100 transition-colors"
            >
              <span className="inline-flex items-center gap-1">
                <Eye size={14} />
                View All Orders
              </span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
