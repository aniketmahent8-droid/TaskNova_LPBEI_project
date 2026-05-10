import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Briefcase, LogOut, TrendingUp } from "lucide-react";

const mockBookings = [
  { id: 1, user: "Alice Johnson", service: "Plumbing", provider: "Bob's Plumbing", date: "2026-03-24", status: "Completed" },
  { id: 2, user: "Charlie Smith", service: "Cleaning", provider: "CleanPro", date: "2026-03-25", status: "Pending" },
  { id: 3, user: "Diana Lee", service: "Electrical", provider: "SparkFix", date: "2026-03-25", status: "In Progress" },
  { id: 4, user: "Evan Brown", service: "Painting", provider: "ColorCraft", date: "2026-03-26", status: "Confirmed" },
];

const stats = [
  { label: "Total Users", value: "1,284", icon: Users, change: "+12%" },
  { label: "Total Bookings", value: "3,847", icon: Calendar, change: "+8%" },
  { label: "Total Providers", value: "156", icon: Briefcase, change: "+5%" },
  { label: "Revenue", value: "$48.2K", icon: TrendingUp, change: "+18%" },
];

const statusColors: Record<string, string> = {
  Completed: "bg-accent/10 text-accent",
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-primary/10 text-primary",
  Confirmed: "bg-blue-100 text-blue-700",
};

const AdminDashboard = () => {
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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <motion.div key={s.label} variants={item} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs font-medium text-accent">{s.change}</span>
                </div>
                <p className="mt-4 text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Bookings */}
          <motion.div variants={item} className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Service</th>
                    <th className="px-6 py-3">Provider</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((b) => (
                    <tr key={b.id} className="border-b border-border last:border-0 hover:bg-surface-alt/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{b.user}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{b.service}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{b.provider}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground tabular-nums">{b.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
