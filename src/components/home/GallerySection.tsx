import { useEffect, useRef } from "react";

const images = [
  {
    src: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800",
    alt: "Colorful dish with protein and vegetables",
    size: "medium"
  },
  {
    src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800",
    alt: "Fine dining dish",
    size: "medium"
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
    alt: "Plate of gourmet food",
    size: "medium"
  },
  {
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    alt: "Fresh vegetable salad dish",
    size: "medium"
  },{
    src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800",
    alt: "Fine dining presentation",
    size: "tall"
  },
  {
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
    alt: "Dessert with berries",
    size: "medium"
  },
  {
    src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800",
    alt: "Fine dining dish",
    size: "wide"
  },
  {
    src: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=800",
    alt: "Plated dessert",
    size: "medium"
  },
  {
    src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800",
    alt: "Fine dining presentation",
    size: "tall"
  },
  {
    src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800",
    alt: "Fine dining dish",
    size: "medium"
  }
];

const GallerySection = () => {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.gallery-item');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible) {
          el.classList.add('is-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'wide': return 'col-span-2 row-span-1';
      case 'tall': return 'col-span-1 row-span-2';
      case 'large': return 'col-span-2 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-gray-100 w-full" ref={galleryRef}>
      <div className="px-0 w-full">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Culinary Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Feast your eyes on our artfully crafted dishes, where every plate tells a story of passion, creativity, and culinary excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`gallery-item opacity-0 transform translate-y-10 transition-all duration-700 ease-out ${getSizeClass(image.size)}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-full group">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 max-h-[50vh]"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white text-center p-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                      <p className="font-medium">{image.alt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          .gallery-item.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
        `}
      </style>
    </section>
  );
};

export default GallerySection;
