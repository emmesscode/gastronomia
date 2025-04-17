
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1500&h=800&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1500&h=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1500&h=800&q=80",
  "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1500&h=800&q=80"
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevImageIndex(currentImageIndex);
      setIsTransitioning(true);
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      
      const transitionTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
      
      return () => clearTimeout(transitionTimer);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [currentImageIndex]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image Layers */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            ${index === prevImageIndex && isTransitioning ? 'opacity-50 z-5' : ''}
          `}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-20"></div>
      
      {/* Content */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center text-white px-4 text-center">
        <div className="bg-black-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-5 p-6 shadow-inner">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="block dosis">Gastronomia</span>
            <span className="block text-2xl md:text-3xl mt-2 font-light">Fine Dining Experience</span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl mb-8 animate-fade-in">
            Indulge in a culinary journey with our masterfully crafted dishes prepared with the finest ingredients.
          </p>
          
          <div className="space-x-4 animate-fade-in">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium">
              <Link to="/reservation">
                Reserve a Table <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-black hover:bg-primary/90 hover:text-white">
              <Link to="/menu">
                View Menu
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Image Navigation Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? "w-8 bg-white" : "bg-white/50"
            }`}
            onClick={() => {
              setPrevImageIndex(currentImageIndex);
              setCurrentImageIndex(index);
              setIsTransitioning(true);
              setTimeout(() => setIsTransitioning(false), 1000);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
