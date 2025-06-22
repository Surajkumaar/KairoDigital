import { motion } from "framer-motion";
import { 
  Instagram, 
  Palette, 
  PenTool, 
  TrendingUp, 
  Lightbulb, 
  Rocket,
  ArrowRight
} from "lucide-react";

const services = [
  {
    icon: Instagram,
    title: "Social Media Marketing",
    description: "Strategic social media campaigns that engage your audience and drive meaningful conversions.",
    features: [
      "Platform-specific content strategy",
      "Community management",
      "Paid social advertising",
      "Performance analytics"
    ],
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-500"
  },
  {
    icon: Palette,
    title: "Branding & Visual Identity",
    description: "Distinctive brand identities that resonate with your target audience and stand out in the market.",
    features: [
      "Logo & brand mark design",
      "Brand guideline development",
      "Visual asset creation",
      "Brand positioning strategy"
    ],
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-500"
  },
  {
    icon: PenTool,
    title: "Content Creation",
    description: "Compelling content that tells your brand story and drives customer action across all channels.",
    features: [
      "Video post production",
      "Video content production",
      "Graphic design assets",
      "Content calendar planning"
    ],
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-500"
  },
  {
    icon: TrendingUp,
    title: "Growth Strategy & Analytics",
    description: "Data-driven strategies that optimize your marketing efforts and maximize ROI.",
    features: [
      "Performance tracking",
      "Conversion optimization",
      "Market research & analysis",
      "Growth planning & forecasting"
    ],
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-500"
  },
  {
    icon: Lightbulb,
    title: "Marketing Consultation",
    description: "Strategic guidance and expert advice to accelerate your marketing success.",
    features: [
      "Marketing audits & assessments",
      "Strategic planning sessions",
      "Campaign optimization",
      "Micro influencer support"
    ],
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-500"
  },
  {
    icon: Rocket,
    title: "Digital Transformation",
    description: "Complete digital overhauls that modernize your brand presence and customer experience.",
    features: [
      "Website design & development",
      "E-commerce solutions",
      "Digital automation",
      "Technology integration"
    ],
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-500"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-32 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl"></div>
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
              What We Do
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-white">Full-Stack</span>
            <span className="block text-highlight-blue">Digital Solutions</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            From strategy to execution, we deliver comprehensive digital marketing solutions that drive real business growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 h-full hover:border-slate-600/50 transition-all duration-500 transform group-hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 bg-slate-700/50 rounded-2xl flex items-center justify-center ${service.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent size={28} />
                    </div>
                    <ArrowRight className="text-slate-500 group-hover:text-primary-kairo group-hover:translate-x-1 transition-all duration-300" size={20} />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-blue-500 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Key Features</h4>
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-slate-400">
                        <div className="w-1.5 h-1.5 bg-primary-kairo rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-slate-400 mb-8">
            Ready to transform your digital presence?
          </p>
          <button 
            onClick={() => {
              const element = document.querySelector('#contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-kairo to-blue-600 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            Start Your Project
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
