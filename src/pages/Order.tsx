
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Utensils, Wine, CakeSlice, ShoppingCart, Trash2, Plus, Minus, CreditCard, Landmark, CreditCardIcon } from "lucide-react";
import { foodItems, dessertItems, drinkItems, getAllMenuItems, MenuItem } from "@/data/menuData";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface CartItem extends MenuItem {
  quantity: number;
}

interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes?: string;
}

const Order = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("food");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    notes: ""
  });
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "cash" | "revolut">("credit-card");
  const [currentStep, setCurrentStep] = useState<"menu" | "delivery" | "payment">("menu");

  // Calculate total amount
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 5;
  const totalAmount = cartTotal + deliveryFee;

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      // Check if item is already in cart
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, increase quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + 1
        };
        return newCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleDeliveryInfoChange = (field: keyof DeliveryInfo, value: string) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = () => {
    // Validate
    if (currentStep === "delivery") {
      if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.zipCode) {
        toast({
          title: "Missing information",
          description: "Please fill in all required delivery information.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep("payment");
      return;
    }
    
    if (currentStep === "payment") {
      // Save order to localStorage
      const order = {
        items: cart,
        deliveryInfo,
        paymentMethod,
        total: totalAmount,
        orderDate: new Date().toISOString()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify([...existingOrders, order]));
      
      // Show success message
      toast({
        title: "Order Confirmed!",
        description: "Your order has been placed successfully."
      });
      
      // Reset form and navigate
      setCart([]);
      setCurrentStep("menu");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        {/* Hero Section */}
        <div className="relative py-16 md:py-24 bg-gray-900 text-white">
          <div 
            className="absolute inset-0 bg-fixed opacity-20" 
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1500)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Order Online</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Enjoy our delicious dishes in the comfort of your home. 
              Easy ordering, fast delivery.
            </p>
          </div>
        </div>

        {/* Order Content */}
        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Menu Selection (2/3 width on desktop) */}
              <div className={`lg:col-span-2 ${currentStep !== "menu" ? "hidden lg:block" : ""}`}>
                {currentStep === "menu" && (
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
                      <div className="space-y-8">
                        {foodItems.map((category) => (
                          <div key={category.name}>
                            <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                              {category.items.map((item) => (
                                <Card key={item.id} className="overflow-hidden">
                                  <div className="h-40 overflow-hidden">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <CardHeader className="p-4 pb-0">
                                    <div className="flex justify-between">
                                      <CardTitle className="text-lg">{item.name}</CardTitle>
                                      <span className="font-bold">${item.price}</span>
                                    </div>
                                    <CardDescription>{item.description}</CardDescription>
                                  </CardHeader>
                                  <CardFooter className="p-4 pt-2">
                                    <Button 
                                      onClick={() => addToCart(item)} 
                                      className="w-full"
                                    >
                                      Add to Cart
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="drinks" className="animate-fade-in">
                      <div className="space-y-8">
                        {drinkItems.map((category) => (
                          <div key={category.name}>
                            <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                              {category.items.map((item) => (
                                <Card key={item.id} className="overflow-hidden">
                                  <div className="h-40 overflow-hidden">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <CardHeader className="p-4 pb-0">
                                    <div className="flex justify-between">
                                      <CardTitle className="text-lg">{item.name}</CardTitle>
                                      <span className="font-bold">${item.price}</span>
                                    </div>
                                    <CardDescription>{item.description}</CardDescription>
                                  </CardHeader>
                                  <CardFooter className="p-4 pt-2">
                                    <Button 
                                      onClick={() => addToCart(item)} 
                                      className="w-full"
                                    >
                                      Add to Cart
                                    </Button>
                                  </CardFooter>
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
                          <div key={category.name}>
                            <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                              {category.items.map((item) => (
                                <Card key={item.id} className="overflow-hidden">
                                  <div className="h-40 overflow-hidden">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <CardHeader className="p-4 pb-0">
                                    <div className="flex justify-between">
                                      <CardTitle className="text-lg">{item.name}</CardTitle>
                                      <span className="font-bold">${item.price}</span>
                                    </div>
                                    <CardDescription>{item.description}</CardDescription>
                                  </CardHeader>
                                  <CardFooter className="p-4 pt-2">
                                    <Button 
                                      onClick={() => addToCart(item)} 
                                      className="w-full"
                                    >
                                      Add to Cart
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}

                {currentStep === "delivery" && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name*</Label>
                        <Input 
                          id="name" 
                          value={deliveryInfo.name} 
                          onChange={(e) => handleDeliveryInfoChange("name", e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number*</Label>
                        <Input 
                          id="phone" 
                          value={deliveryInfo.phone} 
                          onChange={(e) => handleDeliveryInfoChange("phone", e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address*</Label>
                        <Input 
                          id="address" 
                          value={deliveryInfo.address} 
                          onChange={(e) => handleDeliveryInfoChange("address", e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="city">City*</Label>
                        <Input 
                          id="city" 
                          value={deliveryInfo.city} 
                          onChange={(e) => handleDeliveryInfoChange("city", e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="zipCode">Zip Code*</Label>
                        <Input 
                          id="zipCode" 
                          value={deliveryInfo.zipCode} 
                          onChange={(e) => handleDeliveryInfoChange("zipCode", e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                        <textarea 
                          id="notes" 
                          className="w-full min-h-[100px] p-2 border rounded-md"
                          value={deliveryInfo.notes} 
                          onChange={(e) => handleDeliveryInfoChange("notes", e.target.value)} 
                          placeholder="Any special instructions for delivery..."
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-col md:flex-row gap-4 justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep("menu")}
                      >
                        Back to Menu
                      </Button>
                      <Button onClick={handleSubmitOrder}>
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === "payment" && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <Card 
                        className={`cursor-pointer transition-all ${paymentMethod === "credit-card" ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                        onClick={() => setPaymentMethod("credit-card")}
                      >
                        <CardHeader className="text-center">
                          <CreditCardIcon className="w-10 h-10 mx-auto" />
                          <CardTitle className="text-lg">Credit Card</CardTitle>
                        </CardHeader>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer transition-all ${paymentMethod === "cash" ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <CardHeader className="text-center">
                          <Landmark className="w-10 h-10 mx-auto" />
                          <CardTitle className="text-lg">Cash on Delivery</CardTitle>
                        </CardHeader>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer transition-all ${paymentMethod === "revolut" ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                        onClick={() => setPaymentMethod("revolut")}
                      >
                        <CardHeader className="text-center">
                          <svg 
                            viewBox="0 0 16 16" 
                            className="w-10 h-10 mx-auto fill-current" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm3.712 11.208H7.728c-1.536 0-2.784-1.232-2.784-2.784 0-1.024.544-1.84 1.344-2.288-.432-.288-.736-.784-.736-1.376 0-.896.72-1.616 1.6-1.616H11.2v8.064h.512z" />
                          </svg>
                          <CardTitle className="text-lg">Revolut</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                    
                    {/* Order Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500 ml-2">x{item.quantity}</span>
                            </div>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Delivery Fee</span>
                            <span>${deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg mt-2">
                            <span>Total</span>
                            <span>${totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-6 flex flex-col md:flex-row gap-4 justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep("delivery")}
                      >
                        Back to Delivery Info
                      </Button>
                      <Button onClick={handleSubmitOrder}>
                        Place Order
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Cart (1/3 width on desktop) */}
              <div className={`lg:sticky lg:top-20 lg:h-fit ${currentStep !== "menu" && !cart.length ? "hidden lg:block" : ""}`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Your Order ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cart.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500">Your cart is empty</p>
                        <p className="text-sm mt-2">Add some delicious items from our menu!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between items-center pb-2 border-b">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Delivery Fee</span>
                            <span>${deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg mt-2">
                            <span>Total</span>
                            <span>${totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  {cart.length > 0 && currentStep === "menu" && (
                    <CardFooter>
                      <Button 
                        onClick={() => setCurrentStep("delivery")} 
                        className="w-full"
                      >
                        Proceed to Checkout
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Order;
