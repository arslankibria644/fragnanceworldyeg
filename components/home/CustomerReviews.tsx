"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star, Quote } from "lucide-react";
import { AnimatedHeading, FadeUp } from "@/components/ui/MotionElements";
import { motion } from "framer-motion";

const reviews = [
  { id: 1, name: "Ayesha Khan", location: "Lahore", rating: 5, text: "Amazing quality! Got a decant of Baccarat Rouge 540 and it's absolutely identical to the original. Will definitely order again.", product: "Baccarat Rouge 540 Decant", initials: "AK" },
  { id: 2, name: "Ahmed Malik", location: "Karachi", rating: 5, text: "Fast delivery and packaging was beautiful. The Dior Sauvage I ordered is 100% authentic. Fragrance World YEG is now my go-to for fragrances.", product: "Dior Sauvage 100ml", initials: "AM" },
  { id: 3, name: "Sara Ahmed", location: "Islamabad", rating: 5, text: "Ordered three decants to test before buying full bottles. Such a smart concept! The fragrances are spot on and customer service is excellent.", product: "Multiple Decants", initials: "SA" },
  { id: 4, name: "Usman Raza", location: "Faisalabad", rating: 4, text: "Great selection of niche fragrances that you won't find elsewhere in Pakistan. Packaging is premium and delivery was quick.", product: "Tom Ford Oud Wood", initials: "UR" },
  { id: 5, name: "Fatima Zahra", location: "Lahore", rating: 5, text: "Absolutely love Fragrance World YEG! The quality is unmatched and prices are reasonable for luxury fragrances. Highly recommend!", product: "Chanel No. 5", initials: "FZ" },
];

export default function CustomerReviews() {
  return (
    <section className="py-20 bg-luxury-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 text-gold-400/[0.05] font-serif text-[200px] leading-none select-none">&ldquo;</div>
        <div className="absolute bottom-20 right-10 text-gold-400/[0.05] font-serif text-[200px] leading-none select-none rotate-180">&ldquo;</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <AnimatedHeading subtitle="What Our Clients Say" title="Customer Reviews" />

        <FadeUp delay={0.2}>
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={24}
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            className="pb-14"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white border border-gray-100 p-8 h-full hover:border-gold-400/30 hover:shadow-gold transition-all duration-500"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-serif font-bold text-sm">
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">{review.name}</p>
                      <p className="text-gray-400 text-xs">{review.location}</p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} size={14} className={star <= review.rating ? "fill-gold-400 text-gold-400" : "text-gray-200"} />
                    ))}
                  </div>

                  <Quote size={20} className="text-gold-400/20 mb-3" />
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{review.text}</p>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-gold-500 font-medium">{review.product}</p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </FadeUp>
      </div>
    </section>
  );
}
