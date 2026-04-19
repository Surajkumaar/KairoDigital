import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Lock, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/admin");
    }
  }, [user, setLocation]);

  const loginForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  if (user) return null;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-outfit">
      <div className="flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/40 bg-card/50 backdrop-blur-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold tracking-tight text-primary">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your Kairo Digital account to manage your contents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="login-username" 
                      placeholder="admin" 
                      className="pl-9"
                      {...loginForm.register("username")} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="login-password" 
                      type="password" 
                      className="pl-9"
                      {...loginForm.register("password")} 
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-primary/5 border-l border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Kairo Digital Admin Control
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Manage your portfolio, view client inquiries, and scale your digital presence with our integrated dashboard tools.
            </p>
          </motion.div>
          
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { label: "Portfolio Management", desc: "Add & Edit your projects" },
              { label: "Lead Tracking", desc: "Monitor incoming messages" },
              { label: "Real-time Updates", desc: "Live content distribution" },
              { label: "Analytics", desc: "Track your performance" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-4 rounded-xl bg-card/30 border border-border/20 text-left"
              >
                <div className="font-semibold text-primary">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
