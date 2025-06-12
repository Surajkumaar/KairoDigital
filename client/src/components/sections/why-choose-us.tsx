import { motion } from "framer-motion";
import { Lightbulb, Users, Settings, Handshake } from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Creative Excellence",
    description: "Award-winning creative solutions that capture attention and drive results."
  },
  {
    icon: Users,
    title: "Agile 6-Member Team",
    description: "Dedicated specialists working collaboratively on your success."
  },
  {
    icon: Settings,
    title: "No Templates",
    description: "Custom strategies tailored specifically for your brand and market."
  },
  {
    icon: Handshake,
    title: "Franchise-Friendly",
    description: "Commission-based growth plans that align our success with yours."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-highlight-blue">Why Choose Kairo Digital</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            What sets us apart in the digital marketing landscape
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                className="service-card bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-3d text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-kairo to-secondary-kairo rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="text-2xl text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
