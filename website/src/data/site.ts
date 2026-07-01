export const SITE = {
  name: "Golden Knights Soccer Academy",
  shortName: "GKSA",
  tagline: "Youth football coaching in Midrand.",
  location: "Midrand, Gauteng",
  instagram: "https://www.instagram.com/goldenknightsfc",
  whatsapp: "https://wa.me/27781610670",
  founded: 2016,
};

export type NavItem = { label: string; to: string };

/** Top-level links shown in the desktop header. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Programmes", to: "/programmes" },
  { label: "Teams", to: "/teams" },
  { label: "News", to: "/news" },
  { label: "Shop", to: "/shop" },
];

/** Secondary links tucked into the desktop "More" dropdown. */
export const MORE_NAV: NavItem[] = [
  { label: "Fixtures & Results", to: "/fixtures" },
  { label: "Gallery", to: "/gallery" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Sponsors", to: "/sponsors" },
];

/** Full list used by the footer and mobile menu (no admin link). */
export const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  ...PRIMARY_NAV,
  ...MORE_NAV,
];

export const STATS = [
  { value: "2016", label: "Founded" },
  { value: "100+", label: "Players developed" },
  { value: "U9–U13+", label: "Age-group teams" },
  { value: "SAFA", label: "Registered · North Rand FA" },
];

export const VALUES = [
  "Discipline",
  "Excellence",
  "Respect",
  "Teamwork",
  "Leadership",
  "Integrity",
  "Community",
];

export const CONTACTS = [
  { role: "Head Coach", name: "Katlego Ntsheke", phone: "078 161 0670", email: "" },
  {
    role: "Assistant Coach",
    name: "Coach Mphatso",
    phone: "066 577 8001",
    email: "mphatso.chandiyamba@gmail.com",
  },
  {
    role: "PA",
    name: "Bophelo Monyayi",
    phone: "084 060 2704",
    email: "monyayibophelo25@gmail.com",
  },
];

export const SPONSOR_TIERS = [
  {
    name: "Platinum",
    amount: "R100,000",
    featured: true,
    benefits:
      "Largest logo on training & game kit; largest logo on gazebos, banners & bags; featured across all social media and the website.",
  },
  {
    name: "Golden",
    amount: "R50,000",
    featured: false,
    benefits:
      "Prominent logo on kit, gazebos and banners; featured on social media and the website.",
  },
  {
    name: "Silver",
    amount: "R10,000",
    featured: false,
    benefits: "Logo on kit, gazebos, banners, website and social media.",
  },
  {
    name: "Community Partner",
    amount: "R5,000",
    featured: false,
    benefits: "Logo on kit, website and social media.",
  },
  {
    name: "Custom / In-kind",
    amount: "Flexible",
    featured: false,
    benefits: "Donate products, services or equipment, tailored recognition to match.",
  },
];
