import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { homeContent } from "@/data/homeContent";

const AboutSection = () => {
  const isMobile = useIsMobile();
  const { about } = homeContent;

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
                src={about.image}
                alt="Chef Antonio"
                className="object-cover w-full h-full rounded-lg shadow-xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-4 rounded-lg shadow-xl w-40 md:w-60 text-center rotate-3">
              <p className="font-serif italic">"{about.quote}"</p>
              <p className="mt-2 font-semibold">- {about.quoteAuthor}</p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-primary/80">{about.eyebrow}</p>
                <h2 className="text-3xl md:text-4xl font-bold accent-text">{about.heading}</h2>
              </div>

              <div className="space-y-4">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className={isMobile ? "flex flex-col gap-4" : "flex gap-4"}>
                {about.ctas.map((cta) => (
                  <Button
                    key={cta.label}
                    size="lg"
                    asChild
                    variant={cta.variant === "outline" ? "outline" : "default"}
                    className={cta.variant === "outline" ? "border-white text-white hover:bg-white hover:text-gray-900" : undefined}
                  >
                    <a href={cta.href}>{cta.label}</a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
