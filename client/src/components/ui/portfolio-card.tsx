import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PortfolioCardProps {
  item: {
    title: string;
    description: string;
    image: string;
    category: string;
    status: string;
  };
  index: number;
}

export default function PortfolioCard({ item, index }: PortfolioCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Typography":
        return "bg-secondary-kairo/20 text-secondary-kairo";
      case "UI Design":
        return "bg-primary-kairo/20 text-primary-kairo";
      case "Campaign":
        return "bg-secondary-kairo/20 text-secondary-kairo";
      default:
        return "bg-primary-kairo/20 text-primary-kairo";
    }
  };

  return (
    <motion.div
      className="service-card bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-3d hover:shadow-3d-hover overflow-hidden group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
    >
      <div className="relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getCategoryColor(item.category)}`}>
          {item.category}
        </span>
        <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
        <p className="text-slate-300 mb-4">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">{item.status}</span>
          <ArrowRight className="text-primary-kairo group-hover:translate-x-2 transition-transform" size={20} />
        </div>
      </div>
    </motion.div>
  );
}
