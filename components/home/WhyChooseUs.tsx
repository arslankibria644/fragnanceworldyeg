"use client";
import { Shield, Truck, Award, RefreshCw } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionElements";

const features = [
  { icon: Shield, title: "100% Authentic", description: "Sourced directly from authorized distributors worldwide", stat: "500+", statLabel: "Brands" },
  { icon: Truck, title: "Fast Delivery", description: "Free shipping on orders over PKR 5,000 across Pakistan", stat: "24hr", statLabel: "Dispatch" },
  { icon: Award, title: "Premium Quality", description: "Curated selection of the world's finest luxury fragrances", stat: "10K+", statLabel: "Happy Clients" },
  { icon: RefreshCw, title: "Easy Returns", description: "7-day hassle-free return policy on all products", stat: "100%", statLabel: "Satisfaction" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-luxury-cream border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8" staggerDelay={0.15}>
          {features.map(({ icon: Icon, title, description, stat, statLabel }) => (
            <StaggerItem key={title}>
              <div className="group flex flex-col items-center text-center p-6 bg-white border border-gray-100 hover:border-gold-400/30 hover:shadow-gold transition-all duration-500">
                <div className="w-14 h-14 flex items-center justify-center mb-4 bg-gold-50 rounded-full group-hover:bg-gold-100 transition-colors">
                  <Icon size={24} className="text-gold-500" />
                </div>
                <h4 className="text-gray-900 text-sm font-semibold mb-1 uppercase tracking-wider">{title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">{description}</p>
                <div className="border-t border-gray-100 pt-3 w-full">
                  <p className="text-gold-500 font-serif text-2xl font-bold">{stat}</p>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest">{statLabel}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
