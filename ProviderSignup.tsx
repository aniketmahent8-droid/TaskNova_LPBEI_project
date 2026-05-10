import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Briefcase, Loader2 } from "lucide-react";

const ProviderSignup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    toast({ title: "Profile submitted!", description: "Your provider profile is under review." });
    navigate("/provider-dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-primary/5">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">Tell us about your business</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Business Name</Label><Input className="mt-1.5 h-11" placeholder="Your business name" required /></div>
            <div><Label>Service Category</Label><Input className="mt-1.5 h-11" placeholder="e.g., Plumbing, Cleaning" required /></div>
            <div><Label>Location</Label><Input className="mt-1.5 h-11" placeholder="City, State" required /></div>
            <div><Label>Years of Experience</Label><Input className="mt-1.5 h-11" type="number" placeholder="5" required /></div>
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Profile"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProviderSignup;
