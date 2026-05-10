import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useBookings } from "@/contexts/BookingContext";
import { CreditCard, Smartphone, Banknote, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

const providers: Record<string, { name: string; price: number }> = {
  Plumbing: { name: "Mike's Plumbing", price: 150 },
  Electrical: { name: "PowerFix Electricals", price: 120 },
  Painting: { name: "ColorPro Painters", price: 250 },
  Cleaning: { name: "SparkleClean Co.", price: 200 },
  Repairs: { name: "HandyFix Services", price: 100 },
  Moving: { name: "SwiftMove Logistics", price: 350 },
};

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI Payment", icon: Smartphone },
  { id: "cash", label: "Cash on Service", icon: Banknote },
];

const BookService = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addBooking } = useBookings();

  const preselected = searchParams.get("service") || "";
  const [service, setService] = useState(preselected);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("card");
  const [step, setStep] = useState<"details" | "payment" | "confirm">("details");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ReturnType<typeof addBooking> | null>(null);

  const matched = providers[service] || { name: "Assigned Provider", price: 100 };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !date || !address) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }
    setStep("payment");
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const booking = addBooking({
      service,
      date,
      address,
      notes,
      provider: matched.name,
      price: matched.price,
      paymentMethod: paymentMethods.find((p) => p.id === payment)?.label || "Card",
    });
    setConfirmedBooking(booking);
    setStep("confirm");
    setIsLoading(false);
    toast({ title: "Booking confirmed!", description: `Booking ID: ${booking.id}` });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-foreground">ServiceHub</Link>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6">
        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {["Details", "Payment", "Confirmation"].map((s, i) => {
            const stepIndex = ["details", "payment", "confirm"].indexOf(step);
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  i <= stepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>{i + 1}</div>
                <span className={`text-sm hidden sm:inline ${i <= stepIndex ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                {i < 2 && <div className={`h-px w-8 ${i < stepIndex ? "bg-primary" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === "details" && (
            <motion.div key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h1 className="text-2xl font-bold text-foreground mb-6">Book a Service</h1>
              <form onSubmit={handleDetailsSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
                <div>
                  <Label>Service Type</Label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select a service</option>
                    {Object.keys(providers).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div><Label>Preferred Date</Label><Input className="mt-1.5" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
                <div><Label>Address</Label><Input className="mt-1.5" placeholder="Your address" value={address} onChange={(e) => setAddress(e.target.value)} /></div>
                <div><Label>Notes (optional)</Label><Input className="mt-1.5" placeholder="Any special instructions" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>

                {service && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                    <p className="text-sm text-muted-foreground">Provider: <span className="font-medium text-foreground">{matched.name}</span></p>
                    <p className="text-sm text-muted-foreground mt-1">Estimated Price: <span className="font-semibold text-primary tabular-nums">${matched.price}</span></p>
                  </div>
                )}

                <Button type="submit" className="w-full h-11">Continue to Payment</Button>
              </form>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep("details")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <h1 className="text-2xl font-bold text-foreground mb-6">Payment</h1>
              <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
                {/* Order summary */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Service</span><span className="text-foreground font-medium">{service}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Provider</span><span className="text-foreground">{matched.name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="text-foreground tabular-nums">{date}</span></div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">${matched.price.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Service fee</span><span className="tabular-nums">${(matched.price * 0.05).toFixed(2)}</span></div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-semibold"><span>Total</span><span className="text-primary tabular-nums">${(matched.price * 1.05).toFixed(2)}</span></div>
                </div>

                {/* Payment methods */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment Method</Label>
                  <div className="mt-2 space-y-2">
                    {paymentMethods.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayment(m.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-4 transition-all ${
                          payment === m.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <m.icon className={`h-5 w-5 ${payment === m.id ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium text-foreground">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleConfirmBooking} className="w-full h-11" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay $${(matched.price * 1.05).toFixed(2)}`}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "confirm" && confirmedBooking && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Booking Confirmed!</h1>
                <p className="text-sm text-muted-foreground">Your service has been booked successfully</p>

                <div className="rounded-lg bg-muted/50 p-4 text-left space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Booking ID</span><span className="font-mono text-foreground">{confirmedBooking.id}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="text-foreground">{confirmedBooking.service}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Provider</span><span className="text-foreground">{confirmedBooking.provider}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground tabular-nums">{confirmedBooking.date}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="text-foreground">{confirmedBooking.address}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="text-foreground">{confirmedBooking.paymentMethod}</span></div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-semibold"><span>Total Paid</span><span className="text-primary tabular-nums">${(confirmedBooking.price * 1.05).toFixed(2)}</span></div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    toast({ title: "Receipt downloaded!", description: "Check your downloads folder." });
                  }}>
                    Download Receipt
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link to="/my-bookings">View Bookings</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default BookService;
