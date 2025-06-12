"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import RotatingText from "@/components/ui/rotating-text";
import "@/components/ui/rotating-text.css";


export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Enhanced Background with Grid Pattern */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(128,128,128,0.15)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        
        {/* Animated Grid overlay */}
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"
          animate={{ 
            backgroundPosition: ["0px 50px", "0px 0px"]
          }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <motion.div 
          className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full"
          animate={{ 
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-6 h-6 bg-gray-500/20 rounded-full"
          animate={{ 
            y: [0, -25, 0],
            x: [0, -10, 0],
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-32 left-1/3 w-2 h-2 bg-primary-kairo/40 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
        
        {/* Sparkle effects */}
        <motion.div 
          className="absolute top-1/4 left-1/4"
          animate={{ 
            rotate: [0, 360],
            scale: [0.5, 1, 0.5],
            opacity: [0, 0.3, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Sparkles className="text-white/30" size={16} />
        </motion.div>
        <motion.div 
          className="absolute top-1/3 right-1/3"
          animate={{ 
            rotate: [360, 0],
            scale: [0.3, 0.8, 0.3],
            opacity: [0, 0.4, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          <Sparkles className="text-gray-400/20" size={12} />
        </motion.div>
      </div>

      <motion.div 
        className="container mx-auto px-6 text-center relative z-10 max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Typography */}
        <motion.div className="mb-12">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 bg-primary-kairo/10 border border-primary-kairo/20 rounded-full text-primary-kairo text-sm font-medium tracking-wide uppercase">
          
            </span>
          </motion.div>
          
          <div className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-center space-y-8 flex flex-col items-center justify-center">
            <motion.div 
              className="block text-white text-center w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Where Creativity
            </motion.div>
            <motion.div className="block text-center w-full">
              <RotatingText
                texts={[
                  "Meets Strategy",
                  "Drives Growth",
                  "Creates Impact",
                  "Meets Success"
                ]}
                mainClassName="inline-flex px-4 sm:px-6 md:px-8 bg-white/10 text-white overflow-hidden py-2 sm:py-3 md:py-4 justify-center rounded-lg"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Subtext */}
        <motion.p 
          className="text-lg md:text-xl text-slate-300 mb-16 max-w-4xl mx-auto leading-relaxed text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          Transform your digital presence with strategic creativity. We're the growth partner that startups, creators, and local brands trust to drive meaningful results.
        </motion.p>

        {/* Motion buttons container */}
        <div className="flex flex-col items-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            {/* Get Your Quote Button */}
            <Button 
              onClick={() => scrollToSection('#contact')}
              className="group relative overflow-hidden bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              size="lg"
            >
              <span className="relative z-10 flex items-center">
                Get Your Quote
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
            onClick={() => scrollToSection('#about')}
          >
            <motion.div 
              className="flex flex-col items-center space-y-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-xs text-slate-500 uppercase tracking-wider">SCROLL</span>
              <ChevronDown className="text-slate-500" size={20} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}