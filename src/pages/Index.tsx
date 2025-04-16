
import HeroSection from "@/components/home/HeroSection";
import FeaturedFoodSection from "@/components/home/FeaturedFoodSection";
import AboutSection from "@/components/home/AboutSection";
import GallerySection from "@/components/home/GallerySection";
import MenuSection from "@/components/home/MenuSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedFoodSection />
        <AboutSection />
        <GallerySection />
        <MenuSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
