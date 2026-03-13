"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  createdAt: string;
  user: { name: string | null; image: string | null };
}

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  rating: number;
  totalReviews: number;
}

export default function ReviewSection({ productId, reviews, rating, totalReviews }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [localReviews, setLocalReviews] = useState(reviews);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) { toast.error("Please write a review"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating: newRating, title, body }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to submit review"); return; }
      toast.success("Review submitted! It will appear after moderation.");
      setTitle(""); setBody(""); setNewRating(5);
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Rating Summary */}
      <div className="flex items-center gap-6 p-6 bg-gray-50 mb-8">
        <div className="text-center">
          <p className="font-serif text-5xl font-bold text-gray-900">{rating.toFixed(1)}</p>
          <div className="flex justify-center mt-1">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} size={14} className={star <= Math.round(rating) ? "fill-gold-400 text-gold-400" : "text-gray-300"} />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">{totalReviews} reviews</p>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6 mb-10">
        {localReviews.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          localReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6">
              <div className="flex items-start gap-3 mb-3">
                {review.user.image ? (
                  <Image src={review.user.image} alt={review.user.name || "User"} width={36} height={36} className="rounded-full" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-semibold text-sm">
                    {review.user.name?.[0] || "U"}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-gray-900">{review.user.name || "Anonymous"}</p>
                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex mt-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} size={12} className={star <= review.rating ? "fill-gold-400 text-gold-400" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
              </div>
              {review.title && <p className="font-medium text-sm text-gray-800 mb-1">{review.title}</p>}
              <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
            </div>
          ))
        )}
      </div>

      {/* Write Review Form */}
      {session ? (
        <div className="bg-gray-50 p-6">
          <h4 className="font-serif text-lg font-semibold mb-4">Write a Review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-600 mb-2 block">Your Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition-colors"
                  >
                    <Star size={24} className={(hoverRating || newRating) >= star ? "fill-gold-400 text-gold-400" : "text-gray-300"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="Review title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-luxury text-sm"
              />
            </div>
            <div>
              <textarea
                placeholder="Share your experience with this fragrance..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                required
                className="input-luxury text-sm resize-none"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-gold disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 text-center">
          <p className="text-gray-600 text-sm mb-3">Please sign in to write a review</p>
          <a href="/login" className="btn-gold inline-block">Sign In</a>
        </div>
      )}
    </div>
  );
}
