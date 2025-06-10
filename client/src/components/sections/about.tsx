import { motion } from "framer-motion";
import TeamCard from "@/components/ui/team-card";

const teamMembers = [
  {
    name: "Alex Chen",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  },
  {
    name: "Sarah Johnson",
    role: "Growth Strategist",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  },
  {
    name: "Mike Rodriguez",
    role: "Analytics Lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  },
  {
    name: "Emma Wilson",
    role: "Content Lead",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  },
  {
    name: "David Park",
    role: "Social Media",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  },
  {
    name: "Lisa Kim",
    role: "Brand Designer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  },
];

const timelineItems = [
  {
    title: "Agency Founded",
    description: "Started with a vision to bridge creativity and conversion",
  },
  {
    title: "First 10 Clients",
    description: "Established our core methodology and service offerings",
  },
  {
    title: "Team Expansion",
    description: "Grew to a dedicated 6-member specialist team",
  },
  {
    title: "Award Recognition",
    description: "Recognized for creative excellence and client results",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">About Kairo Digital</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We're not just marketers — we're your growth partner.
          </p>
        </motion.div>

        {/* Team Members Grid */}
        <motion.div 
          className="grid md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {teamMembers.map((member, index) => (
            <TeamCard key={index} member={member} index={index} />
          ))}
        </motion.div>

        {/* Company Journey Timeline */}
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-kairo to-secondary-kairo"></div>
          <div className="space-y-12">
            {timelineItems.map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="service-card bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-3d max-w-md text-center">
                  <div className="w-4 h-4 bg-primary-kairo rounded-full mx-auto mb-4"></div>
                  <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                  <p className="text-slate-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
