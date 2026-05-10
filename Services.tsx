import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wrench, Paintbrush, Zap, Droplets, Scissors, Truck } from "lucide-react";

const services = [
  { name: "Plumbing", icon: Droplets, desc: "Pipes, leaks, installations", price: 150 },
  { name: "Electrical", icon: Zap, desc: "Wiring, repairs, installations", price: 120 },
  { name: "Painting", icon: Paintbrush, desc: "Interior & exterior painting", price: 250 },
  { name: "Cleaning", icon: Scissors, desc: "Deep cleaning, sanitization", price: 200 },
  { name: "Repairs", icon: Wrench, desc: "General home repairs", price: 100 },
  { name: "Moving", icon: Truck, desc: "Packing & moving services", price: 350 },
];

const Services = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-bold text-foreground">ServiceHub</Link>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Services</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
          >
            <s.icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground">{s.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            <p className="mt-2 text-lg font-semibold text-primary tabular-nums">From ${s.price}</p>
            <Button size="sm" className="mt-4" asChild>
              <Link to={`/book-service?service=${s.name}`}>Book Now</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </main>
  </div>
);

export default Services;
