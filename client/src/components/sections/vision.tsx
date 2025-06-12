import { motion } from "framer-motion";
import { TrendingUp, Brush, BookOpen } from "lucide-react";

const visionItems = [
  {
    icon: TrendingUp,
    title: "Strategy",
    description: "Data-driven approaches that identify opportunities and maximize growth potential.",
    color: "text-blue-500"
  },
  {
    icon: Brush,
    title: "Design",
    description: "Beautiful, functional designs that capture attention and enhance user experience.",
    color: "text-blue-500"
  },
  {
    icon: BookOpen,
    title: "Storytelling",
    description: "Compelling narratives that connect brands with their audience on an emotional level.",
    color: "text-blue-500"
  }
];

export default function Vision() {
  return (
    <section className="py-20 bg-slate-900/50 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-highlight-blue">Our Vision</h2>
          <blockquote className="text-2xl md:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            "We mix strategy, design, and storytelling to help brands grow organically."
          </blockquote>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {visionItems.map((item, index) => {
            const IconComponent = item.icon;
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
                <div className={`text-5xl mb-6 ${item.color}`}>
                  <IconComponent className="mx-auto" size={64} />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{item.title}</h3>
                <p className="text-slate-300">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
