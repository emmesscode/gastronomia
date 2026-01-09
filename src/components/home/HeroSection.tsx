import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { homeContent } from "@/data/homeContent";

const HeroSection = () => {
  const { hero } = homeContent;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevImageIndex(currentImageIndex);
      setIsTransitioning(true);
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hero.images.length);

      const transitionTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);

      return () => clearTimeout(transitionTimer);
    }, 6000);

    return () => clearInterval(timer);
  }, [currentImageIndex, hero.images.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image Layers */}
      {hero.images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"}
            ${index === prevImageIndex && isTransitioning ? "opacity-50 z-5" : ""}
          `}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-20"></div>

      {/* Content */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center text-white px-4 text-center">
        <div className="bg-black-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-5 p-6 shadow-inner">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="block text-3xl md:text-5xl accent accent-text">{hero.title}</span>
            <span className="block text-2xl md:text-3xl mt-2 font-light">{hero.subtitle}</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl mb-8 animate-fade-in">
            {hero.description}
          </p>

          <div className="space-x-4 animate-fade-in">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium">
              <Link to={hero.primaryCta.href}>
                {hero.primaryCta.label} <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="text-black hover:bg-primary/90 hover:text-white">
              <Link to={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Image Navigation Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-2">
        {hero.images.map((image, index) => (
          <button
            key={image}
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
