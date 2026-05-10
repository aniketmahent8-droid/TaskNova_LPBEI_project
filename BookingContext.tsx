import React, { createContext, useContext, useState, useCallback } from "react";

export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed";

export interface Review {
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  service: string;
  date: string;
  address: string;
  notes: string;
  status: BookingStatus;
  provider: string;
  price: number;
  paymentMethod: string;
  createdAt: string;
  review?: Review;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "status" | "createdAt">) => Booking;
  updateStatus: (id: string, status: BookingStatus) => void;
  addReview: (id: string, review: Review) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = "bookings_data";

const defaultBookings: Booking[] = [
  {
    id: "bk-001",
    service: "Plumbing",
    date: "2026-03-20",
    address: "123 Main St",
    notes: "Fix kitchen sink",
    status: "completed",
    provider: "Mike's Plumbing",
    price: 150,
    paymentMethod: "Credit Card",
    createdAt: "2026-03-18T10:00:00Z",
    review: { rating: 5, comment: "Excellent work, very professional!", date: "2026-03-21" },
  },
  {
    id: "bk-002",
    service: "Cleaning",
    date: "2026-03-25",
    address: "456 Oak Ave",
    notes: "Deep cleaning",
    status: "confirmed",
    provider: "SparkleClean Co.",
    price: 200,
    paymentMethod: "UPI",
    createdAt: "2026-03-22T14:00:00Z",
  },
  {
    id: "bk-003",
    service: "Electrical",
    date: "2026-03-28",
    address: "789 Pine Rd",
    notes: "Install ceiling fan",
    status: "in_progress",
    provider: "PowerFix Electricals",
    price: 120,
    paymentMethod: "Credit Card",
    createdAt: "2026-03-24T09:00:00Z",
  },
];

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultBookings;
    } catch {
      return defaultBookings;
    }
  });

  const persist = (updated: Booking[]) => {
    setBookings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addBooking = useCallback((data: Omit<Booking, "id" | "status" | "createdAt">) => {
    const booking: Booking = {
      ...data,
      id: `bk-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => {
      const updated = [booking, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return booking;
  }, []);

  const updateStatus = useCallback((id: string, status: BookingStatus) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, status } : b));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addReview = useCallback((id: string, review: Review) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, review } : b));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateStatus, addReview }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used within BookingProvider");
  return ctx;
};
