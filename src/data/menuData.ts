export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  allergenes?: string[];
  image?: string;
  featured?: boolean;
  ingredients?: string[];
  preparation?: string;
  category?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export const foodItems: MenuCategory[] = [
  {
    name: "Starters",
    items: [
      {
        id: "f1",
        name: "Truffle Arancini",
        description: "Crispy risotto balls with black truffle and mozzarella",
        price: 12,
        allergenes: ["gluten", "dairy"],
        image: "https://images.unsplash.com/photo-1597289124948-688c1a35cb48?q=80&w=800",
      },
      {
        id: "f2",
        name: "Heirloom Tomato Salad",
        description: "Fresh tomatoes, buffalo mozzarella, basil, aged balsamic",
        price: 14,
        allergenes: ["dairy"],
        image: "https://images.unsplash.com/photo-1590005024862-6b67679a29fb?q=80&w=800",
        featured: true,
        ingredients: ["Heirloom tomatoes", "Buffalo mozzarella", "Fresh basil", "Extra virgin olive oil", "Aged balsamic vinegar", "Sea salt", "Black pepper"],
        preparation: "Our chef carefully selects the ripest heirloom tomatoes from local organic farms. The tomatoes are sliced and arranged with torn buffalo mozzarella, then garnished with fresh basil leaves. The dish is finished with a drizzle of our imported extra virgin olive oil and 25-year aged balsamic vinegar from Modena, Italy."
      },
      {
        id: "f3",
        name: "Beef Carpaccio",
        description: "Thinly sliced raw beef, truffle aioli, arugula, parmesan",
        price: 16,
        allergenes: ["dairy", "eggs"],
        image: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?q=80&w=800",
      }
    ]
  },
  {
    name: "Main Courses",
    items: [
      {
        id: "f4",
        name: "Pan-Seared Scallops",
        description: "Cauliflower purée, crispy pancetta, brown butter sauce",
        price: 34,
        allergenes: ["shellfish", "dairy"],
        image: "https://images.unsplash.com/photo-1624376414452-79856e7a7a81?q=80&w=800",
        featured: true,
        ingredients: ["Jumbo sea scallops", "Cauliflower", "Pancetta", "Butter", "Lemon", "Chives", "Microgreens"],
        preparation: "Our chef sources the freshest jumbo sea scallops daily. They are seasoned and seared to perfection in a cast iron pan. The scallops are served on a bed of silky cauliflower purée, topped with crispy pancetta bits, and finished with a brown butter sauce infused with lemon. The dish is garnished with fresh chives and delicate microgreens."
      },
      {
        id: "f5",
        name: "Truffle Risotto",
        description: "Arborio rice, porcini mushrooms, black truffle, parmesan",
        price: 28,
        allergenes: ["dairy"],
        image: "https://images.unsplash.com/photo-1633436374961-09a1a8a25a76?q=80&w=800",
      },
      {
        id: "f6",
        name: "Aged Ribeye Steak",
        description: "28-day dry-aged beef, potato gratin, roasted vegetables",
        price: 42,
        allergenes: ["dairy"],
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800",
      }
    ]
  },
  {
    name: "Chef's Specials",
    items: [
      {
        id: "f7",
        name: "Lobster Linguine",
        description: "Fresh pasta, whole lobster, cherry tomatoes, white wine sauce",
        price: 38,
        allergenes: ["gluten", "shellfish"],
        image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?q=80&w=800",
      },
      {
        id: "f8",
        name: "Lamb Rack",
        description: "Herb-crusted lamb, mint pea purée, roasted root vegetables",
        price: 36,
        allergenes: ["dairy"],
        image: "https://images.unsplash.com/photo-1519708495087-ca1b71df408b?q=80&w=800",
        featured: true,
        ingredients: ["New Zealand lamb rack", "Fresh herbs (rosemary, thyme, mint)", "Dijon mustard", "Breadcrumbs", "Green peas", "Root vegetables", "Lamb jus"],
        preparation: "Our chef prepares a premium New Zealand lamb rack, coated with Dijon mustard and a crust of fresh herbs and breadcrumbs. The lamb is roasted to a perfect medium-rare. It's served with a smooth mint pea purée and a medley of roasted root vegetables. The dish is finished with a rich lamb jus reduction that's been simmering for 12 hours."
      }
    ]
  }
];

export const dessertItems: MenuCategory[] = [
  {
    name: "Desserts",
    items: [
      {
        id: "d1",
        name: "Chocolate Soufflé",
        description: "Warm chocolate soufflé with vanilla ice cream",
        price: 12,
        allergenes: ["gluten", "dairy", "eggs"],
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800",
      },
      {
        id: "d2",
        name: "Crème Brûlée",
        description: "Classic vanilla custard with caramelized sugar top",
        price: 10,
        allergenes: ["dairy", "eggs"],
        image: "https://images.unsplash.com/photo-1615394567618-ec2f2e24e39e?q=80&w=800",
      },
      {
        id: "d3",
        name: "Berry Panna Cotta",
        description: "Vanilla panna cotta with fresh berries and mint",
        price: 11,
        allergenes: ["dairy"],
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800",
      }
    ]
  }
];

export const drinkItems: MenuCategory[] = [
  {
    name: "Wine",
    items: [
      {
        id: "w1",
        name: "Château Margaux 2015",
        description: "Premier Grand Cru Classé, Margaux, Bordeaux, France",
        price: 220,
        image: "https://images.unsplash.com/photo-1586370434639-0fe98d209f32?q=80&w=800",
      },
      {
        id: "w2",
        name: "Opus One 2018",
        description: "Cabernet Blend, Napa Valley, California",
        price: 180,
        image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800",
      },
      {
        id: "w3",
        name: "Dom Pérignon 2012",
        description: "Champagne, France",
        price: 195,
        image: "https://images.unsplash.com/photo-1592507783432-808c12c17c03?q=80&w=800",
      }
    ]
  },
  {
    name: "Cocktails",
    items: [
      {
        id: "c1",
        name: "Signature Negroni",
        description: "Aged gin, Campari, house-made vermouth blend",
        price: 16,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800",
      },
      {
        id: "c2",
        name: "Truffle Old Fashioned",
        description: "Bourbon infused with black truffle, bitters, maple",
        price: 18,
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800",
      },
      {
        id: "c3",
        name: "Elderflower Spritz",
        description: "St-Germain, prosecco, soda, fresh mint",
        price: 14,
        image: "https://images.unsplash.com/photo-1578664182354-018196e68bc2?q=80&w=800",
      }
    ]
  },
  {
    name: "Non-Alcoholic",
    items: [
      {
        id: "n1",
        name: "Cucumber Mint Refresher",
        description: "Fresh cucumber, mint, lime, sparkling water",
        price: 8,
        image: "https://images.unsplash.com/photo-1556679343-c1bf22d40b9c?q=80&w=800",
      },
      {
        id: "n2",
        name: "Berry Hibiscus Lemonade",
        description: "House-made hibiscus syrup, mixed berries, fresh lemon",
        price: 8,
        image: "https://images.unsplash.com/photo-1606943932434-2f21e1c54ef2?q=80&w=800",
      }
    ]
  }
];

export const getAllMenuItems = () => {
  return [
    ...foodItems.flatMap(category => category.items),
    ...dessertItems.flatMap(category => category.items),
    ...drinkItems.flatMap(category => category.items)
  ];
};

export const getFeaturedItems = () => {
  return getAllMenuItems().filter(item => item.featured);
};
