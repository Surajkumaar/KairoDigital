import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Download, Calendar, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  growthType: z.string().min(1, "Please select your primary need"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      growthType: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    contactMutation.mutate(values);
  };

  return (
    <section id="contact" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Let's Talk Growth</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Ready to transform your digital presence? Let's create something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div 
            className="service-card bg-slate-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-3d"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          className="bg-slate-800 border-slate-600 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="your@email.com" 
                          className="bg-slate-800 border-slate-600 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="growthType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">What kind of growth are you looking for?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                            <SelectValue placeholder="Select your primary need" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                          <SelectItem value="lead-generation">Lead Generation</SelectItem>
                          <SelectItem value="sales-growth">Sales Growth</SelectItem>
                          <SelectItem value="social-media">Social Media Presence</SelectItem>
                          <SelectItem value="digital-transformation">Complete Digital Transformation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Tell us about your project</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your goals and challenges..."
                          className="bg-slate-800 border-slate-600 text-white"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  className="w-full bg-primary-kairo hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-3d hover:shadow-3d-hover transition-all animate-pulse-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Let's Talk Growth! <Rocket className="ml-2" size={20} />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            {/* Contact Details */}
            <motion.div 
              className="service-card bg-slate-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-3d"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="text-primary-kairo text-xl mr-4" size={24} />
                  <span className="text-slate-300">hello@kairodigital.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="text-primary-kairo text-xl mr-4" size={24} />
                  <span className="text-slate-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-primary-kairo text-xl mr-4" size={24} />
                  <span className="text-slate-300">Remote-First Agency</span>
                </div>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div 
              className="service-card bg-slate-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-3d"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Follow Our Journey</h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-gradient-to-br from-primary-kairo to-secondary-kairo rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Instagram size={24} />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-gradient-to-br from-primary-kairo to-secondary-kairo rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-gradient-to-br from-primary-kairo to-secondary-kairo rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Twitter size={24} />
                </a>
              </div>
            </motion.div>

            {/* CTA Cards */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button className="w-full card-3d bg-secondary-kairo hover:bg-red-600 text-white px-6 py-4 rounded-xl font-semibold shadow-3d hover:shadow-3d-hover transition-all">
                <Download className="mr-2" size={20} />
                Download Free Growth Checklist
              </Button>
              <Button 
                variant="outline"
                className="w-full card-3d bg-transparent border-2 border-primary-kairo text-primary-kairo hover:bg-primary-kairo hover:text-white px-6 py-4 rounded-xl font-semibold shadow-3d hover:shadow-3d-hover transition-all"
              >
                <Calendar className="mr-2" size={20} />
                Book a Free Strategy Call
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
