import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useBookings, BookingStatus, Booking } from "@/contexts/BookingContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Calendar, ChevronRight, Star, CheckCircle2, Clock, Truck, CircleDot, X } from "lucide-react";

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600", icon: <Clock className="h-4 w-4" /> },
  confirmed: { label: "Confirmed", color: "bg-primary/10 text-primary", icon: <CheckCircle2 className="h-4 w-4" /> },
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-600", icon: <Truck className="h-4 w-4" /> },
  completed: { label: "Completed", color: "bg-accent/10 text-accent", icon: <CircleDot className="h-4 w-4" /> },
};

const statusSteps: BookingStatus[] = ["pending", "confirmed", "in_progress", "completed"];

const MyBookings = () => {
  const { bookings, addReview } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmitReview = (bookingId: string) => {
    if (reviewRating === 0) {
      toast({ title: "Select a rating", variant: "destructive" });
      return;
    }
    addReview(bookingId, {
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split("T")[0],
    });
    toast({ title: "Review submitted!", description: "Thank you for your feedback." });
    setReviewRating(0);
    setReviewComment("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-bold text-foreground">ServiceHub</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bookings yet</p>
            <Button asChild className="mt-4"><Link to="/services">Browse Services</Link></Button>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b, i) => {
              const config = statusConfig[b.status];
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedBooking(selectedBooking?.id === b.id ? null : b)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{b.service}</p>
                        <p className="text-sm text-muted-foreground tabular-nums">{b.date} · {b.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}>
                        {config.icon}{config.label}
                      </span>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${selectedBooking?.id === b.id ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {selectedBooking?.id === b.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border p-4 space-y-4">
                          {/* Status tracker */}
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Booking Status</p>
                            <div className="flex items-center gap-1">
                              {statusSteps.map((s, idx) => {
                                const currentIdx = statusSteps.indexOf(b.status);
                                const isActive = idx <= currentIdx;
                                const sc = statusConfig[s];
                                return (
                                  <div key={s} className="flex items-center gap-1 flex-1">
                                    <div className={`flex flex-col items-center gap-1 flex-1`}>
                                      <div className={`h-2 w-full rounded-full transition-colors ${isActive ? "bg-primary" : "bg-muted"}`} />
                                      <span className={`text-[10px] ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>{sc.label}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Booking details */}
                          <div className="rounded-lg bg-muted/50 p-3 space-y-1.5 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Booking ID</span><span className="font-mono text-foreground">{b.id}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="text-foreground">{b.address}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="text-foreground">{b.paymentMethod}</span></div>
                            <div className="flex justify-between font-semibold"><span>Total</span><span className="text-primary tabular-nums">${(b.price * 1.05).toFixed(2)}</span></div>
                          </div>

                          {/* Review section for completed bookings */}
                          {b.status === "completed" && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Review</p>
                              {b.review ? (
                                <div className="rounded-lg bg-accent/5 border border-accent/10 p-3">
                                  <div className="flex items-center gap-1 mb-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star key={s} className={`h-4 w-4 ${s <= b.review!.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
                                    ))}
                                  </div>
                                  <p className="text-sm text-foreground">{b.review.comment}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{b.review.date}</p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <button
                                        key={s}
                                        onClick={() => setReviewRating(s)}
                                        onMouseEnter={() => setHoveredStar(s)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        className="transition-transform hover:scale-110"
                                      >
                                        <Star className={`h-6 w-6 transition-colors ${
                                          s <= (hoveredStar || reviewRating) ? "text-yellow-500 fill-yellow-500" : "text-muted"
                                        }`} />
                                      </button>
                                    ))}
                                  </div>
                                  <textarea
                                    placeholder="Share your experience..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none h-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  />
                                  <Button size="sm" onClick={() => handleSubmitReview(b.id)}>Submit Review</Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;
