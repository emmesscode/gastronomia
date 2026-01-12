import { useEffect } from "react";
import { homeContent } from "@/data/homeContent";

const GallerySection = () => {
  const { gallery } = homeContent;

  useEffect(() => {
    const elements = document.querySelectorAll(".gallery-item");
    if (!elements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getSizeClass = (size: string) => {
    switch (size) {
      case "wide":
        return "col-span-2 row-span-1";
      case "tall":
        return "col-span-1 row-span-2";
      case "large":
        return "col-span-2 row-span-2";
      default:
        return "col-span-1 row-span-1";
    }
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-gray-100 w-full">
      <div className="px-0 w-full">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{gallery.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{gallery.description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full">
          {gallery.images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
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
