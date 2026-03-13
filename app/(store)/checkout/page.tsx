"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Image from "next/image";
import { CreditCard, Truck, Lock, CheckCircle, PartyPopper, ShoppingBag } from "lucide-react";

const checkoutSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  notes: z.string().optional(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "STRIPE"]),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

function ConfettiPiece({ index }: { index: number }) {
  const colors = ["#d4af37", "#c9a227", "#f0d060", "#e8c84a", "#b8960f", "#fff3c4", "#fbbf24", "#f59e0b"];
  const color = colors[index % colors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 3;
  const duration = 2.5 + Math.random() * 2;
  const size = 6 + Math.random() * 8;
  const rotation = Math.random() * 360;

  return (
    <div
      className="absolute top-0 opacity-0"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size * 0.4}px`,
        backgroundColor: color,
        borderRadius: "2px",
        transform: `rotate(${rotation}deg)`,
        animation: `confetti-fall ${duration}s ease-in ${delay}s forwards`,
      }}
    />
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getSubtotal, getTotal, couponCode, couponDiscount, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState("");
  const orderPlacedRef = useRef(false);

  const subtotal = getSubtotal();
  const discount = couponDiscount;
  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = getTotal() + shipping;

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema) as any,
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      paymentMethod: "CASH_ON_DELIVERY",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: CheckoutForm) => {
    if (!session) { router.push("/login?redirect=/checkout"); return; }
    if (items.length === 0) { toast.error("Cart is empty"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
            name: i.name,
            image: i.image,
            size: i.size,
          })),
          subtotal,
          discount,
          shipping,
          total,
          couponCode,
        }),
      });
      const result = await res.json();
      if (!res.ok) { toast.error(result.error || "Order failed"); return; }

      // Mark order as placed before clearing cart
      orderPlacedRef.current = true;
      setCompletedOrderNumber(result.orderNumber);
      setOrderSuccess(true);
      clearCart();

    } catch {
      toast.error("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  // Only redirect to cart if items are empty AND order was not just placed
  if (items.length === 0 && !orderPlacedRef.current && !orderSuccess) {
    router.push("/cart");
    return null;
  }

  // Show success/congratulations overlay
  if (orderSuccess) {
    return (
      <>
        <style jsx global>{`
          @keyframes confetti-fall {
            0% { opacity: 1; transform: translateY(-10px) rotate(0deg) scale(1); }
            100% { opacity: 0; transform: translateY(100vh) rotate(720deg) scale(0.3); }
          }
          @keyframes bounce-in {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes slide-up {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulse-gold {
            0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
            50% { box-shadow: 0 0 0 20px rgba(212, 175, 55, 0); }
          }
        `}</style>

        {/* Confetti */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {Array.from({ length: 60 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>

        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="max-w-lg w-full text-center">
            {/* Success Icon */}
            <div
              className="relative mx-auto mb-8 w-fit"
              style={{ animation: "bounce-in 0.6s ease-out forwards" }}
            >
              <div
                className="w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto"
                style={{ animation: "pulse-gold 2s ease-in-out infinite" }}
              >
                <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-2 -right-2" style={{ animation: "bounce-in 0.8s ease-out 0.3s both" }}>
                <PartyPopper size={28} className="text-gold-500" />
              </div>
            </div>

            {/* Congratulations Text */}
            <div style={{ animation: "slide-up 0.5s ease-out 0.3s both" }}>
              <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">
                Congratulations!
              </h1>
              <p className="text-lg text-gold-600 font-medium mb-4">Your order has been placed successfully!</p>
              <p className="text-gray-500 mb-6">
                Thank you for shopping with <span className="font-serif font-semibold text-gray-700">Luxe Scents</span>.
                We&apos;re preparing your fragrance with care.
              </p>
            </div>

            {/* Order Number Card */}
            <div
              className="bg-white border-2 border-gold-200 rounded-lg p-6 mb-6 shadow-sm"
              style={{ animation: "slide-up 0.5s ease-out 0.5s both" }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <ShoppingBag size={20} className="text-gold-500" />
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Order Number</p>
              </div>
              <p className="text-2xl font-bold text-gold-500 tracking-wide">{completedOrderNumber}</p>
            </div>

            {/* Info */}
            <p className="text-sm text-gray-400 mb-6" style={{ animation: "slide-up 0.5s ease-out 0.7s both" }}>
              Order confirmation has been sent to your email.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center" style={{ animation: "slide-up 0.5s ease-out 0.9s both" }}>
              <button
                onClick={() => router.push("/dashboard/orders")}
                className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-3"
              >
                <ShoppingBag size={16} />
                Track Order
              </button>
              <button
                onClick={() => router.push("/shop")}
                className="btn-outline-gold inline-flex items-center justify-center gap-2 px-8 py-3"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Full Name *</label>
                <input {...register("name")} className="input-luxury" placeholder="Your full name" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Phone *</label>
                <input {...register("phone")} className="input-luxury" placeholder="+92 300 0000000" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Email *</label>
                <input {...register("email")} type="email" className="input-luxury" placeholder="your@email.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Address *</label>
                <input {...register("address")} className="input-luxury" placeholder="Street address, house/flat number" />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">City *</label>
                <input {...register("city")} className="input-luxury" placeholder="City" />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Order Notes (Optional)</label>
                <textarea {...register("notes")} rows={3} className="input-luxury resize-none" placeholder="Any special instructions..." />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-colors ${paymentMethod === "CASH_ON_DELIVERY" ? "border-gold-400 bg-gold-50" : "border-gray-200 hover:border-gray-300"}`}>
                <input type="radio" value="CASH_ON_DELIVERY" {...register("paymentMethod")} className="text-gold-500" />
                <Truck size={20} className="text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when your order arrives</p>
                </div>
              </label>
              <label className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-colors ${paymentMethod === "STRIPE" ? "border-gold-400 bg-gold-50" : "border-gray-200 hover:border-gray-300"}`}>
                <input type="radio" value="STRIPE" {...register("paymentMethod")} className="text-gold-500" />
                <CreditCard size={20} className="text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Credit/Debit Card (Stripe)</p>
                  <p className="text-xs text-gray-500">Secure payment via Stripe</p>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full btn-gold flex items-center justify-center gap-2 py-4 disabled:opacity-50">
            <Lock size={16} />
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 p-4 shadow-sm">
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="w-12 h-14 relative flex-shrink-0 bg-gray-50">
                    <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-800">{item.name}</p>
                    <p className="text-[10px] text-gray-500">{item.size}</p>
                    <p className="text-xs font-semibold text-gold-500">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-gold-500">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
