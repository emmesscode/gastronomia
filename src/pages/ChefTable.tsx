import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroHeader from "@/components/layout/HeroHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const timeline = [
  {
    title: "Welcome Sip",
    description: "A sparkling aperitif with seasonal botanicals and citrus zest.",
    time: "6:30 PM",
  },
  {
    title: "First Impression",
    description: "House-made sourdough with smoked olive oil and whipped ricotta.",
    time: "6:45 PM",
  },
  {
    title: "Chef's Signature",
    description: "Hand-cut tagliolini with truffle butter and shaved parmesan.",
    time: "7:05 PM",
  },
  {
    title: "The Main Event",
    description: "Herb-crusted lamb with charred leek and rosemary jus.",
    time: "7:30 PM",
  },
  {
    title: "Sweet Finale",
    description: "Olive oil cake, candied citrus, and vanilla chantilly.",
    time: "7:55 PM",
  },
];

const ChefTable = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroHeader
          title="Chef's Table"
          subtitle="An intimate culinary journey with our chef, featuring seasonal tasting menus and wine pairings."
        />

        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 space-y-12">
            <section className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Limited Seating</p>
                <h2 className="text-3xl md:text-4xl font-bold">A private experience for true gourmands</h2>
                <p className="text-gray-600">
                  Join our chef for a seven-course tasting menu crafted exclusively for Chef's Table guests. Every
                  detail is curated in real-time, from wine pairings to the story behind each ingredient.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <a href="/reservation">Reserve Your Seat</a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="/menu">View Seasonal Menu</a>
                  </Button>
                </div>
              </div>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1400"
                    alt="Chef preparing a plated dish"
                    className="h-full w-full object-cover"
                  />
                </CardContent>
              </Card>
            </section>

            <Separator />

            <section className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Curated Pairings</h3>
                  <p className="text-sm text-gray-600">
                    Sommeliers guide each pairing, highlighting boutique vineyards and exclusive reserves.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Seasonal Sourcing</h3>
                  <p className="text-sm text-gray-600">
                    Menus evolve weekly with the freshest local produce and artisanal ingredients.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Interactive Moments</h3>
                  <p className="text-sm text-gray-600">
                    Speak with the chef, ask questions, and enjoy bespoke adjustments.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Tonight's Journey</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Every seating is timed so you can savor the experience. Here's a sample of the evening flow.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {timeline.map((step) => (
                  <Card key={step.title}>
                    <CardContent className="p-6 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="text-sm text-gray-600 mt-2">{step.description}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary whitespace-nowrap">{step.time}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="bg-gray-50 rounded-2xl p-8 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Reserve Chef's Table</h2>
                <p className="text-gray-600 mt-2">
                  Seating is limited to 8 guests per night. Secure your reservation and let us curate your evening.
                </p>
              </div>
              <Button asChild size="lg">
                <a href="/reservation">Book the Experience</a>
              </Button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ChefTable;
