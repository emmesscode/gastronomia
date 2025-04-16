import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Order = () => {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        {/* Hero Section */}
        <div className="relative py-16 md:py-24 bg-gray-900 text-white top-0 absolute w-full">
          <div 
            className="absolute inset-0 bg-fixed opacity-20" 
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1500)",
              backgroundSize: "cover",
              backgroundPosition: "top",
            }}
          ></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Order Online</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Enjoy our delicious meals from the comfort of your home.
              Fresh, high-quality ingredients delivered right to your doorstep.
            </p>
          </div>
        </div>

        {/* Order Content - Adjusted top margin to account for absolute header */}
        <div className="py-12 md:py-16 bg-white mt-[300px] md:mt-[400px]">
          {/* Content will be added later */}
          <div className="container mx-auto px-4">
            <p>Order functionality coming soon...</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Order;
