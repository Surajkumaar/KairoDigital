import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const animatedWords = ["Creativity", "Innovation", "Strategy", "Growth"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % animatedWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.8,
      rotateX: -90
    },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: i * 0.05,
        ease: [0.23, 1, 0.32, 1],
      },
    }),
  };

  const wordChangeVariants = {
    initial: { y: 20, opacity: 0, scale: 0.8 },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: -20, opacity: 0, scale: 0.8 }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.section 
      id="hero" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Enhanced Background with Grid Pattern */}
      <div className="absolute inset-0 bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,hsl(221,96%,53%,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,hsl(4,100%,67%,0.3)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,hsl(221,96%,53%,0.2)_0%,transparent_50%)]"></div>
        
        {/* Animated Grid overlay */}
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"
          animate={{ 
            backgroundPosition: ["0px 0px", "50px 50px", "0px 0px"]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <motion.div 
          className="absolute top-20 left-10 w-4 h-4 bg-primary-kairo/30 rounded-full"
          animate={{ 
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-6 h-6 bg-secondary-kairo/20 rounded-full"
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
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Sparkles className="text-primary-kairo/30" size={16} />
        </motion.div>
        <motion.div 
          className="absolute top-1/3 right-1/3"
          animate={{ 
            rotate: [360, 0],
            scale: [0.3, 0.8, 0.3],
            opacity: [0, 0.8, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          <Sparkles className="text-secondary-kairo/20" size={12} />
        </motion.div>
      </div>

      <motion.div 
        className="container mx-auto px-6 text-center relative z-10 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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
              Digital Marketing Agency
            </span>
          </motion.div>
          
          <div className="text-6xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tight">
            {/* Animated "Where" */}
            <motion.div className="block text-white mb-2">
              {"Where".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
            
            {/* Rotating animated word */}
            <div className="block gradient-text mb-2 h-[1.2em] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={animatedWords[currentWordIndex]}
                  variants={wordChangeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="block"
                >
                  {animatedWords[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            
            {/* Animated "Meets" */}
            <motion.div className="block text-white mb-2">
              {"Meets".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i + 5}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
            
            {/* Animated "Conversion" */}
            <motion.div className="block gradient-text">
              {"Conversion".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i + 10}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Subtext */}
        <motion.p 
          className="text-xl md:text-2xl text-slate-300 mb-16 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          Transform your digital presence with strategic creativity. We're the growth partner that startups, creators, and local brands trust to drive meaningful results.
        </motion.p>

        {/* Enhanced CTA Section */}
        <motion.div 
          className="flex flex-col md:flex-row gap-6 justify-center items-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
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

        {/* Enhanced Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer"
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
            <span className="text-xs text-slate-500 uppercase tracking-wider">Scroll</span>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <ChevronDown className="text-slate-400 hover:text-primary-kairo transition-colors" size={24} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}