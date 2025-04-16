
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFeaturedItems } from "@/data/menuData";

const FeaturedFoodSection = () => {
  const featuredItems = getFeaturedItems();
  
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Chef's Selection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our chef carefully selects the finest ingredients to create these signature dishes that define our culinary vision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                  <span className="text-lg font-bold">${item.price}</span>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {item.ingredients && (
                    <div>
                      <h4 className="font-medium text-sm uppercase text-gray-500 mb-1">Ingredients</h4>
                      <p className="text-sm text-gray-700">{item.ingredients.join(", ")}</p>
                    </div>
                  )}
                  
                  {item.preparation && (
                    <div>
                      <h4 className="font-medium text-sm uppercase text-gray-500 mb-1">Preparation</h4>
                      <p className="text-sm text-gray-700">{item.preparation}</p>
                    </div>
                  )}
                  
                  {item.allergenes && item.allergenes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm uppercase text-gray-500 mb-1">Allergens</h4>
                      <div className="flex flex-wrap gap-1">
                        {item.allergenes.map((allergen) => (
                          <span 
                            key={allergen} 
                            className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedFoodSection;
