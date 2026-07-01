/**
 * Seed product catalogue for the GKSA shop.
 *
 * This mirrors the MySQL schema in ../../content/10-shop.md
 * (products / product_variants). Prices are stored in CENTS (integers)
 * exactly like the database, and formatted as ZAR for display.
 *
 * Admin state seeds from this list, then the public shop reads live inventory
 * from admin state so demo edits can update the storefront immediately.
 */

export type Category = "apparel" | "training" | "accessories";

export type Variant = {
  id: number;
  sku: string;
  size: string;
  stock_qty: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: Category;
  price_cents: number;
  active?: boolean;
  /** visual tone for the branded product tile (fallback) */
  tone: "red" | "dark" | "light";
  /** Pexels CDN photo URL, falls back to branded tile if omitted or fails to load */
  photo?: string;
  variants: Variant[];
};

export const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "apparel", label: "Apparel" },
  { value: "training", label: "Training" },
  { value: "accessories", label: "Accessories" },
];

const APPAREL_SIZES = ["S", "M", "L", "XL"];

function sizes(startSku: number, list: string[], stock = 12): Variant[] {
  return list.map((size, i) => ({
    id: startSku + i,
    sku: `GKSA-${startSku + i}`,
    size,
    stock_qty: stock,
  }));
}

export const CATALOG: Product[] = [
  {
    id: 1,
    slug: "home-jersey-2026",
    name: "Home Jersey 2026/27",
    description:
      "The official GKSA home jersey in academy red. Lightweight, breathable, and built for match day.",
    category: "apparel",
    price_cents: 45000,
    active: true,
    tone: "red",
    photo:
      "https://images.pexels.com/photos/16678677/pexels-photo-16678677.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: sizes(101, APPAREL_SIZES),
  },
  {
    id: 2,
    slug: "away-jersey-2026",
    name: "Away Jersey 2026/27",
    description: "The official GKSA away jersey. Clean, sharp, and ready for the road.",
    category: "apparel",
    price_cents: 45000,
    active: true,
    tone: "light",
    photo:
      "https://images.pexels.com/photos/33264686/pexels-photo-33264686.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: sizes(111, APPAREL_SIZES),
  },
  {
    id: 3,
    slug: "training-tee",
    name: "Training Tee",
    description: "Everyday training tee with the GKSA crest. Soft, durable, and comfortable.",
    category: "training",
    price_cents: 22000,
    active: true,
    tone: "dark",
    photo:
      "https://images.pexels.com/photos/3794707/pexels-photo-3794707.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: sizes(121, APPAREL_SIZES, 20),
  },
  {
    id: 4,
    slug: "tracksuit",
    name: "Academy Tracksuit",
    description: "Full GKSA tracksuit, top and bottoms. Warm, smart, and team-ready.",
    category: "apparel",
    price_cents: 75000,
    active: true,
    tone: "dark",
    photo:
      "https://images.pexels.com/photos/26887046/pexels-photo-26887046.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: sizes(131, APPAREL_SIZES, 8),
  },
  {
    id: 5,
    slug: "hoodie",
    name: "Crest Hoodie",
    description: "Heavyweight hoodie with an embroidered GKSA crest. A supporter favourite.",
    category: "apparel",
    price_cents: 52000,
    active: true,
    tone: "red",
    photo:
      "https://images.pexels.com/photos/2108816/pexels-photo-2108816.png?auto=compress&cs=tinysrgb&w=800",
    variants: sizes(141, APPAREL_SIZES, 10),
  },
  {
    id: 6,
    slug: "cap",
    name: "Knight Cap",
    description: "Adjustable cap with the GKSA mark. One size fits all.",
    category: "accessories",
    price_cents: 18000,
    active: true,
    tone: "light",
    photo:
      "https://images.pexels.com/photos/31162881/pexels-photo-31162881.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: [{ id: 151, sku: "GKSA-151", size: "One size", stock_qty: 25 }],
  },
  {
    id: 7,
    slug: "drawstring-bag",
    name: "Drawstring Bag",
    description: "Lightweight drawstring bag for boots and kit. Branded GKSA red.",
    category: "accessories",
    price_cents: 12000,
    active: true,
    tone: "red",
    photo:
      "https://images.pexels.com/photos/3850566/pexels-photo-3850566.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: [{ id: 161, sku: "GKSA-161", size: "One size", stock_qty: 30 }],
  },
  {
    id: 8,
    slug: "water-bottle",
    name: "Academy Water Bottle",
    description: "750ml reusable bottle to keep players hydrated through every session.",
    category: "accessories",
    price_cents: 9000,
    active: true,
    tone: "dark",
    photo:
      "https://images.pexels.com/photos/7690201/pexels-photo-7690201.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: [{ id: 171, sku: "GKSA-171", size: "750ml", stock_qty: 40 }],
  },
];

export function getProduct(slug: string) {
  return CATALOG.find((p) => p.slug === slug);
}

export function toneForCategory(category: Category): Product["tone"] {
  if (category === "training") return "dark";
  if (category === "accessories") return "light";
  return "red";
}
