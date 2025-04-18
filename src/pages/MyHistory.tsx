
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define types for our stored data
interface OrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  totalPrice: number;
  date: string;
}

interface ReservationData {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  specialRequests?: string;
  preorderItems?: string[];
}

const MyHistory = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    // Fetch orders from localStorage
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (error) {
        console.error("Failed to parse orders from localStorage:", error);
      }
    }

    // Fetch reservations from localStorage
    const storedReservations = localStorage.getItem("reservations");
    if (storedReservations) {
      try {
        setReservations(JSON.parse(storedReservations));
      } catch (error) {
        console.error("Failed to parse reservations from localStorage:", error);
      }
    }
  }, []);

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My History</h1>
            <p className="max-w-2xl mx-auto text-lg">
              View your past orders and reservations
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="reservations">Reservations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <h2 className="text-2xl font-bold mb-6 text-center">Order History</h2>
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>Order: #{index + 1}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {order.date ? new Date(order.date).toLocaleString() : "Date not available"}
                              </p>
                            </div>
                            <Badge>{order.items.reduce((total, item) => total + item.quantity, 0)} items</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Customer Information</h4>
                              <div className="text-sm">
                                <p><span className="font-medium">Name:</span> {order.name}</p>
                                <p><span className="font-medium">Email:</span> {order.email}</p>
                                <p><span className="font-medium">Phone:</span> {order.phone}</p>
                                <p><span className="font-medium">Address:</span> {order.address}</p>
                                {order.message && (
                                  <p><span className="font-medium">Message:</span> {order.message}</p>
                                )}
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h4 className="font-medium mb-2">Order Items</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item, itemIndex) => (
                                    <TableRow key={itemIndex}>
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell className="text-right">{item.quantity}</TableCell>
                                      <TableCell className="text-right">${item.price ? item.price.toFixed(2) : '0.00'}</TableCell>
                                      <TableCell className="text-right">${(item.price && item.quantity) ? (item.price * item.quantity).toFixed(2) : '0.00'}</TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                                    <TableCell className="text-right font-bold">${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reservations">
                <h2 className="text-2xl font-bold mb-6 text-center">Reservation History</h2>
                {reservations.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-muted-foreground">You haven't made any reservations yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {reservations.map((reservation, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>Reservation #{index + 1}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {reservation.date && format(new Date(reservation.date), "MMMM d, yyyy")} at {reservation.time}
                              </p>
                            </div>
                            <Badge>{reservation.guests} guests</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Guest Information</h4>
                              <div className="text-sm">
                                <p><span className="font-medium">Name:</span> {reservation.name}</p>
                                <p><span className="font-medium">Email:</span> {reservation.email}</p>
                                <p><span className="font-medium">Phone:</span> {reservation.phone}</p>
                                {reservation.specialRequests && (
                                  <p><span className="font-medium">Special Requests:</span> {reservation.specialRequests}</p>
                                )}
                              </div>
                            </div>
                            
                            {reservation.preorderItems && reservation.preorderItems.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-medium mb-2">Pre-ordered Items</h4>
                                  <ul className="list-disc pl-5 text-sm">
                                    {
                                      console.log(reservation)
                                      reservation.preorderItems.map((item, itemIndex) => (
                                      <li key={itemIndex}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyHistory;
