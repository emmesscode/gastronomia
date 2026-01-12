import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addHours, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, CalendarPlus, CheckCircle2, Clock, Share2, Sparkles, Users2 } from "lucide-react";
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
  tableSelection?: string;
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

const tableOptions = [
  {
    id: "window-two",
    name: "Window for Two",
    description: "Intimate setting with skyline views.",
    capacity: "2 guests",
  },
  {
    id: "chef-counter",
    name: "Chef’s Counter",
    description: "Front-row seats to the culinary action.",
    capacity: "2-3 guests",
  },
  {
    id: "booth-four",
    name: "Signature Booth",
    description: "Plush seating for a relaxed evening.",
    capacity: "4 guests",
  },
  {
    id: "private-six",
    name: "Private Alcove",
    description: "Semi-private corner with ambient lighting.",
    capacity: "5-6 guests",
  },
];

const availabilityLevels = {
  available: {
    label: "Available",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-200",
    button: "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
  },
  limited: {
    label: "Limited",
    badge: "bg-amber-50 text-amber-600 border-amber-200",
    button: "border-amber-200 text-amber-700 hover:bg-amber-50",
  },
  full: {
    label: "Fully booked",
    badge: "bg-gray-100 text-gray-500 border-gray-200",
    button: "border-gray-200 text-gray-400 cursor-not-allowed",
  },
};

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
  const [tableSelection, setTableSelection] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const availableItems = getAllMenuItems();

  const availabilityBySlot = useMemo(() => {
    const baseSeed = date ? date.getDate() + date.getMonth() * 31 : 0;
    return timeSlots.reduce<Record<string, keyof typeof availabilityLevels>>((acc, slot, index) => {
      const rawScore = (baseSeed + index + guests * 3) % 9;
      if (!date) {
        acc[slot] = "available";
      } else if (rawScore < 4) {
        acc[slot] = "available";
      } else if (rawScore < 7) {
        acc[slot] = "limited";
      } else {
        acc[slot] = "full";
      }
      return acc;
    }, {});
  }, [date, guests]);

  const selectedPreorders = useMemo(() => {
    const lookup = new Map(availableItems.map((item) => [item.id, item]));
    return preorderItems.map((id) => lookup.get(id)).filter(Boolean);
  }, [availableItems, preorderItems]);

  const chefPicks = useMemo(() => availableItems.slice(0, 4), [availableItems]);

  const reservationDateTime = useMemo(() => {
    if (!date || !time) return null;
    const [clock, meridiem] = time.split(" ");
    const [hourString, minuteString] = clock.split(":");
    let hours = Number(hourString);
    const minutes = Number(minuteString);
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    const nextDate = new Date(date);
    nextDate.setHours(hours, minutes, 0, 0);
    return nextDate;
  }, [date, time]);

  const calendarHref = useMemo(() => {
    if (!reservationDateTime) return "#";
    const endTime = addHours(reservationDateTime, 2);
    const start = format(reservationDateTime, "yyyyMMdd'T'HHmmss");
    const end = format(endTime, "yyyyMMdd'T'HHmmss");
    const details = encodeURIComponent("Your Gastronomia table is confirmed. We look forward to hosting you.");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Gastronomia%20Reservation&dates=${start}/${end}&details=${details}`;
  }, [reservationDateTime]);

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
      tableSelection: tableSelection || undefined,
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
    setTableSelection("");
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

  const handleShare = async () => {
    const summary = `Gastronomia reservation for ${name || "guest"} on ${
      date ? format(date, "MMMM do, yyyy") : "TBD"
    } at ${time || "TBD"} for ${guests} guests.`;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(summary);
      toast({ title: "Reservation details copied", description: "Share your reservation with a friend." });
      return;
    }
    toast({
      title: "Share",
      description: "Copy your reservation details manually from the summary panel.",
    });
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                          {timeSlots.map((slot) => {
                            const availability = availabilityBySlot[slot];
                            const isFull = availability === "full";
                            return (
                              <Button
                                key={slot}
                                type="button"
                                variant={time === slot ? "default" : "outline"}
                                size="sm"
                                disabled={isFull}
                                className={cn(
                                  "flex items-center justify-center border text-xs font-semibold transition",
                                  time === slot ? "border-primary" : availabilityLevels[availability].button
                                )}
                                onClick={() => {
                                  setTime(slot);
                                  setFormErrors((prev) => ({ ...prev, time: "" }));
                                }}
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {slot}
                              </Button>
                            );
                          })}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3 text-xs">
                          {Object.entries(availabilityLevels).map(([key, value]) => (
                            <span
                              key={key}
                              className={cn(
                                "inline-flex items-center gap-2 border rounded-full px-3 py-1 font-medium",
                                value.badge
                              )}
                            >
                              <span className="h-2 w-2 rounded-full bg-current" />
                              {value.label}
                            </span>
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

                      <Card className="border border-dashed">
                        <CardHeader>
                          <CardTitle className="text-xl">Choose your table</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {tableOptions.map((table) => (
                            <button
                              type="button"
                              key={table.id}
                              onClick={() => setTableSelection(table.id)}
                              className={cn(
                                "w-full rounded-xl border px-4 py-3 text-left transition hover:border-primary",
                                tableSelection === table.id ? "border-primary bg-primary/5" : "border-gray-200"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">{table.name}</p>
                                  <p className="text-xs text-gray-500">{table.description}</p>
                                </div>
                                <span className="text-xs font-semibold text-gray-500">{table.capacity}</span>
                              </div>
                            </button>
                          ))}
                        </CardContent>
                      </Card>

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

                      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Sparkles className="h-5 w-5 text-amber-300" />
                            Chef’s Tasting Highlights
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                          {chefPicks.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <span>{item.name}</span>
                              <span className="font-semibold text-amber-200">{formatCurrency(item.price)}</span>
                            </div>
                          ))}
                          <p className="text-xs text-gray-200">
                            Add any of these to your pre-order for white-glove service.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Card className="bg-gray-50 h-fit sticky top-24">
                    <CardHeader>
                      <CardTitle>Reservation Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-4">
                      <div className="flex items-center gap-2 rounded-lg border border-white/40 bg-white p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Users2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-400">Party size</p>
                          <p className="font-semibold text-gray-900">{guests} guests</p>
                        </div>
                      </div>
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
                        <p>
                          <span className="font-medium text-gray-900">Table:</span>{" "}
                          {tableOptions.find((table) => table.id === tableSelection)?.name || "Not selected"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">Availability:</span>{" "}
                          {time ? availabilityLevels[availabilityBySlot[time]].label : "Select a time"}
                        </p>
                      </div>
                      <div className="border-t pt-4 space-y-2">
                        <p>Choose a time slot that works best for your party.</p>
                        <p>Pre-ordered dishes will be prioritized when you arrive.</p>
                        <p>We accommodate special occasions and dietary needs.</p>
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                          Suggested deposit: <span className="font-semibold">{formatCurrency(25)}</span> per guest.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <Card className="border-0 bg-emerald-50">
                    <CardContent className="flex flex-col items-start gap-3 p-6 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Almost there</p>
                          <p className="text-2xl font-semibold text-emerald-900">Confirm and share your booking</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={handleShare}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button type="button" variant="outline" size="sm" asChild disabled={!reservationDateTime}>
                          <a href={calendarHref} target="_blank" rel="noreferrer">
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            Add to Calendar
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

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
                            <p>
                              <span className="font-medium text-gray-900">Table:</span>{" "}
                              {tableOptions.find((table) => table.id === tableSelection)?.name || "Not selected"}
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
                      <p>
                        <span className="font-medium text-gray-900">Table:</span>{" "}
                        {tableOptions.find((table) => table.id === tableSelection)?.name || "Not selected"}
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
