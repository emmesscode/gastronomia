import { useMemo, useState } from "react";
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
import { cn, formatCurrency, safeParseJSON } from "@/lib/utils";
import { getAllMenuItems } from "@/data/menuData";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroHeader from "@/components/layout/HeroHeader";

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
  "8:30 PM",
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const availableItems = getAllMenuItems();

  const selectedPreorders = useMemo(() => {
    const lookup = new Map(availableItems.map((item) => [item.id, item]));
    return preorderItems.map((id) => lookup.get(id)).filter(Boolean);
  }, [availableItems, preorderItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !date || !time || guests < 1) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
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
      preorderItems: preorderTab === "yes" ? preorderItems : undefined,
    };

    // Save to localStorage (this code was already in place)
    const existingReservations = safeParseJSON(localStorage.getItem("reservations"), []);
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
    setStep(1);

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handlePreorderChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setPreorderItems([...preorderItems, itemId]);
    } else {
      setPreorderItems(preorderItems.filter((id) => id !== itemId));
    }
  };

  const handleNext = () => {
    const nextErrors: Record<string, string> = {};
    if (step === 1) {
      if (!name || !email || !phone) {
        if (!name) nextErrors.name = "Full name is required.";
        if (!email) nextErrors.email = "Email is required.";
        if (!phone) nextErrors.phone = "Phone number is required.";
        toast({
          title: "Missing Information",
          description: "Add your contact details to continue.",
          variant: "destructive",
        });
        setFormErrors(nextErrors);
        return;
      }
    }

    if (step === 2) {
      if (!date || !time || guests < 1) {
        if (!date) nextErrors.date = "Select a date.";
        if (!time) nextErrors.time = "Select a time slot.";
        if (guests < 1) nextErrors.guests = "Guest count must be at least 1.";
        toast({
          title: "Missing Information",
          description: "Select a date, time, and guest count to continue.",
          variant: "destructive",
        });
        setFormErrors(nextErrors);
        return;
      }
    }

    setFormErrors({});
    setStep((prev) => Math.min(3, prev + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroHeader
          title="Reserve a Table"
          subtitle="Secure your spot for an unforgettable dining experience. Pre-order your favorite dishes to have them ready upon arrival."
        />

        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Reservation Flow</p>
                  <h2 className="text-2xl font-bold">Step {step} of 3</h2>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {[1, 2, 3].map((itemStep) => (
                    <div key={itemStep} className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-8 w-8 rounded-full border flex items-center justify-center font-semibold",
                          step >= itemStep ? "bg-primary text-white border-primary" : "text-gray-400 border-gray-200"
                        )}
                      >
                        {itemStep}
                      </span>
                      {itemStep !== 3 && <span className="h-px w-8 bg-gray-200" />}
                    </div>
                  ))}
                </div>
              </div>

              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Personal Information</h2>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Full Name*</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setFormErrors((prev) => ({ ...prev, name: "" }));
                          }}
                          required
                        />
                        {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address*</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setFormErrors((prev) => ({ ...prev, email: "" }));
                          }}
                          required
                        />
                        {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number*</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setFormErrors((prev) => ({ ...prev, phone: "" }));
                          }}
                          required
                        />
                        {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  <Card className="bg-gray-50 h-fit">
                    <CardHeader>
                      <CardTitle>What to expect</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-4">
                      <p>We’ll confirm your reservation via email and phone.</p>
                      <p>Add special requests in the next step to personalize your visit.</p>
                      <p>Pre-ordering lets our chefs prepare your favorites in advance.</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
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
                              onSelect={(nextDate) => {
                                setDate(nextDate);
                                setFormErrors((prev) => ({ ...prev, date: "" }));
                              }}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        {formErrors.date && <p className="text-xs text-red-500">{formErrors.date}</p>}
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
                              onClick={() => {
                                setTime(slot);
                                setFormErrors((prev) => ({ ...prev, time: "" }));
                              }}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {slot}
                            </Button>
                          ))}
                        </div>
                        {formErrors.time && <p className="text-xs text-red-500">{formErrors.time}</p>}
                      </div>

                      <div>
                        <Label htmlFor="guests">Number of Guests*</Label>
                        <Input
                          id="guests"
                          type="number"
                          min="1"
                          max="20"
                          value={guests}
                          onChange={(e) => {
                            setGuests(parseInt(e.target.value));
                            setFormErrors((prev) => ({ ...prev, guests: "" }));
                          }}
                          required
                        />
                        {formErrors.guests && <p className="text-xs text-red-500">{formErrors.guests}</p>}
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
                              <p className="text-sm text-gray-600">You can order upon arrival at the restaurant.</p>
                            </TabsContent>
                            <TabsContent value="yes" className="pt-2">
                              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {availableItems.slice(0, 6).map((item) => (
                                  <div key={item.id} className="flex items-start space-x-2">
                                    <Checkbox
                                      id={`item-${item.id}`}
                                      checked={preorderItems.includes(item.id)}
                                      onCheckedChange={(checked) => handlePreorderChange(item.id, checked as boolean)}
                                    />
                                    <div className="grid gap-0.5 leading-none">
                                      <Label htmlFor={`item-${item.id}`} className="text-sm font-medium cursor-pointer">
                                        {item.name}
                                      </Label>
                                      <p className="text-xs text-gray-500">{formatCurrency(item.price)}</p>
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

                  <Card className="bg-gray-50 h-fit sticky top-24">
                    <CardHeader>
                      <CardTitle>Reservation Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-4">
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium text-gray-900">Guest:</span> {name || "Not provided"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">Email:</span> {email || "Not provided"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">Phone:</span> {phone || "Not provided"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">Date:</span>{" "}
                          {date ? format(date, "MMMM do, yyyy") : "Not selected"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">Time:</span> {time || "Not selected"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">Guests:</span> {guests}
                        </p>
                      </div>
                      <div className="border-t pt-4 space-y-2">
                        <p>Choose a time slot that works best for your party.</p>
                        <p>Pre-ordered dishes will be prioritized when you arrive.</p>
                        <p>We accommodate special occasions and dietary needs.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Review Your Reservation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Guest Details</h3>
                          <div className="text-sm text-gray-600 space-y-2">
                            <p>
                              <span className="font-medium text-gray-900">Name:</span> {name}
                            </p>
                            <p>
                              <span className="font-medium text-gray-900">Email:</span> {email}
                            </p>
                            <p>
                              <span className="font-medium text-gray-900">Phone:</span> {phone}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Reservation Details</h3>
                          <div className="text-sm text-gray-600 space-y-2">
                            <p>
                              <span className="font-medium text-gray-900">Date:</span>{" "}
                              {date ? format(date, "MMMM do, yyyy") : "Not selected"}
                            </p>
                            <p>
                              <span className="font-medium text-gray-900">Time:</span> {time || "Not selected"}
                            </p>
                            <p>
                              <span className="font-medium text-gray-900">Guests:</span> {guests}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-3">Special Requests</h3>
                        <p className="text-sm text-gray-600">{specialRequests || "No special requests added."}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-3">Pre-ordered Items</h3>
                        {preorderTab === "yes" && selectedPreorders.length > 0 ? (
                          <ul className="text-sm text-gray-600 space-y-2">
                            {selectedPreorders.map((item) => (
                              <li key={item?.id} className="flex items-center justify-between">
                                <span>{item?.name}</span>
                                <span className="font-medium text-gray-900">{formatCurrency(item?.price ?? 0)}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-600">No pre-orders selected.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50 sticky top-24">
                    <CardHeader>
                      <CardTitle>At a Glance</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-2">
                      <p>
                        <span className="font-medium text-gray-900">Date:</span>{" "}
                        {date ? format(date, "MMMM do, yyyy") : "Not selected"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">Time:</span> {time || "Not selected"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">Guests:</span> {guests}
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">Pre-orders:</span>{" "}
                        {preorderTab === "yes" ? selectedPreorders.length : 0}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <Button type="submit" size="lg" className="px-8">
                      Confirm Reservation
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <Button type="button" variant="ghost" onClick={handleBack} disabled={step === 1}>
                  Back
                </Button>
                {step < 3 ? (
                  <Button type="button" size="lg" onClick={handleNext}>
                    Continue
                  </Button>
                ) : null}
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
