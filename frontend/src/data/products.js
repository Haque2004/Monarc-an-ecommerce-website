export const INK = "#0A0A0A";
export const PAPER = "#FAFAF8";
export const GOLD = "#C9A24B";
export const CARD = "#161614";
export const STONE = "#8A8A85";

export const PRODUCTS = [
  {
    id: "p1",
    name: "The Tailored Overcoat",
    sku: "MN-OC-014",
    price: 1280,
    category: "Outerwear",
    fabric: "Wool, 92% / Cashmere, 8%",
  },
  {
    id: "p2",
    name: "Structured Wide-Leg Trouser",
    sku: "MN-TR-077",
    price: 420,
    category: "Trousers",
    fabric: "Italian wool gabardine",
  },
  {
    id: "p3",
    name: "Silk Bias Slip Dress",
    sku: "MN-DR-031",
    price: 680,
    category: "Dresses",
    fabric: "Mulberry silk, 100%",
  },
  {
    id: "p4",
    name: "Double-Faced Cashmere Coat",
    sku: "MN-OC-009",
    price: 1950,
    category: "Outerwear",
    fabric: "Cashmere, 100%",
  },
  {
    id: "p5",
    name: "Minimal Crewneck Knit",
    sku: "MN-KN-052",
    price: 310,
    category: "Knitwear",
    fabric: "Merino wool",
  },
  {
    id: "p6",
    name: "Pleated Midi Skirt",
    sku: "MN-SK-018",
    price: 390,
    category: "Skirts",
    fabric: "Wool crepe",
  },
  {
    id: "p7",
    name: "Oversized Tailored Blazer",
    sku: "MN-JK-063",
    price: 890,
    category: "Jackets",
    fabric: "Wool, 96% / Elastane, 4%",
  },
  {
    id: "p8",
    name: "Column Knit Maxi Dress",
    sku: "MN-DR-044",
    price: 540,
    category: "Dresses",
    fabric: "Viscose-blend rib knit",
  },
];

export const CATEGORIES = [
  "All",
  "Outerwear",
  "Dresses",
  "Trousers",
  "Knitwear",
  "Jackets",
  "Skirts",
];

export const formatPrice = (n) => {
  const formatted = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
  return `Tk ${formatted}`;
};

const CATEGORY_GENDER = {
  dresses: "women",
  skirts: "women",
  trousers: "men",
  jackets: "men",
  outerwear: "men",
};

export const getProductGender = (product) => {
  const savedGender = (product?.gender || "").toString().trim().toLowerCase();

  if (savedGender === "men" || savedGender === "women") {
    return savedGender;
  }

  const category = (product?.category || "").toString().trim().toLowerCase();
  if (category.includes("men") || category.includes("male")) return "men";
  if (category.includes("women") || category.includes("female")) return "women";

  return CATEGORY_GENDER[category] || "unisex";
};

export const formatGender = (product) => {
  const gender = getProductGender(product);
  return gender.charAt(0).toUpperCase() + gender.slice(1);
};
