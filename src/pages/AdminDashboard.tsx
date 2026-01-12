import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroHeader from "@/components/layout/HeroHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, safeParseJSON } from "@/lib/utils";

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

const AdminDashboard = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [reservations, setReservations] = useState<ReservationData[]>([]);

  useEffect(() => {
    setOrders(safeParseJSON(localStorage.getItem("orders"), []));
    setReservations(safeParseJSON(localStorage.getItem("reservations"), []));
  }, []);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalReservations = reservations.length;
    const revenue = orders.reduce((sum, order) => sum + (order.totalPrice ?? 0), 0);
    const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

    return {
      totalOrders,
      totalReservations,
      revenue,
      averageOrderValue,
    };
  }, [orders, reservations]);

  const topItems = useMemo(() => {
    const tally = new Map<string, { name: string; count: number }>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = tally.get(item.id);
        if (existing) {
          existing.count += item.quantity ?? 1;
        } else {
          tally.set(item.id, { name: item.name, count: item.quantity ?? 1 });
        }
      });
    });

    return Array.from(tally.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [orders]);

  const recentReservations = useMemo(() => {
    return [...reservations]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [reservations]);

  const activityByDay = useMemo(() => {
    const days = [...Array(7)].map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toLocaleDateString();
      return { key, label: date.toLocaleDateString("en-US", { weekday: "short" }), orders: 0, reservations: 0 };
    });

    const dayMap = new Map(days.map((day) => [day.key, day]));

    orders.forEach((order) => {
      const key = new Date(order.date).toLocaleDateString();
      const day = dayMap.get(key);
      if (day) day.orders += 1;
    });

    reservations.forEach((reservation) => {
      const key = new Date(reservation.date).toLocaleDateString();
      const day = dayMap.get(key);
      if (day) day.reservations += 1;
    });

    return days;
  }, [orders, reservations]);

  const maxActivity = Math.max(
    1,
    ...activityByDay.map((day) => Math.max(day.orders, day.reservations))
  );

  const getBarHeight = (value: number) => {
    const scaled = (value / maxActivity) * 96;
    return `${Math.max(8, scaled)}px`;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroHeader
          title="Admin Dashboard"
          subtitle="Monitor performance, reservations, and order activity in one place."
        />

        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 space-y-10">
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.totalOrders}</div>
                  <p className="text-sm text-muted-foreground">Orders placed to date</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Reservations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.totalReservations}</div>
                  <p className="text-sm text-muted-foreground">Tables booked to date</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(metrics.revenue)}</div>
                  <p className="text-sm text-muted-foreground">Total order value</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(metrics.averageOrderValue)}</div>
                  <p className="text-sm text-muted-foreground">Per-order average</p>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Activity (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-4 items-end h-44">
                    {activityByDay.map((day) => (
                      <div key={day.key} className="flex flex-col items-center gap-2">
                        <div className="flex flex-col items-center gap-2 w-full h-28 justify-end">
                          <div
                            className="w-full rounded-md bg-primary/80"
                            style={{ height: getBarHeight(day.orders) }}
                          />
                          <div
                            className="w-full rounded-md bg-amber-400"
                            style={{ height: getBarHeight(day.reservations) }}
                          />
                        </div>
                        <div className="text-xs font-medium text-muted-foreground">{day.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary/80" /> Orders
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400" /> Reservations
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {topItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No order data yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {topItems.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Rank #{index + 1}</p>
                          </div>
                          <Badge variant="secondary">{item.count} sold</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No orders yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order, index) => (
                        <div key={`${order.email}-${index}`} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{order.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.date).toLocaleString()}
                            </p>
                          </div>
                          <Badge>{formatCurrency(order.totalPrice ?? 0)}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Reservations</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentReservations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reservations yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {recentReservations.map((reservation, index) => (
                        <div key={`${reservation.email}-${index}`} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{reservation.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(reservation.date).toLocaleDateString()} · {reservation.time}
                            </p>
                          </div>
                          <Badge variant="secondary">{reservation.guests} guests</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboard;
