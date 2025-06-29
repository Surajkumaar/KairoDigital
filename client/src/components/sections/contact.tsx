import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Download, Calendar, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';

// Your EmailJS configuration
const EMAILJS_SERVICE_ID = "service_suiwzvo"; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = "template_rcdr6u6"; // Replace with your EmailJS template ID
const EMAILJS_PUBLIC_KEY = "SrNqaWyHUI5wdvGrt"; // Replace with your EmailJS public key
const EMAILJS_ACK_TEMPLATE_ID = "template_mvs1kns"; // Add your acknowledgement template ID here

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Please enter a valid phone number")
    .refine(
      (val) => val.trim() === '' || /^[0-9+\-\s()]+$/.test(val),
      { message: "Please enter a valid phone number" }
    ),
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
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Make sure your EmailJS template uses ${from_name} and ${from_email}
      const templateParams = {
        from_name: values.name,
        from_email: values.email,
        phone: values.phone,
        message: values.message,
      };
      console.log('EmailJS templateParams:', templateParams); // Debug: check what is sent

      // Send main email to you
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      // Send acknowledgement email to client
      const ackParams = {
        from_name: values.name,
        from_email: values.email,
        phone: values.phone,
        message: values.message,
      };
      console.log('Ack email params:', ackParams); // Debug: log ack params
      try {
        const ackResponse = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_ACK_TEMPLATE_ID,
          ackParams,
          EMAILJS_PUBLIC_KEY
        );
        console.log('Ack email response:', ackResponse); // Debug: check ack response
      } catch (ackError) {
        console.error('Error sending acknowledgement email:', ackError);
        if (ackError && ackError.text) {
          toast({
            title: "Failed to send acknowledgement email",
            description: ackError.text,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Failed to send acknowledgement email",
            description: "Please check your template variables and EmailJS settings.",
            variant: "destructive",
          });
        }
      }

      if (response.status === 200) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours. An acknowledgement email has been sent to your address.",
        });
        form.reset();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary-kairo/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-kairo/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(221,96%,53%,0.1)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,hsl(4,100%,67%,0.1)_0%,transparent_50%)]"></div>
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
              Get In Touch
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-white">Let's Build</span>
            <span className="block text-highlight-blue">Something Great</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Ready to transform your digital presence? Share your vision with us and let's create a growth strategy that delivers real results.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div 
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-10 rounded-3xl hover:border-slate-600/50 transition-all duration-500"
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
                          className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary-kairo focus:ring-primary-kairo/20 rounded-xl h-12"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Your phone number"
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
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Describe your goals and challenges</FormLabel>
                      <FormControl>
                        <Textarea 
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
                  <Mail className="text-blue-500 text-xl mr-4" size={24} />
                  <span className="text-slate-300">kairoxdigital@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="text-blue-500 text-xl mr-4" size={24} />
                  <span className="text-slate-300">+91 8939651621</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-blue-500 text-xl mr-4" size={24} />
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
                  href="https://www.instagram.com/kairo_digital_?igsh=MW05anJrYTN1emV1ZA==" 
                  className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:scale-110 transition-all duration-300"
                >
                  <Instagram size={24} />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:scale-110 transition-all duration-300"
                >
                  <Linkedin size={24} />
                </a>
                <a 
                  href="https://x.com/Kairo_Digital" 
                  className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:scale-110 transition-all duration-300"
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
              <Button 
                className="w-full card-3d bg-blue-600 text-white hover:bg-blue-700 px-6 py-4 rounded-xl font-semibold shadow-3d hover:shadow-3d-hover transition-all"
              >
                <Calendar className="mr-2" size={20} />
                Book a Free Call
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
