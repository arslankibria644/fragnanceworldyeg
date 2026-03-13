"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "The Art of Fragrance",
    subtitle: "Discover Luxury Perfumes",
    description: "Explore our curated collection of the world's finest fragrances",
    cta: "Shop Now",
    ctaLink: "/shop",
    bg: "from-gray-900 via-gray-800 to-black",
    accent: "Dior • Chanel • Tom Ford",
  },
  {
    id: 2,
    title: "Exclusive Decants",
    subtitle: "Try Before You Commit",
    description: "Sample luxury fragrances in 2ml, 5ml, 10ml, and 15ml sizes",
    cta: "Explore Decants",
    ctaLink: "/decants",
    bg: "from-yellow-950 via-amber-950 to-black",
    accent: "Starting from PKR 500",
  },
  {
    id: 3,
    title: "New Arrivals",
    subtitle: "Fresh From The Maison",
    description: "The latest additions to our luxury fragrance collection",
    cta: "View New Arrivals",
    ctaLink: "/shop?filter=new",
    bg: "from-zinc-900 via-neutral-900 to-black",
    accent: "Limited Edition",
  },
];

export default function HeroBanner() {
  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-[60vh] md:h-[80vh] lg:h-screen max-h-[800px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative h-full bg-gradient-to-r ${slide.bg} flex items-center justify-center`}>
              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gold-400/10 rounded-full blur-2xl" />
              </div>

              <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
                <p className="text-gold-400 text-xs uppercase tracking-[0.5em] mb-4">{slide.accent}</p>
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-4">
                  {slide.title}
                </h1>
                <h2 className="font-serif text-xl md:text-2xl text-gold-300 mb-6 italic">{slide.subtitle}</h2>
                <p className="text-gray-300 text-sm md:text-base mb-8 max-w-md mx-auto">{slide.description}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={slide.ctaLink} className="btn-gold">
                    {slide.cta}
                  </Link>
                  <Link href="/decants" className="btn-outline-gold border-white text-white hover:bg-white hover:text-black">
                    Try Decants
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
