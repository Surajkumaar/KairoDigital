import { useState } from "react";
import { MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function FloatingActions() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter.",
        });
        setEmail("");
      } else {
        throw new Error("Failed to subscribe");
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-4">
      {/* Live Chat Button */}
      <Button
        className="card-3d bg-primary-kairo hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-3d hover:shadow-3d-hover transition-all animate-pulse-glow p-0"
        title="Live Chat"
        onClick={() => {
          toast({
            title: "Chat coming soon!",
            description: "Our live chat feature will be available shortly.",
          });
        }}
      >
        <MessageCircle size={24} />
      </Button>
      
      {/* Newsletter Signup */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="card-3d bg-secondary-kairo hover:bg-red-600 text-white w-14 h-14 rounded-full shadow-3d hover:shadow-3d-hover transition-all p-0"
            title="Newsletter"
          >
            <Mail size={24} />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Subscribe to Our Newsletter</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewsletterSubmit} className="space-y-4">
            <div>
              <label htmlFor="newsletter-email" className="block text-sm font-medium text-slate-300 mb-2">
                Get our free digital growth checklist
              </label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-primary-kairo hover:bg-blue-600"
            >
              Subscribe
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
