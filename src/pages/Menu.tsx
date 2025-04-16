
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Utensils, Wine, CakeSlice } from "lucide-react";
import { foodItems, dessertItems, drinkItems } from "@/data/menuData";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Menu = () => {
  const [activeTab, setActiveTab] = useState("food");

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        {/* Header */}
        <div className="relative py-16 md:py-24 bg-gray-900 text-white">
          <div 
            className="absolute inset-0 bg-fixed opacity-20" 
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1500)",
              backgroundSize: "cover",
              backgroundPosition: "center",
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

        {/* Menu Content */}
        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="food" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                <TabsTrigger value="food" className="flex items-center justify-center gap-2 py-3">
                  <Utensils className="h-4 w-4" />
                  <span>Food</span>
                </TabsTrigger>
                <TabsTrigger value="drinks" className="flex items-center justify-center gap-2 py-3">
                  <Wine className="h-4 w-4" />
                  <span>Drinks</span>
                </TabsTrigger>
                <TabsTrigger value="desserts" className="flex items-center justify-center gap-2 py-3">
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
                          <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={item.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800"} 
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-xl">{item.name}</h3>
                                <span className="font-bold text-lg">${item.price}</span>
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
                          <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={item.image || "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800"} 
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-xl">{item.name}</h3>
                                <span className="font-bold text-lg">${item.price}</span>
                              </div>
                              <p className="text-gray-600 mt-2">{item.description}</p>
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
                          <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={item.image || "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800"} 
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-xl">{item.name}</h3>
                                <span className="font-bold text-lg">${item.price}</span>
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
