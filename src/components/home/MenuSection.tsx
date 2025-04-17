
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Utensils, Wine, CakeSlice, ArrowRight, ShoppingBag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardImage } from "@/components/ui/card";
import { foodItems, dessertItems, drinkItems } from "@/data/menuData";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

const MenuSection = () => {
  const [activeTab, setActiveTab] = useState("food");
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const handleAddToCart = (id: string, name: string, price: number, image: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
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
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Menu</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated menu of exquisite dishes, fine wines, and delectable desserts.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
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
            <div className="space-y-8">
              {foodItems.slice(0, 2).map((category) => (
                <div key={category.name} className="space-y-4">
                  <h3 className="text-2xl font-semibold border-b pb-2">{category.name}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.slice(0, 3).map((item) => (
                      <Card
                        key={item.id}
                        className="flex overflow-hidden hover:shadow-md transition-all cursor-pointer"
                        onClick={() => navigate(`/food/${item.id}`)}
                      >
                        <div className="w-1/3 h-auto relative">
                          <img 
                            src={item.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=200"} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            style={{viewTransitionName: `food-image-${item.id}`}}
                          />
                        </div>
                        <CardContent className="w-2/3 p-3 flex flex-col justify-between">
                          <div>
                            <h4 
                              className="font-medium text-sm mb-1 group-hover:text-primary"
                              style={{viewTransitionName: `food-title-${item.id}`}}
                            >
                              {item.name}
                            </h4>
                            <p className="text-gray-600 text-xs line-clamp-2">{item.description}</p>
                            {item.allergenes && item.allergenes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.allergenes.map((allergen) => (
                                  <span key={allergen} className="px-1 py-0.5 text-[10px] rounded bg-red-100 text-red-800">
                                    {allergen}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span 
                              className="font-bold text-sm"
                              style={{viewTransitionName: `food-price-${item.id}`}}
                            >
                              ${item.price}
                            </span>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={(e) => handleAddToCart(item.id, item.name, item.price, item.image, e)}
                              >
                                <ShoppingBag className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/food/${item.id}`);
                                }}
                              >
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="drinks" className="animate-fade-in">
            <div className="space-y-8">
              {drinkItems.slice(0, 2).map((category) => (
                <div key={category.name} className="space-y-4">
                  <h3 className="text-2xl font-semibold border-b pb-2">{category.name}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.slice(0, 3).map((item) => (
                      <Card
                        key={item.id}
                        className="flex overflow-hidden hover:shadow-md transition-all cursor-pointer"
                        onClick={() => navigate(`/food/${item.id}`)}
                      >
                        <div className="w-1/3 h-auto relative">
                          <img 
                            src={item.image || "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=200"} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            style={{viewTransitionName: `food-image-${item.id}`}}
                          />
                        </div>
                        <CardContent className="w-2/3 p-3 flex flex-col justify-between">
                          <div>
                            <h4 
                              className="font-medium text-sm mb-1"
                              style={{viewTransitionName: `food-title-${item.id}`}}
                            >
                              {item.name}
                            </h4>
                            <p className="text-gray-600 text-xs line-clamp-2">{item.description}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span 
                              className="font-bold text-sm"
                              style={{viewTransitionName: `food-price-${item.id}`}}
                            >
                              ${item.price}
                            </span>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={(e) => handleAddToCart(item.id, item.name, item.price, item.image, e)}
                              >
                                <ShoppingBag className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/food/${item.id}`);
                                }}
                              >
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="desserts" className="animate-fade-in">
            <div className="space-y-8">
              {dessertItems.map((category) => (
                <div key={category.name} className="space-y-4">
                  <h3 className="text-2xl font-semibold border-b pb-2">{category.name}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((item) => (
                      <Card
                        key={item.id}
                        className="flex overflow-hidden hover:shadow-md transition-all cursor-pointer"
                        onClick={() => navigate(`/food/${item.id}`)}
                      >
                        <div className="w-1/3 h-auto relative">
                          <img 
                            src={item.image || "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=200"} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            style={{viewTransitionName: `food-image-${item.id}`}}
                          />
                        </div>
                        <CardContent className="w-2/3 p-3 flex flex-col justify-between">
                          <div>
                            <h4 
                              className="font-medium text-sm mb-1"
                              style={{viewTransitionName: `food-title-${item.id}`}}
                            >
                              {item.name}
                            </h4>
                            <p className="text-gray-600 text-xs line-clamp-2">{item.description}</p>
                            {item.allergenes && item.allergenes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.allergenes.map((allergen) => (
                                  <span key={allergen} className="px-1 py-0.5 text-[10px] rounded bg-red-100 text-red-800">
                                    {allergen}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span 
                              className="font-bold text-sm"
                              style={{viewTransitionName: `food-price-${item.id}`}}
                            >
                              ${item.price}
                            </span>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={(e) => handleAddToCart(item.id, item.name, item.price, item.image, e)}
                              >
                                <ShoppingBag className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/food/${item.id}`);
                                }}
                              >
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
            <Link to="/menu">
              View Full Menu <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
