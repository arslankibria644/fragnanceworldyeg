"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star, Quote } from "lucide-react";

const reviews = [
  { id: 1, name: "Ayesha Khan", location: "Lahore", rating: 5, text: "Amazing quality! Got a decant of Baccarat Rouge 540 and it's absolutely identical to the original. Will definitely order again.", product: "Baccarat Rouge 540 Decant" },
  { id: 2, name: "Ahmed Malik", location: "Karachi", rating: 5, text: "Fast delivery and packaging was beautiful. The Dior Sauvage I ordered is 100% authentic. Luxe Scents is now my go-to for fragrances.", product: "Dior Sauvage 100ml" },
  { id: 3, name: "Sara Ahmed", location: "Islamabad", rating: 5, text: "Ordered three decants to test before buying full bottles. Such a smart concept! The fragrances are spot on and customer service is excellent.", product: "Multiple Decants" },
  { id: 4, name: "Usman Raza", location: "Faisalabad", rating: 4, text: "Great selection of niche fragrances that you won't find elsewhere in Pakistan. Packaging is premium and delivery was quick.", product: "Tom Ford Oud Wood" },
  { id: 5, name: "Fatima Zahra", location: "Lahore", rating: 5, text: "Absolutely love Luxe Scents! The quality is unmatched and prices are reasonable for luxury fragrances. Highly recommend!", product: "Chanel No. 5" },
];

export default function CustomerReviews() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold-400 text-xs uppercase tracking-[0.4em] mb-2">What Our Clients Say</p>
          <h2 className="section-title text-white">Customer Reviews</h2>
          <div className="gold-divider mx-auto" />
        </div>
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={24}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-gray-800 p-6 h-full">
                <Quote size={24} className="text-gold-400 mb-4 opacity-50" />
                <div className="flex mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} size={14} className={star <= review.rating ? "fill-gold-400 text-gold-400" : "text-gray-600"} />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{review.text}"</p>
                <p className="text-xs text-gold-400 mb-1">{review.product}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">{review.name}</p>
                    <p className="text-gray-500 text-xs">{review.location}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
