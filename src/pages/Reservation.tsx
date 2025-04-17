
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllMenuItems } from "@/data/menuData";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

const timeSlots = [
  "12:00 PM", 
  "12:30 PM", 
  "1:00 PM", 
  "1:30 PM", 
  "2:00 PM", 
  "5:00 PM", 
  "5:30 PM", 
  "6:00 PM", 
  "6:30 PM", 
  "7:00 PM", 
  "7:30 PM", 
  "8:00 PM", 
  "8:30 PM"
];

const Reservation = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [preorderTab, setPreorderTab] = useState("no");
  const [preorderItems, setPreorderItems] = useState<string[]>([]);
  const [availableItems, setAvailableItems] = useState(getAllMenuItems());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !date || !time || guests < 1) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const reservationData: ReservationData = {
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests: specialRequests || undefined,
      preorderItems: preorderTab === "yes" ? preorderItems : undefined
    };
    
    // Save to localStorage (this code was already in place)
    const existingReservations = JSON.parse(localStorage.getItem("reservations") || "[]");
    localStorage.setItem("reservations", JSON.stringify([...existingReservations, reservationData]));
    
    toast({
      title: "Reservation Confirmed!",
      description: `Your table has been reserved for ${format(date, "MMMM do, yyyy")} at ${time}.`,
    });
    
    setName("");
    setEmail("");
    setPhone("");
    setDate(undefined);
    setTime("");
    setGuests(2);
    setSpecialRequests("");
    setPreorderTab("no");
    setPreorderItems([]);
    
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handlePreorderChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setPreorderItems([...preorderItems, itemId]);
    } else {
      setPreorderItems(preorderItems.filter(id => id !== itemId));
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Reserve a Table</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Secure your spot for an unforgettable dining experience. 
              Pre-order your favorite dishes to have them ready upon arrival.
            </p>
          </div>
        </div>

        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Full Name*</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address*</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number*</Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="guests">Number of Guests*</Label>
                      <Input 
                        id="guests" 
                        type="number" 
                        min="1" 
                        max="20" 
                        value={guests} 
                        onChange={(e) => setGuests(parseInt(e.target.value))} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="requests">Special Requests (Optional)</Label>
                      <textarea 
                        id="requests" 
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        value={specialRequests} 
                        onChange={(e) => setSpecialRequests(e.target.value)} 
                        placeholder="Allergies, special occasions, seating preferences..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Reservation Details</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <Label>Date*</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label>Time Slot*</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot}
                            type="button"
                            variant={time === slot ? "default" : "outline"}
                            size="sm"
                            className="flex items-center justify-center"
                            onClick={() => setTime(slot)}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-xl">Would you like to pre-order?</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="no" value={preorderTab} onValueChange={setPreorderTab}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="no">No, thanks</TabsTrigger>
                            <TabsTrigger value="yes">Yes, pre-order</TabsTrigger>
                          </TabsList>
                          <TabsContent value="no" className="pt-2">
                            <p className="text-sm text-gray-600">
                              You can order upon arrival at the restaurant.
                            </p>
                          </TabsContent>
                          <TabsContent value="yes" className="pt-2">
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                              {availableItems.slice(0, 6).map((item) => (
                                <div key={item.id} className="flex items-start space-x-2">
                                  <Checkbox
                                    id={`item-${item.id}`}
                                    checked={preorderItems.includes(item.id)}
                                    onCheckedChange={(checked) => 
                                      handlePreorderChange(item.id, checked as boolean)
                                    }
                                  />
                                  <div className="grid gap-0.5 leading-none">
                                    <Label
                                      htmlFor={`item-${item.id}`}
                                      className="text-sm font-medium cursor-pointer"
                                    >
                                      {item.name}
                                    </Label>
                                    <p className="text-xs text-gray-500">${item.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button type="submit" size="lg" className="px-8">
                  Confirm Reservation
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Reservation;
