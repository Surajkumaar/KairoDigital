import { motion } from "framer-motion";
import PortfolioCard from "@/components/ui/portfolio-card";

const portfolioItems = [
  {
    title: "Typography Reel",
    description: "Experimental typography designs showcasing brand personality through letterforms.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Typography",
    status: "Case Study in Progress"
  },
  {
    title: "Carousel Design Concept",
    description: "Interactive carousel interfaces that enhance user engagement and content discovery.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "UI Design",
    status: "Coming Soon"
  },
  {
    title: "Thattu Vadai Set Campaign",
    description: "Local food brand campaign that increased sales by 200% through authentic storytelling.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Campaign",
    status: "Full Case Study"
  }
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Portfolio Highlights</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Showcasing our creative excellence and conversion-focused results
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <PortfolioCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
