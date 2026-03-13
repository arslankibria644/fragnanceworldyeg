"use client";
import { useState, useEffect } from "react";
import { Check, X, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetch(`/api/admin/reviews?status=${filter}`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved: true }) });
      if (res.ok) { setReviews((prev) => prev.filter((r) => r.id !== id)); toast.success("Review approved"); }
    } catch { toast.error("Error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) { setReviews((prev) => prev.filter((r) => r.id !== id)); toast.success("Review deleted"); }
    } catch { toast.error("Error"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <div className="flex gap-2">
          {["pending", "approved"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm capitalize transition-colors ${filter === f ? "bg-gold-400 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gold-400"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center p-8 text-gray-400">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg shadow text-gray-400">No {filter} reviews</div>
        ) : reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm text-gray-900">{review.user?.name || "Anonymous"}</p>
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} size={12} className={star <= review.rating ? "fill-gold-400 text-gold-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gold-500 mb-1">{review.product?.name}</p>
                {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
              </div>
              {filter === "pending" && (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleApprove(review.id)} className="p-2 bg-green-100 text-green-600 hover:bg-green-200 transition-colors rounded"><Check size={16} /></button>
                  <button onClick={() => handleDelete(review.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 transition-colors rounded"><X size={16} /></button>
                </div>
              )}
              {filter === "approved" && (
                <button onClick={() => handleDelete(review.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 transition-colors rounded flex-shrink-0"><X size={16} /></button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
