import { getAllMenuItems } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ShoppingCart, Info } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MenuSection = () => {
  const specialMenuItems = getAllMenuItems().slice(0, 8);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Our Special Menu
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Discover our carefully selected dishes
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {specialMenuItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
              onClick={() => navigate(`/food/${item.id}`)}
            >
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <span className="font-bold text-sm text-primary">${item.price}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1 mb-2">{item.description}</p>
                <div className="w-full">
                   <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="default"
                              className="w-full mt-1 text-xs h-7 px-2 flex-1"
                               onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart({
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image
                                  });
                                  toast.success(`Added ${item.name} to cart`, {
                                    description: "Go to order page to complete your purchase",
                                    action: {
                                      label: "View Order",
                                      onClick: () => navigate("/order")
                                    }
                                  });
                                }}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              className="mt-1 text-xs h-7 w-7 px-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/food/${item.id}`);
                              }}
                            >
                              <Info className="h-3 w-3" />
                            </Button>
                          </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
