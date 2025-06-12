import { motion } from "framer-motion";
import { Users, Target, Award, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "50+",
    label: "Brands Transformed",
    description: "Successful partnerships across industries"
  },
  {
    icon: TrendingUp,
    number: "300%",
    label: "Average Growth",
    description: "Increase in client conversions"
  },
  {
    icon: Target,
    number: "95%",
    label: "Client Retention",
    description: "Long-term strategic partnerships"
  },
  {
    icon: Award,
    number: "25+",
    label: "Awards Won",
    description: "Recognition for creative excellence"
  }
];

export default function About() {
  return (
    <section id="about" className="py-32 bg-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gray-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-600 border border-blue-500 rounded-full text-white text-sm font-medium tracking-wide uppercase">
              Our Story
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-white">We're Not Just</span>
            <span className="block text-highlight-blue">Marketers</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-16">
            We're your growth partner. A team of strategists, creatives, and data scientists who believe that the best marketing happens when creativity meets conversion.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="text-blue-500" size={32} />
                </div>
                <h3 className="text-4xl font-bold text-blue-500 mb-2">{stat.number}</h3>
                <h4 className="text-lg font-semibold text-white mb-1">{stat.label}</h4>
                <p className="text-sm text-slate-400">{stat.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          className="text-center bg-gradient-to-r from-slate-700/20 to-slate-600/20 backdrop-blur-sm border border-slate-600/30 rounded-3xl p-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <blockquote className="text-2xl md:text-3xl font-light text-slate-200 leading-relaxed mb-8">
            "We believe that great marketing isn't about shouting the loudest—it's about connecting the deepest. Every strategy we craft, every campaign we launch, is designed to build genuine relationships between brands and their audiences."
          </blockquote>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-kairo to-secondary-kairo rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <p className="text-white font-semibold">Kairo Digital Team</p>
              <p className="text-slate-400 text-sm">Founded 2020</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
