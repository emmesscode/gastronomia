export const homeContent = {
  hero: {
    title: "Gastronomia",
    subtitle: "Fine Dining Experience",
    description:
      "Indulge in a culinary journey with our masterfully crafted dishes prepared with the finest ingredients.",
    primaryCta: {
      label: "Reserve a Table",
      href: "/reservation",
    },
    secondaryCta: {
      label: "View Menu",
      href: "/menu",
    },
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1500&h=800&q=80",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1500&h=800&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1500&h=800&q=80",
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1500&h=800&q=80",
    ],
  },
  about: {
    eyebrow: "About Gastronomia",
    heading: "Elevating culinary artistry since 2010",
    paragraphs: [
      "Founded in 2010, Gastronomia has established itself as a culinary landmark, dedicated to celebrating the artistry of fine dining.",
      "Chef Antonio Rossi brings over 20 years of culinary expertise, blending classical techniques with innovative twists.",
      "We source our ingredients from local farmers and artisanal producers who share our commitment to sustainability.",
    ],
    quote:
      "Cooking is an art that feeds both body and soul.",
    quoteAuthor: "Chef Antonio",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800",
    ctas: [
      { label: "Explore Our Gallery", href: "#gallery", variant: "default" },
      { label: "Our Philosophy", href: "/reservation", variant: "outline" },
    ],
  },
  gallery: {
    title: "Culinary Gallery",
    description:
      "Feast your eyes on our artfully crafted dishes, where every plate tells a story of passion, creativity, and culinary excellence.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800",
        alt: "Colorful dish with protein and vegetables",
        size: "wide",
      },
      {
        src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800",
        alt: "Fine dining dish",
        size: "medium",
      },
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
        alt: "Plate of gourmet food",
        size: "medium",
      },
      {
        src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
        alt: "Fresh vegetable salad dish",
        size: "medium",
      },
      {
        src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800",
        alt: "Fine dining presentation",
        size: "medium",
      },
      {
        src: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
        alt: "Dessert with berries",
        size: "medium",
      },
      {
        src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800",
        alt: "Fine dining dish",
        size: "wide",
      },
      {
        src: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=800",
        alt: "Plated dessert",
        size: "medium",
      },
      {
        src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800",
        alt: "Fine dining presentation",
        size: "tall",
      },
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
        alt: "Plate of gourmet food",
        size: "wide",
      },
      {
        src: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800",
        alt: "Colorful dish with protein and vegetables",
        size: "medium",
      },
      {
        src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800",
        alt: "Fine dining dish",
        size: "medium",
      },
    ],
  },
};

export type HomeContent = typeof homeContent;
