type HeroHeaderProps = {
  title: string;
  subtitle: string;
  backgroundImage?: string;
};

const DEFAULT_BACKGROUND =
  "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1500)";

const HeroHeader = ({ title, subtitle, backgroundImage = DEFAULT_BACKGROUND }: HeroHeaderProps) => {
  return (
    <div className="relative py-16 md:py-20 bg-gray-900 text-white top-0 absolute w-full">
      <div
        className="absolute inset-0 bg-fixed opacity-20"
        style={{
          backgroundImage,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="max-w-2xl mx-auto text-lg">{subtitle}</p>
      </div>
    </div>
  );
};

export default HeroHeader;
