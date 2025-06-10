import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  service: {
    icon: LucideIcon;
    title: string;
    description: string;
    features: string[];
  };
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const IconComponent = service.icon;

  return (
    <motion.div
      className="service-card bg-slate-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-3d hover:shadow-3d-hover group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl mb-6 text-primary-kairo group-hover:text-secondary-kairo transition-colors">
        <IconComponent size={48} />
      </div>
      <h3 className="text-xl font-semibold mb-4 text-white">{service.title}</h3>
      <p className="text-slate-300 mb-6">{service.description}</p>
      <div className="hidden group-hover:block space-y-2 text-sm text-slate-400">
        {service.features.map((feature, featureIndex) => (
          <p key={featureIndex}>• {feature}</p>
        ))}
      </div>
    </motion.div>
  );
}
