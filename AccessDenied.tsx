import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldX } from "lucide-react";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <ShieldX className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">You don't have permission to view this page.</p>
        <div className="mt-8 flex flex-col gap-3">
          <Button onClick={() => navigate("/")}>Go to Home</Button>
          <Button variant="outline" onClick={() => navigate("/login")}>Switch Account</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
