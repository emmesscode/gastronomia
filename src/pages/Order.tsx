import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { getAllMenuItems } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroHeader from "@/components/layout/HeroHeader";
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
import { Minus, Plus, ShoppingBag, ShoppingCart, Sparkles, Info } from "lucide-react";
import { formatCurrency, safeParseJSON } from "@/lib/utils";

// Define the schema for delivery information
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter your full address." }),
  specialRequests: z.string().optional(),
});

const getItemType = (itemId: string): string => {
  if (itemId.startsWith("f")) return "Food";
  if (itemId.startsWith("d")) return "Dessert";
  if (itemId.startsWith("w")) return "Wine";
  if (itemId.startsWith("c")) return "Cocktail";
  if (itemId.startsWith("n")) return "Non-Alcoholic";
  return "Menu Item";
};

const Order = () => {
  // Get all menu items to display in the order page
  const menuItems = getAllMenuItems();
  const navigate = useNavigate();

  // Get cart state and methods from context
  const { cart, addToCart, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const subtotal = getTotalPrice();
  const taxRate = 0.08;
  const taxes = subtotal * taxRate;
  const deliveryFee = subtotal > 0 ? 4.5 : 0;
  const orderTotal = subtotal + taxes + deliveryFee;

  const recommendations = useMemo(() => {
    const cartIds = new Set(cart.map((item) => item.id));
    const cartTypes = new Set(cart.map((item) => getItemType(item.id)));
    const hasFood = cartTypes.has("Food");
    const hasDessert = cartTypes.has("Dessert");
    const hasDrink = cartTypes.has("Wine") || cartTypes.has("Cocktail") || cartTypes.has("Non-Alcoholic");

    let desiredTypes: string[] = [];
    if (hasFood && !hasDessert) desiredTypes.push("Dessert");
    if (hasFood && !hasDrink) desiredTypes.push("Wine", "Cocktail", "Non-Alcoholic");
    if (!hasFood && !hasDessert && !hasDrink) {
      desiredTypes = ["Food", "Dessert", "Wine", "Cocktail", "Non-Alcoholic"];
    }

    return menuItems
      .filter((item) => !cartIds.has(item.id))
      .filter((item) => desiredTypes.includes(getItemType(item.id)))
      .slice(0, 4);
  }, [cart, menuItems]);

  // Form for delivery information
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      specialRequests: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, we would send this to a backend
    console.log("Order submitted:", { customer: values, items: cart, total: getTotalPrice() });

    // Save the order to localStorage
    const orderData = {
      ...values,
      items: cart,
      totalPrice: getTotalPrice() || 0, // Add fallback to prevent undefined
      date: new Date().toISOString(),
      fulfillment: "Delivery",
    };

    const existingOrders = safeParseJSON(localStorage.getItem("orders"), []);
    localStorage.setItem("orders", JSON.stringify([...existingOrders, orderData]));

    // Show success message and reset cart
    toast.success("Your order has been placed! We'll contact you shortly.", {
      duration: 5000,
    });

    setOrderSubmitted(true);
    clearCart();
    form.reset();
  };

  // Handle adding an item to the cart
  const handleAddToCart = (item: { id: string; name: string; price: number; image?: string }) => {
    addToCart(item);
    toast.success(`Added ${item.name} to cart`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroHeader
          title="Order Online"
          subtitle="Enjoy our delicious meals from the comfort of your home. Fresh, high-quality ingredients delivered right to your doorstep."
        />

        {/* Order Content - Adjusted top margin to account for absolute header */}
        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            {orderSubmitted ? (
              <div className="text-center py-10">
                <h2 className="text-3xl font-bold mb-4">Thank You for Your Order!</h2>
                <p className="mb-6">Your order has been received and is being processed.</p>
                <Button onClick={() => setOrderSubmitted(false)} className="mt-4">
                  Place Another Order
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {/* Menu Items Column */}
                <div className="md:col-span-2 space-y-8">
                  {recommendations.length > 0 && (
                    <Card className="border-amber-200 bg-amber-50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-5 w-5 text-amber-600" />
                          <h2 className="text-xl font-bold text-amber-900">Recommended Add-ons</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {recommendations.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg border border-amber-100 p-3 flex h-full flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-sm text-amber-900">{item.name}</p>
                                  <p className="text-xs text-amber-700">{formatCurrency(item.price)}</p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => navigate(`/food/${item.id}`)}
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                className="w-full mt-auto"
                                onClick={() =>
                                  handleAddToCart({
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image,
                                  })
                                }
                              >
                                Add to Order
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <h2 className="text-2xl font-bold mb-6">Menu</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {menuItems.map((item) => (
                        <Card
                          key={item.id}
                          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(`/food/${item.id}`)}
                        >
                          <div className="w-full h-32 relative">
                            <AspectRatio ratio={4 / 3} className="bg-muted">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="object-cover w-full h-full"
                                  style={{ viewTransitionName: `food-image-${item.id}` }}
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                                  No image
                                </div>
                              )}
                            </AspectRatio>
                          </div>
                          <CardContent className="p-3 mt-6">
                            <div className="flex justify-between items-start mb-1">
                              <h3
                                className="font-medium text-sm truncate"
                                style={{ viewTransitionName: `food-title-${item.id}` }}
                              >
                                {item.name}
                              </h3>
                              <span
                                className="font-bold text-sm"
                                style={{ viewTransitionName: `food-price-${item.id}` }}
                              >
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs mb-2 line-clamp-1">{item.description}</p>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="default"
                                className="w-full mt-1 text-xs h-7 px-2 flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart({
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image,
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
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
                              <div
                                className="w-12 h-12 mr-3 rounded overflow-hidden flex-shrink-0 cursor-pointer"
                                onClick={() => navigate(`/food/${item.id}`)}
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  style={{ viewTransitionName: `food-image-${item.id}` }}
                                />
                              </div>
                            )}
                            <div
                              className="flex-grow min-w-0 cursor-pointer"
                              onClick={() => navigate(`/food/${item.id}`)}
                            >
                              <p
                                className="font-medium text-sm truncate"
                                style={{ viewTransitionName: `food-title-${item.id}` }}
                              >
                                {item.name}
                              </p>
                              <p
                                className="text-xs text-gray-600"
                                style={{ viewTransitionName: `food-price-${item.id}` }}
                              >
                                {formatCurrency(item.price)} each
                              </p>
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
                                onClick={() =>
                                  addToCart({
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image,
                                  })
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 mb-6">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Delivery Information Form */}
                  <div className="mt-6">
                    <h3 className="font-bold text-lg mb-4">Delivery Information</h3>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="delivery-form">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name*</FormLabel>
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
                              <FormLabel>Email*</FormLabel>
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
                              <FormLabel>Phone*</FormLabel>
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
                              <FormLabel>Delivery Address*</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St, City, State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="specialRequests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Special Requests (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Leave at the door, don't deliver before 16pm, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Estimated taxes</span>
                            <span className="font-medium">{formatCurrency(taxes)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Delivery fee</span>
                            <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t pt-3 text-base font-semibold">
                            <span>Order total</span>
                            <span>{formatCurrency(orderTotal)}</span>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            Estimated delivery time: 35–45 minutes.
                          </p>
                        </div>
                        <Button type="submit" className="w-full" disabled={cart.length === 0}>
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
        {!orderSubmitted && cart.length > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur md:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
                <p className="text-lg font-semibold">{formatCurrency(orderTotal)}</p>
              </div>
              <Button
                onClick={() => {
                  const formElement = document.getElementById("delivery-form");
                  formElement?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Order;
