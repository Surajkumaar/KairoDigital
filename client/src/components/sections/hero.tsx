import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
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

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background with Grid Pattern */}
      <div className="absolute inset-0 bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,hsl(221,96%,53%,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,hsl(4,100%,67%,0.3)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,hsl(221,96%,53%,0.2)_0%,transparent_50%)]"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      {/* Floating 3D Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-2 h-32 bg-gradient-to-b from-primary-kairo/60 to-transparent"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-16 w-1 h-24 bg-gradient-to-b from-secondary-kairo/60 to-transparent"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-32 left-1/3 w-0.5 h-16 bg-gradient-to-b from-primary-kairo/40 to-transparent"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 2, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      <motion.div 
        className="container mx-auto px-6 text-center relative z-10 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Refined Typography */}
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-primary-kairo/10 border border-primary-kairo/20 rounded-full text-primary-kairo text-sm font-medium tracking-wide uppercase">
              Digital Marketing Agency
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tight">
            <span className="block text-white">Where</span>
            <span className="block gradient-text">Creativity</span>
            <span className="block text-white">Meets</span>
            <span className="block gradient-text">Conversion</span>
          </h1>
        </motion.div>

        {/* Enhanced Subtext */}
        <motion.p 
          className="text-xl md:text-2xl text-slate-300 mb-16 max-w-4xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Transform your digital presence with strategic creativity. We're the growth partner that startups, creators, and local brands trust to drive meaningful results.
        </motion.p>

        {/* Refined CTA Section */}
        <motion.div 
          className="flex flex-col md:flex-row gap-6 justify-center items-center mb-20"
          variants={itemVariants}
        >
          <Button 
            onClick={() => scrollToSection('#contact')}
            className="group relative overflow-hidden bg-primary-kairo hover:bg-blue-600 text-white px-8 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            size="lg"
          >
            <span className="relative z-10 flex items-center">
              Start Your Growth Journey
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Button>
          <Button 
            onClick={() => scrollToSection('#portfolio')}
            variant="outline"
            className="group bg-transparent border-2 border-slate-600 text-slate-300 hover:border-secondary-kairo hover:text-secondary-kairo px-8 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            <span className="flex items-center">
              View Our Work
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </span>
          </Button>
        </motion.div>

        {/* Scroll Indicator with refined animation */}
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => scrollToSection('#about')}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Scroll</span>
            <ChevronDown className="text-slate-400 hover:text-primary-kairo transition-colors" size={24} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
