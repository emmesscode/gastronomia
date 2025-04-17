import { getFeaturedItems } from "@/data/menuData";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const FeaturedFoodSection = () => {
  const featuredItems = getFeaturedItems();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Featured Dishes
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Our most popular and delicious dishes, hand-picked for you.
          </p>
        </div>

        {/* Main Section Content */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {featuredItems.map((item) => (
            <div key={item.id} className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-4 w-full">
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/food/${item.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image
                          });
                          toast.success(`Added ${item.name} to cart`);
                        }}
                      >
                        Add to Order
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                  <span className="font-bold text-primary">${item.price}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedFoodSection;
