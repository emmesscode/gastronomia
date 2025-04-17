import { useLayoutEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";
import Order from "./pages/Order";
import FoodDetails from "./pages/FoodDetails";
import MyHistory from "./pages/MyHistory";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Wrapper>
            <Routes>
              <Route path="/" element={<Index />} viewTransition />
              <Route path="/menu" element={<Menu />} viewTransition />
              <Route path="/reservation" element={<Reservation />} viewTransition />
              <Route path="/order" element={<Order />} viewTransition />
              <Route path="/food/:id" element={<FoodDetails />} viewTransition />
              <Route path="/my-history" element={<MyHistory />} viewTransition />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} viewTransition />
            </Routes>
          </Wrapper>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
