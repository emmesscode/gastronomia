
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllMenuItems } from "@/data/menuData";
import { ChevronLeft, Clock, Share2, ShoppingBag, Star, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  allergenes?: string[];
  image?: string;
  featured?: boolean;
  ingredients?: string[];
  preparation?: string;
  category?: string;
}

const FoodDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    // Get the food item details based on the ID
    const allItems = getAllMenuItems();
    const foundItem = allItems.find(item => item.id === id);
    
    if (foundItem) {
      // Add the category information to the item
      const itemWithCategory: FoodItem = {
        ...foundItem,
        category: getCategoryForItem(foundItem.id)
      };
      setItem(itemWithCategory);
    }
    setLoading(false);
  }, [id]);

  // Helper function to get category name for an item
  const getCategoryForItem = (itemId: string): string => {
    const allMenuCategories = [
      ...getAllMenuItems().map(item => ({ id: item.id, category: getItemType(item.id) }))
    ];
    
    const found = allMenuCategories.find(i => i.id === itemId);
    return found ? found.category : "Menu Item";
  };

  // Helper function to determine item type based on ID
  const getItemType = (itemId: string): string => {
    if (itemId.startsWith('f')) return 'Food';
    if (itemId.startsWith('d')) return 'Dessert';
    if (itemId.startsWith('w')) return 'Wine';
    if (itemId.startsWith('c')) return 'Cocktail';
    if (itemId.startsWith('n')) return 'Non-Alcoholic';
    return 'Menu Item';
  };

  const handleAddToCart = () => {
    if (!item) return;
    
    // Add item to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      });
    }
    
    toast.success(`Added ${quantity} × ${item.name} to cart`, {
      description: "Go to the Order page to complete your purchase",
      action: {
        label: "View Order",
        onClick: () => navigate("/order")
      }
    });
  };

  const handleShare = () => {
    if (navigator.share && item) {
      navigator.share({
        title: item.name,
        text: `Check out ${item.name} at our restaurant!`,
        url: window.location.href
      })
      .catch(error => console.log('Error sharing', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-24 bg-gray-200 rounded mb-6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
            <p className="mb-6">We couldn't find the item you're looking for.</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="rounded-xl overflow-hidden bg-gray-100 aspect-square view-transition-image">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  style={{viewTransitionName: `food-image-${item.id}`}}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <Utensils className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium text-purple-600 px-2 py-1 bg-purple-50 rounded-full">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="ml-2 text-sm font-medium text-amber-600 px-2 py-1 bg-amber-50 rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1" /> Chef's Choice
                    </span>
                  )}
                </div>
                <h1 
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{viewTransitionName: `food-title-${item.id}`}}
                >
                  {item.name}
                </h1>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex items-baseline">
                  <span 
                    className="text-2xl font-bold"
                    style={{viewTransitionName: `food-price-${item.id}`}}
                  >
                    {formatCurrency(item.price)}
                  </span>
                  {item.preparation && (
                    <span className="ml-4 flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" /> 
                      {item.preparation.includes("minutes") ? item.preparation.split(" ")[0] : "25"} min prep time
                    </span>
                  )}
                </div>
              </div>
              
              {/* Add to Cart Section */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                <div className="flex items-center bg-gray-100 rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-l-lg"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >
                    -
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-r-lg"
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    +
                  </Button>
                </div>
                <Button 
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Order
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Details Cards */}
              <div className="space-y-4 pt-6">
                {item.ingredients && item.ingredients.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm uppercase text-gray-500 mb-2">Ingredients</h3>
                      <p className="text-gray-700">{item.ingredients.join(", ")}</p>
                    </CardContent>
                  </Card>
                )}
                
                {item.preparation && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm uppercase text-gray-500 mb-2">Preparation</h3>
                      <p className="text-gray-700">{item.preparation}</p>
                    </CardContent>
                  </Card>
                )}
                
                {item.allergenes && item.allergenes.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm uppercase text-gray-500 mb-2">Allergens</h3>
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
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FoodDetails;
