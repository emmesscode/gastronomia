import { useLayoutEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";
import Order from "./pages/Order";
import FoodDetails from "./pages/FoodDetails";
import MyHistory from "./pages/MyHistory";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import ChefTable from "./pages/ChefTable";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Wrapper = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return children;
};

const RequireAuth = ({ children, role }: { children: JSX.Element; role?: "admin" | "user" }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Wrapper>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/order" element={<Order />} />
                <Route path="/food/:id" element={<FoodDetails />} />
                <Route path="/my-history" element={<MyHistory />} />
                <Route path="/chef-table" element={<ChefTable />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth role="admin">
                      <AdminDashboard />
                    </RequireAuth>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Wrapper>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
