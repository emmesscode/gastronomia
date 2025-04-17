
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, History } from "lucide-react";
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

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const cartItemCount = getItemCount();

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
        <Link to="/" className="font-bold text-2xl text-primary">
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
          <Link 
            to="/order" 
            className={cn(
              "mr-2 text-sm font-medium",
              isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
            )}
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 px-1 min-w-[18px] h-4 flex items-center justify-center text-[10px] rounded-full"
                >
                  {cartItemCount}
                </Badge>
              )}
            </div>
          </Link>
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
              <Link to="/my-history" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={toggleMenu}>
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
