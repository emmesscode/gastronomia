
import { useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroHeader from "@/components/layout/HeroHeader";
import { getAllMenuItems } from "@/data/menuData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, safeParseJSON } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Define types for our stored data
interface OrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
  fulfillment?: "Delivery" | "Pickup";
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
  const [orderStartDate, setOrderStartDate] = useState("");
  const [orderEndDate, setOrderEndDate] = useState("");
  const [orderType, setOrderType] = useState("all");
  const [reservationStartDate, setReservationStartDate] = useState("");
  const [reservationEndDate, setReservationEndDate] = useState("");
  const { addToCart, clearCart } = useCart();
  const menuItemMap = useMemo(() => {
    return new Map(getAllMenuItems().map((item) => [item.id, item.name]));
  }, []);

  useEffect(() => {
    // Fetch orders from localStorage
    setOrders(safeParseJSON(localStorage.getItem("orders"), []));

    // Fetch reservations from localStorage
    setReservations(safeParseJSON(localStorage.getItem("reservations"), []));
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      const startOk = orderStartDate ? orderDate >= new Date(orderStartDate) : true;
      const endOk = orderEndDate ? orderDate <= new Date(`${orderEndDate}T23:59:59`) : true;
      const typeOk = orderType === "all" ? true : (order.fulfillment ?? "Delivery") === orderType;
      return startOk && endOk && typeOk;
    });
  }, [orders, orderStartDate, orderEndDate, orderType]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const reservationDate = new Date(reservation.date);
      const startOk = reservationStartDate ? reservationDate >= new Date(reservationStartDate) : true;
      const endOk = reservationEndDate ? reservationDate <= new Date(`${reservationEndDate}T23:59:59`) : true;
      return startOk && endOk;
    });
  }, [reservations, reservationStartDate, reservationEndDate]);

  const handleReorder = (order: OrderData) => {
    clearCart();
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i += 1) {
        addToCart({ id: item.id, name: item.name, price: item.price, image: item.image });
      }
    });
    toast.success("Order added to your cart.");
  };

  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        <HeroHeader
          title="My History"
          subtitle="View your past orders and reservations"
        />

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
                <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <label className="font-medium text-gray-700">Order start date</label>
                      <input
                        type="date"
                        className="w-full rounded-md border px-3 py-2"
                        value={orderStartDate}
                        onChange={(event) => setOrderStartDate(event.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-medium text-gray-700">Order end date</label>
                      <input
                        type="date"
                        className="w-full rounded-md border px-3 py-2"
                        value={orderEndDate}
                        onChange={(event) => setOrderEndDate(event.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-medium text-gray-700">Order type</label>
                      <select
                        className="w-full rounded-md border px-3 py-2"
                        value={orderType}
                        onChange={(event) => setOrderType(event.target.value)}
                      >
                        <option value="all">All</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Pickup">Pickup</option>
                      </select>
                    </div>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {filteredOrders.map((order, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>Order: #{index + 1}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {order.date ? new Date(order.date).toLocaleString() : "Date not available"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.fulfillment ?? "Delivery"}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge>{order.items.reduce((total, item) => total + item.quantity, 0)} items</Badge>
                              <Button size="sm" variant="outline" onClick={() => handleReorder(order)}>
                                Reorder
                              </Button>
                            </div>
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
                                      <TableCell className="text-right">{formatCurrency(item.price ?? 0)}</TableCell>
                                      <TableCell className="text-right">
                                        {formatCurrency((item.price ?? 0) * (item.quantity ?? 0))}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                                    <TableCell className="text-right font-bold">
                                      {formatCurrency(order.totalPrice ?? 0)}
                                    </TableCell>
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
                <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <label className="font-medium text-gray-700">Reservation start date</label>
                      <input
                        type="date"
                        className="w-full rounded-md border px-3 py-2"
                        value={reservationStartDate}
                        onChange={(event) => setReservationStartDate(event.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-medium text-gray-700">Reservation end date</label>
                      <input
                        type="date"
                        className="w-full rounded-md border px-3 py-2"
                        value={reservationEndDate}
                        onChange={(event) => setReservationEndDate(event.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {filteredReservations.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-muted-foreground">You haven't made any reservations yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {filteredReservations.map((reservation, index) => (
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
                                    {reservation.preorderItems.map((itemId, itemIndex) => (
                                      <li key={itemIndex}>{menuItemMap.get(itemId) ?? itemId}</li>
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
    </div>
  );
};

export default MyHistory;
