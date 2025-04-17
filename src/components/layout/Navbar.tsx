
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, History, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuLink 
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, getItemCount, addToCart, removeFromCart, getTotalPrice } = useCart();
  const cartItemCount = getItemCount();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className={cn("font-bold text-2xl", isScrolled ? "text-primary" : "accent-text")}>
          Gastronomia
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
              )}>
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/menu" className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
              )}>
                Menu
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/order" className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
              )}>
                Order Online
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/reservation" className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
              )}>
                Reservations
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/my-history" className={cn(
                "px-4 py-2 text-sm font-medium transition-colors flex items-center",
                isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
              )}>
                <History className="h-4 w-4 mr-1" />
                My History
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/order" 
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors flex items-center",
                  isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
                )}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Cart
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="ml-1 px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Navigation Button */}
        <div className="flex items-center md:hidden">
          {/* Cart Sheet for Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "mr-2 relative",
                  isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
                )}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 px-1 min-w-[18px] h-4 flex items-center justify-center text-[10px] rounded-full"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Your Order
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Your cart is empty</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/order')}
                    >
                      Browse Menu
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="divide-y mb-4 max-h-[60vh] overflow-auto pr-2">
                      {cart.map((item) => (
                        <div key={item.id} className="py-3 flex items-center">
                          {item.image && (
                            <div 
                              className="w-14 h-14 mr-3 rounded overflow-hidden flex-shrink-0 cursor-pointer"
                              onClick={() => navigate(`/food/${item.id}`)}
                            >
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-grow min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              ${item.price} each
                            </p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        onClick={() => navigate('/order')}
                      >
                        Checkout
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/menu')}
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu} 
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"} />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg md:hidden animate-fade-in">
            <nav className="container mx-auto py-4 flex flex-col space-y-2">
              <Link to="/" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/menu" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={toggleMenu}>
                Menu
              </Link>
              <Link to="/order" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={toggleMenu}>
                Order Online
              </Link>
              <Link to="/reservation" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={toggleMenu}>
                Reservations
              </Link>
              <Link to="/my-history" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center" onClick={toggleMenu}>
                <History className="h-4 w-4 mr-1" />
                My History
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
