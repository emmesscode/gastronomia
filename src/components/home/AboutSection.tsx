
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const AboutSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-16 md:py-24 bg-gray-900 text-white relative">
      {/* Parallax background effect */}
      <div 
        className="absolute inset-0 bg-fixed opacity-20" 
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1500)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Chef Image */}
          <div className="order-2 md:order-1 relative">
            <div className="aspect-w-3 aspect-h-4 relative rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800" 
                alt="Chef Antonio" 
                className="object-cover w-full h-full rounded-lg shadow-xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-4 rounded-lg shadow-xl w-40 md:w-60 text-center rotate-3">
              <p className="font-serif italic">"Cooking is an art that feeds both body and soul."</p>
              <p className="mt-2 font-semibold">- Chef Antonio</p>
            </div>
          </div>
          
          {/* Content */}
          <div className="order-1 md:order-2">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">About Gastronomia</h2>
              
              <div className="space-y-4">
                <p>
                  Founded in 2010, Gastronomia has established itself as a culinary landmark, 
                  dedicated to celebrating the artistry of fine dining. Our philosophy is simple: 
                  extraordinary food made with the finest ingredients, prepared with passion and precision.
                </p>
                
                <p>
                  Chef Antonio Rossi brings over 20 years of culinary expertise, having trained in 
                  some of the most prestigious kitchens across Europe. His approach combines 
                  classical techniques with innovative twists, creating dishes that surprise and delight.
                </p>
                
                <p>
                  We source our ingredients from local farmers and artisanal producers who share our 
                  commitment to sustainability and ethical practices. This farm-to-table approach 
                  ensures that every dish tells a story of quality and care.
                </p>
              </div>
              
              <div className={isMobile ? "flex flex-col gap-4" : "flex gap-4"}>
                <Button size="lg" asChild>
                  <a href="#gallery">Explore Our Gallery</a>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Our Philosophy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
