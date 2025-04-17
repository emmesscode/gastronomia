
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardImage, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { getFeaturedItems } from "@/data/menuData";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

const FeaturedFoodSection = () => {
  const featuredItems = getFeaturedItems();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const handleAddToCart = (id: string, name: string, price: number, image: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the cart button
    addToCart({ id, name, price, image });
    toast.success(`Added ${name} to cart`, {
      description: "Go to order page to complete your purchase",
      action: {
        label: "View Order",
        onClick: () => navigate("/order")
      }
    });
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Chef's Selection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our chef carefully selects the finest ingredients to create these signature dishes that define our culinary vision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              onClick={() => navigate(`/food/${item.id}`)}
            >
              <CardImage 
                src={item.image} 
                alt={item.name}
                itemId={item.id}
              />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle 
                    className="text-xl font-semibold group-hover:text-primary transition-colors"
                    style={{viewTransitionName: `food-title-${item.id}`}}
                  >
                    {item.name}
                  </CardTitle>
                  <span 
                    className="text-lg font-bold"
                    style={{viewTransitionName: `food-price-${item.id}`}}
                  >
                    ${item.price}
                  </span>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 flex-grow">
                  {item.ingredients && (
                    <div>
                      <h4 className="font-medium text-sm uppercase text-gray-500 mb-1">Ingredients</h4>
                      <p className="text-sm text-gray-700">{item.ingredients.join(", ")}</p>
                    </div>
                  )}
                  
                  {item.preparation && (
                    <div>
                      <h4 className="font-medium text-sm uppercase text-gray-500 mb-1">Preparation</h4>
                      <p className="text-sm text-gray-700">{item.preparation}</p>
                    </div>
                  )}
                  
                  {item.allergenes && item.allergenes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm uppercase text-gray-500 mb-1">Allergens</h4>
                      <div className="flex flex-wrap gap-1">
                        {item.allergenes.map((allergen) => (
                          <span 
                            key={allergen} 
                            className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => handleAddToCart(item.id, item.name, item.price, item.image, e)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" /> Add to Order
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/food/${item.id}`);
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedFoodSection;
