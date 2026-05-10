import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, DollarSign, Star, LogOut, Clock } from "lucide-react";

const stats = [
  { label: "Active Bookings", value: "12", icon: Calendar },
  { label: "Earnings", value: "$2,840", icon: DollarSign },
  { label: "Rating", value: "4.8", icon: Star },
  { label: "Avg Response", value: "2.1h", icon: Clock },
];

const ProviderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Provider Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <motion.div key={s.label} variants={item} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <s.icon className="h-5 w-5 text-muted-foreground" />
                <p className="mt-4 text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={item} className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-lg font-medium text-foreground">Your services and bookings will appear here</p>
            <p className="mt-2 text-sm text-muted-foreground">Complete your profile to start receiving bookings</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
