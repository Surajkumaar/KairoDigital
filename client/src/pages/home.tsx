import Navigation from "@/components/layout/navigation";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Services from "@/components/sections/services";
import Industries from "@/components/sections/industries";
import Portfolio from "@/components/sections/portfolio";
import WhyChooseUs from "@/components/sections/why-choose-us";
import Testimonials from "@/components/sections/testimonials";
import Vision from "@/components/sections/vision";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layout/footer";
import FloatingActions from "@/components/layout/floating-actions";

export default function Home() {
  return (
    <div className="bg-slate-800 text-white font-inter overflow-x-hidden">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Industries />
      <Portfolio />
      <WhyChooseUs />
      <Testimonials />
      <Vision />
      <Contact />
      <Footer />
      <FloatingActions />
    </div>
  );
}
