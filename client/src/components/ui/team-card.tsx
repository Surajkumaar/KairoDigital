import { motion } from "framer-motion";

interface TeamCardProps {
  member: {
    name: string;
    role: string;
    image: string;
  };
  index: number;
}

export default function TeamCard({ member, index }: TeamCardProps) {
  return (
    <motion.div
      className="service-card bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-3d text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
    >
      <img 
        src={member.image} 
        alt={member.name} 
        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
      />
      <h4 className="font-semibold text-white mb-2">{member.name}</h4>
      <p className="text-sm text-slate-400">{member.role}</p>
    </motion.div>
  );
}
