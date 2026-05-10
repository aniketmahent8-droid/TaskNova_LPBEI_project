import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import Services from "./pages/Services";
import BookService from "./pages/BookService";
import MyBookings from "./pages/MyBookings";
import ProviderSignup from "./pages/ProviderSignup";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* User + Provider + Admin */}
            <Route path="/" element={<ProtectedRoute allowedRoles={["user", "provider", "admin"]}><Home /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute allowedRoles={["user", "provider", "admin"]}><Services /></ProtectedRoute>} />
            <Route path="/book-service" element={<ProtectedRoute allowedRoles={["user", "provider", "admin"]}><BookService /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={["user", "provider", "admin"]}><MyBookings /></ProtectedRoute>} />

            {/* Provider + Admin */}
            <Route path="/provider-signup" element={<ProtectedRoute allowedRoles={["provider", "admin"]}><ProviderSignup /></ProtectedRoute>} />
            <Route path="/provider-dashboard" element={<ProtectedRoute allowedRoles={["provider", "admin"]}><ProviderDashboard /></ProtectedRoute>} />

            {/* Admin only */}
            <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </BookingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
