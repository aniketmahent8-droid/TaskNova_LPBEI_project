import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Sparkles, ArrowRight } from "lucide-react";

const Home = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-xl font-bold text-foreground">ServiceHub</h1>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user?.name} <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ml-1">{user?.role}</span>
                </span>
                <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/login"); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => navigate("/login")}>Sign in</Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-foreground text-balance">Find & Book Services</h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            Connect with trusted professionals for all your service needs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/services">Browse Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            {isAuthenticated && (
              <Button variant="outline" size="lg" asChild>
                <Link to="/my-bookings">My Bookings</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
