"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("Order status updated!");
        router.refresh();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gold-400 bg-white"
      >
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <button
        onClick={handleUpdate}
        disabled={updating || status === currentStatus}
        className="btn-gold py-2 px-4 disabled:opacity-50 text-sm"
      >
        {updating ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
}
