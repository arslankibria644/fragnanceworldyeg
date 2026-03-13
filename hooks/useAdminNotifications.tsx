"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

export function useAdminNotifications() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", {
      path: "/api/socket",
    });

    socket.on("connect", () => {
      socket.emit("join-admin");
    });

    socket.on("new-order", (order: any) => {
      // Play notification sound
      try {
        const audio = new Audio("/notification.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch {}

      toast.custom((t) => (
        <div
          className={`${t.visible ? "animate-slide-in" : "opacity-0"} max-w-sm bg-gray-900 text-white shadow-gold p-4 border-l-4 border-gold-400`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-semibold text-gold-400 text-sm">🛍 New Order!</p>
              <p className="text-white text-sm font-medium">{order.orderNumber}</p>
              <p className="text-gray-400 text-xs">{order.customerName} • PKR {order.total?.toLocaleString()}</p>
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="text-gray-400 hover:text-white">×</button>
          </div>
        </div>
      ), { duration: 8000, position: "top-right" });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
}
