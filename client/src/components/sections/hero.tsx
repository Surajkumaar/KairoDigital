import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative bg-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/80"></div>
      
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="floating-element absolute top-20 left-10 w-20 h-20 bg-primary-kairo/20 rounded-full blur-xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="floating-element absolute top-40 right-20 w-32 h-32 bg-secondary-kairo/20 rounded-full blur-xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="floating-element absolute bottom-20 left-1/4 w-16 h-16 bg-primary-kairo/30 rounded-full blur-lg"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      <motion.div 
        className="container mx-auto px-6 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 3D Animated Tagline */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block gradient-text">Where Creativity</span>
            <span className="block text-white">Meets Conversion</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-kairo to-secondary-kairo mx-auto mb-8"></div>
        </motion.div>

        {/* Subtext */}
        <motion.p 
          className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          A digital growth partner for startups, creators, and local brands
        </motion.p>

        {/* 3D CTA Buttons */}
        <motion.div 
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
          variants={itemVariants}
        >
          <Button 
            className="card-3d bg-primary-kairo hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-3d hover:shadow-3d-hover transition-all animate-pulse-glow"
            size="lg"
          >
            Let's Grow Together
          </Button>
          <Button 
            variant="outline"
            className="card-3d bg-transparent border-2 border-secondary-kairo text-secondary-kairo hover:bg-secondary-kairo hover:text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-3d hover:shadow-3d-hover transition-all"
            size="lg"
          >
            See Our Work
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="text-2xl text-slate-400" />
      </motion.div>
    </section>
  );
}
