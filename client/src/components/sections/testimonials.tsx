import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Balatro from "../ui/balatro";

const testimonial = {
  name: "Coming Soon",
  company: "Client Testimonials",
  quote: "Hold up folks ! , Rome was'tn built in a day nor our client's success stories and results.",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
};

export default function Testimonials() {
  return (
    <section className="py-20 bg-slate-800 relative overflow-hidden">
      <Balatro />
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-highlight-blue">Client Success Stories</h2>
          <p className="text-xl text-slate-300 mb-16 max-w-3xl mx-auto">
            What our partners say about working with Kairo Digital
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            className="service-card bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl shadow-3d"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              {testimonial.image ? (
                <img 
                  src={testimonial.image} 
                  alt="Client testimonial" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-primary-kairo to-secondary-kairo rounded-full mr-4"></div>
              )}
              <div className="text-left">
                <h4 className="font-semibold text-white">{testimonial.name}</h4>
                <p className="text-sm text-slate-400">{testimonial.company}</p>
              </div>
            </div>
            <p className="text-slate-300 italic mb-4">"{testimonial.quote}"</p>
            <div className="flex justify-center text-secondary-kairo">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
