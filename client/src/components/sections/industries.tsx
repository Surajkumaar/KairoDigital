import { motion } from "framer-motion";
import { Rocket, Store, Star, Building, Package } from "lucide-react";

const industries = [
  {
    icon: Rocket,
    name: "Startups",
  },
  {
    icon: Store,
    name: "Local Businesses",
  },
  {
    icon: Star,
    name: "Influencers & Creators",
  },
  {
    icon: Building,
    name: "Franchise Brands",
  },
  {
    icon: Package,
    name: "Product Companies",
  },
];

export default function Industries() {
  return (
    <section id="industries" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Industries We Serve</h2>
          <p className="text-xl text-slate-300 mb-16 max-w-3xl mx-auto">
            Specialized expertise across diverse market sectors
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {industries.map((industry, index) => {
            const IconComponent = industry.icon;
            return (
              <motion.div
                key={index}
                className="service-card bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-3d hover:shadow-3d-hover group cursor-pointer text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4 text-primary-kairo group-hover:text-secondary-kairo transition-colors">
                  <IconComponent className="mx-auto" size={48} />
                </div>
                <h4 className="font-semibold text-white">{industry.name}</h4>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
