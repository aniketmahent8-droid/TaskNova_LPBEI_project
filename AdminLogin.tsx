import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck } from "lucide-react";

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      login({ id: "admin-1", name: "Admin", email, role: "admin" });
      toast({ title: "Welcome, Admin", description: "You now have full access." });
      navigate("/admin-dashboard");
    } else {
      toast({ title: "Invalid credentials", description: "Check email and password.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-primary/5">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <ShieldCheck className="h-6 w-6 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
            <p className="mt-1 text-sm text-muted-foreground">Restricted area — authorized personnel only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11" />
            </div>
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in as Admin"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo: admin@example.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
