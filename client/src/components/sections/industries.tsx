import { motion } from "framer-motion";
import { Rocket, Store, Star, Building, Package } from "lucide-react";
import Particles from "../ui/particles";
import "../ui/particles.css";

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
    <section id="industries" className="py-20 relative min-h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/90 z-0" />
      <div className="absolute inset-0 z-[1]">
        <Particles
          particleColors={['#0066ff', '#4d94ff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
          particleHoverFactor={1}
          cameraDistance={25}
        />
      </div>
      <div className="container mx-auto px-6 text-center relative z-[2]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-500">Industries We Serve</h2>
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
                <div className="text-4xl mb-4 text-blue-500 group-hover:text-blue-400 transition-colors">
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
