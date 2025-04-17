
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { getAllMenuItems } from "@/data/menuData";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, ShoppingBag } from "lucide-react";

// Define the schema for delivery information
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter your full address." }),
});

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

const Order = () => {
  // Get all menu items to display in the order page
  const menuItems = getAllMenuItems();
  
  // State for items in cart
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  
  // Form for delivery information
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Add item to cart or increase quantity
  const addToCart = (item: { id: string; name: string; price: number; image?: string }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Increase quantity if already in cart
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    toast.success(`Added ${item.name} to cart`);
  };

  // Remove one item from cart or decrease quantity
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity
        return prevCart.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      } else {
        // Remove item entirely
        return prevCart.filter(item => item.id !== itemId);
      }
    });
  };

  // Calculate total price of items in cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, we would send this to a backend
    console.log("Order submitted:", { customer: values, items: cart, total: calculateTotal() });
    
    // Show success message and reset cart
    toast.success("Your order has been placed! We'll contact you shortly.", {
      duration: 5000,
    });
    
    setOrderSubmitted(true);
    setCart([]);
    form.reset();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="relative py-16 md:py-20 bg-gray-900 text-white top-0 absolute w-full">
          <div 
            className="absolute inset-0 bg-fixed opacity-20" 
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1500)",
              backgroundSize: "cover",
              backgroundPosition: "top",
            }}
          ></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Order Online</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Enjoy our delicious meals from the comfort of your home.
              Fresh, high-quality ingredients delivered right to your doorstep.
            </p>
          </div>
        </div>

        {/* Order Content - Adjusted top margin to account for absolute header */}
        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            {orderSubmitted ? (
              <div className="text-center py-10">
                <h2 className="text-3xl font-bold mb-4">Thank You for Your Order!</h2>
                <p className="mb-6">Your order has been received and is being processed.</p>
                <Button 
                  onClick={() => setOrderSubmitted(false)}
                  className="mt-4"
                >
                  Place Another Order
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {/* Menu Items Column */}
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold mb-6">Menu</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {menuItems.map((item) => (
                      <Card 
                        key={item.id} 
                        className="overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="w-full h-32 relative">
                          <AspectRatio ratio={4/3} className="bg-muted">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                                No image
                              </div>
                            )}
                          </AspectRatio>
                        </div>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium text-sm truncate">{item.name}</h3>
                            <span className="font-bold text-sm">${item.price}</span>
                          </div>
                          <p className="text-gray-600 text-xs mb-2 line-clamp-1">{item.description}</p>
                          <Button 
                            size="sm" 
                            className="w-full mt-1 text-xs h-7 px-2"
                            onClick={() => addToCart({ 
                              id: item.id, 
                              name: item.name, 
                              price: item.price,
                              image: item.image
                            })}
                          >
                            Add to Order
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Cart and Checkout Column */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm h-fit sticky top-20">
                  <div className="flex items-center gap-2 mb-6">
                    <ShoppingBag className="h-5 w-5" />
                    <h2 className="text-2xl font-bold">Your Order</h2>
                  </div>
                  
                  {cart.length === 0 ? (
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="divide-y mb-4">
                        {cart.map((item) => (
                          <div key={item.id} className="py-3 flex items-center">
                            {item.image && (
                              <div className="w-12 h-12 mr-3 rounded overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-grow min-w-0">
                              <p className="font-medium text-sm truncate">{item.name}</p>
                              <p className="text-xs text-gray-600">${item.price} each</p>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center text-sm">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => addToCart({ 
                                  id: item.id, 
                                  name: item.name, 
                                  price: item.price,
                                  image: item.image
                                })}
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
                          <span>${calculateTotal()}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Delivery Information Form */}
                  <div className="mt-6">
                    <h3 className="font-bold text-lg mb-4">Delivery Information</h3>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="(123) 456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St, City, State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={cart.length === 0}
                        >
                          Place Order
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Order;
