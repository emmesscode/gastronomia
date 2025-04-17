
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Utensils, Wine, CakeSlice, ArrowRight, ShoppingBag, Info } from "lucide-react";
import { foodItems, dessertItems, drinkItems } from "@/data/menuData";
import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardImage } from "@/components/ui/card";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Menu = () => {
  const [activeTab, setActiveTab] = useState("food");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (item: { id: string; name: string; price: number; image?: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item);
    toast.success(`Added ${item.name} to cart`, {
      description: "Go to order page to complete your purchase",
      action: {
        label: "View Order",
        onClick: () => navigate("/order")
      }
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Header */}
        <div className="relative py-16 md:py-24 bg-gray-900 text-white top-0 absolute w-full">
          <div 
            className="absolute inset-0 bg-fixed opacity-20" 
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1500)",
              backgroundSize: "cover",
              backgroundPosition: "top",
            }}
          ></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Crafted with passion, our menu showcases the finest seasonal ingredients. 
              Each dish is a celebration of flavor, technique, and creativity.
            </p>
          </div>
        </div>

        {/* Menu Content - Adjusted top margin to account for absolute header */}
        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="food" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                <TabsTrigger value="food" className="flex items-center justify-center gap-2">
                  <Utensils className="h-4 w-4" />
                  <span>Food</span>
                </TabsTrigger>
                <TabsTrigger value="drinks" className="flex items-center justify-center gap-2">
                  <Wine className="h-4 w-4" />
                  <span>Drinks</span>
                </TabsTrigger>
                <TabsTrigger value="desserts" className="flex items-center justify-center gap-2">
                  <CakeSlice className="h-4 w-4" />
                  <span>Desserts</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="food" className="animate-fade-in">
                <div className="space-y-12">
                  {foodItems.map((category) => (
                    <div key={category.name} className="space-y-6">
                      <h2 className="text-3xl font-bold text-center">{category.name}</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        {category.items.map((item) => (
                          <div 
                            key={item.id} 
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/food/${item.id}`)}
                          >
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={item.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800"} 
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                style={{viewTransitionName: `food-image-${item.id}`}}
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <h3 
                                  className="font-bold text-xl"
                                  style={{viewTransitionName: `food-title-${item.id}`}}
                                >
                                  {item.name}
                                </h3>
                                <span 
                                  className="font-bold text-lg"
                                  style={{viewTransitionName: `food-price-${item.id}`}}
                                >
                                  ${item.price}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-2">{item.description}</p>
                              {item.allergenes && item.allergenes.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {item.allergenes.map((allergen) => (
                                    <span key={allergen} className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                      {allergen}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex justify-end gap-2 mt-3">
                                <Button 
                                  size="sm" 
                                  onClick={(e) => handleAddToCart(item, e)}
                                  className="flex items-center gap-1"
                                >
                                  <ShoppingBag className="h-3 w-3" />
                                  <span className="dark:text-white">Add to cart</span>
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/food/${item.id}`);
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <Info className="h-3 w-3" />
                                  <span>Details</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="drinks" className="animate-fade-in">
                <div className="space-y-12">
                  {drinkItems.map((category) => (
                    <div key={category.name} className="space-y-6">
                      <h2 className="text-3xl font-bold text-center">{category.name}</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.items.map((item) => (
                          <div 
                            key={item.id} 
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/food/${item.id}`)}
                          >
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={item.image || "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800"} 
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                style={{viewTransitionName: `food-image-${item.id}`}}
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <h3 
                                  className="font-bold text-xl"
                                  style={{viewTransitionName: `food-title-${item.id}`}}
                                >
                                  {item.name}
                                </h3>
                                <span 
                                  className="font-bold text-lg"
                                  style={{viewTransitionName: `food-price-${item.id}`}}
                                >
                                  ${item.price}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-2">{item.description}</p>
                              <div className="flex justify-end gap-2 mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => handleAddToCart(item, e)}
                                  className="flex items-center gap-1"
                                >
                                  <ShoppingBag className="h-3 w-3" />
                                  <span>Add to cart</span>
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/food/${item.id}`);
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <span>Details</span>
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="desserts" className="animate-fade-in">
                <div className="space-y-12">
                  {dessertItems.map((category) => (
                    <div key={category.name} className="space-y-6">
                      <h2 className="text-3xl font-bold text-center">{category.name}</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.items.map((item) => (
                          <div 
                            key={item.id} 
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/food/${item.id}`)}
                          >
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={item.image || "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800"} 
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                style={{viewTransitionName: `food-image-${item.id}`}}
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <h3 
                                  className="font-bold text-xl"
                                  style={{viewTransitionName: `food-title-${item.id}`}}
                                >
                                  {item.name}
                                </h3>
                                <span 
                                  className="font-bold text-lg"
                                  style={{viewTransitionName: `food-price-${item.id}`}}
                                >
                                  ${item.price}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-2">{item.description}</p>
                              {item.allergenes && item.allergenes.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {item.allergenes.map((allergen) => (
                                    <span key={allergen} className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                      {allergen}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex justify-end gap-2 mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => handleAddToCart(item, e)}
                                  className="flex items-center gap-1"
                                >
                                  <ShoppingBag className="h-3 w-3" />
                                  <span>Add to cart</span>
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/food/${item.id}`);
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <span>Details</span>
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Menu;
