import { motion } from "framer-motion";
import ServiceCard from "@/components/ui/service-card";
import { 
  Instagram, 
  Palette, 
  PenTool, 
  TrendingUp, 
  Lightbulb, 
  Rocket 
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
    ]
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
    ]
  },
  {
    icon: PenTool,
    title: "Content Creation",
    description: "Compelling content that tells your brand story and drives customer action across all channels.",
    features: [
      "Blog & article writing",
      "Video content production",
      "Graphic design assets",
      "Content calendar planning"
    ]
  },
  {
    icon: TrendingUp,
    title: "Growth Strategy & Analytics",
    description: "Data-driven strategies that optimize your marketing efforts and maximize ROI.",
    features: [
      "Performance tracking & KPIs",
      "Conversion optimization",
      "Market research & analysis",
      "Growth planning & forecasting"
    ]
  },
  {
    icon: Lightbulb,
    title: "Marketing Consultation",
    description: "Strategic guidance and expert advice to accelerate your marketing success.",
    features: [
      "Marketing audits & assessments",
      "Strategic planning sessions",
      "Campaign optimization",
      "Team training & workshops"
    ]
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
    ]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Our Services</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive digital solutions tailored for your growth
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
