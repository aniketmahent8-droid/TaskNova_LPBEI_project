import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, User, Briefcase, UserPlus } from "lucide-react";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    if (!email.trim() || !password.trim()) {
      toast({ title: "Email and password required", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Must be at least 6 characters", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
    };
    login(user);
    toast({ title: "Account created!", description: "Welcome to the platform!" });
    if (role === "provider") {
      navigate("/provider-signup");
    } else {
      navigate("/");
    }
    setIsLoading(false);
  };

  const roleOptions = [
    { value: "user" as UserRole, label: "User", icon: <User className="h-5 w-5" />, desc: "I want to book services" },
    { value: "provider" as UserRole, label: "Service Provider", icon: <Briefcase className="h-5 w-5" />, desc: "I want to offer services" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-primary/5">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground text-balance">Create an account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Get started in minutes</p>
          </div>

          {/* Role selection */}
          <div className="mb-6">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">I want to</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {roleOptions.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                    role === r.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  }`}
                >
                  <span className={role === r.value ? "text-primary" : "text-muted-foreground"}>{r.icon}</span>
                  <p className="text-sm font-medium text-foreground">{r.label}</p>
                  <p className="text-xs text-muted-foreground text-center">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11" />
              <p className="mt-1 text-xs text-muted-foreground">Must be at least 6 characters</p>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
