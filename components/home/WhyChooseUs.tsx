import { Shield, Truck, Award, RefreshCw } from "lucide-react";

const features = [
  { icon: Shield, title: "100% Authentic", description: "All products are sourced directly from authorized distributors" },
  { icon: Truck, title: "Fast Delivery", description: "Free shipping on orders over PKR 5,000 across Pakistan" },
  { icon: Award, title: "Premium Quality", description: "Curated selection of the world's finest luxury fragrances" },
  { icon: RefreshCw, title: "Easy Returns", description: "7-day hassle-free return policy on all products" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 bg-black border-t border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center p-4">
              <div className="w-10 h-10 flex items-center justify-center mb-3">
                <Icon size={24} className="text-gold-400" />
              </div>
              <h4 className="text-white text-sm font-semibold mb-1 uppercase tracking-wider">{title}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
