import {
  type Prospect,
  type Member,
  type Payment,
  type AdminOrder,
  type AdminOrderItem,
  type GalleryPhoto,
  type Match,
  type NewsPost,
  type Sponsor,
  DEFAULT_FEES,
  type AdminFeeSettings,
} from "./types";
import { CATALOG, type Product } from "@/data/products";
import { POSTS } from "@/data/news";

const DAY = 24 * 3600 * 1000;
const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * DAY).toISOString();
const isoDate = (offsetDays: number) => iso(offsetDays).slice(0, 10);
const thisYear = String(new Date().getFullYear());

/** Bump this when the seeded gallery changes so saved demos pick up new photos. */
export const GALLERY_SEED_VERSION = 2;

export interface AdminData {
  fees: AdminFeeSettings;
  prospects: Prospect[];
  members: Member[];
  payments: Payment[];
  products: Product[];
  orders: AdminOrder[];
  galleryPhotos: GalleryPhoto[];
  galleryVersion: number;
  matches: Match[];
  matchesVersion: number;
  newsPosts: NewsPost[];
  sponsors: Sponsor[];
}

/** Bump when the seeded fixtures/results change so saved demos refresh. */
export const MATCHES_SEED_VERSION = 3;

function buildMatches(): Match[] {
  return [
    // Upcoming fixtures
    { id: "mt1", team: "U13", opponent: "Mamelodi Sundowns Dev", date: isoDate(4), venue: "Midrand Astro", status: "upcoming", createdAt: iso(-2) },
    { id: "mt2", team: "U11", opponent: "Randburg FC", date: isoDate(6), venue: "Randburg", status: "upcoming", createdAt: iso(-2) },
    { id: "mt3", team: "U9", opponent: "Community Stars", date: isoDate(8), venue: "Midrand Astro", status: "upcoming", createdAt: iso(-2) },
    { id: "mt4", team: "U13+", opponent: "North Rand United", date: isoDate(9), venue: "North Rand", status: "upcoming", createdAt: iso(-2) },
    { id: "mt5", team: "U11", opponent: "Halfway House FC", date: isoDate(13), venue: "Midrand Astro", status: "upcoming", createdAt: iso(-2) },
    { id: "mt6", team: "U9", opponent: "Tembisa Juniors", date: isoDate(16), venue: "Tembisa", status: "upcoming", createdAt: iso(-2) },

    // Recent results
    { id: "mt7", team: "U13", opponent: "Rangers Youth", date: isoDate(-3), venue: "Midrand Astro", status: "played", gf: 3, ga: 1, createdAt: iso(-3) },
    { id: "mt8", team: "U9", opponent: "Midrand Allstars", date: isoDate(-6), venue: "Midrand Astro", status: "played", gf: 4, ga: 0, createdAt: iso(-6) },
    { id: "mt9", team: "U11", opponent: "City Juniors", date: isoDate(-8), venue: "North Rand", status: "played", gf: 2, ga: 2, createdAt: iso(-8) },
    { id: "mt10", team: "U13+", opponent: "Kyalami Eagles", date: isoDate(-11), venue: "Kyalami", status: "played", gf: 1, ga: 2, createdAt: iso(-11) },
    { id: "mt11", team: "U13", opponent: "Olievenhoutbosch FC", date: isoDate(-16), venue: "Midrand Astro", status: "played", gf: 2, ga: 0, createdAt: iso(-16) },
    { id: "mt12", team: "U11", opponent: "Ivory Park United", date: isoDate(-21), venue: "Ivory Park", status: "played", gf: 5, ga: 1, createdAt: iso(-21) },
  ];
}

function buildNews(): NewsPost[] {
  return POSTS.map((p, i) => ({ ...p, id: `news-${i + 1}`, createdAt: iso(-(i * 4 + 2)) }));
}

function buildGallery(): GalleryPhoto[] {
  return [
    { id: "ph9", src: "/img/photos/academy-09.jpg", caption: "U9s, Randburg Tournament champions", category: "Team", createdAt: iso(-30) },
    { id: "ph8", src: "/img/photos/academy-08.jpg", caption: "U10s, 2nd place at the Randburg Tournament", category: "Team", createdAt: iso(-28) },
    { id: "ph11", src: "/img/photos/academy-11.jpg", caption: "Golden Knights vs Mamelodi Sundowns", category: "Match days", createdAt: iso(-26) },
    { id: "ph10", src: "/img/photos/academy-10.jpg", caption: "Line-up before kickoff", category: "Match days", createdAt: iso(-24) },
    { id: "ph7", src: "/img/photos/academy-07.jpg", caption: "Team talk on tournament day", category: "Match days", createdAt: iso(-22) },
    { id: "ph1", src: "/img/photos/academy-01.jpg", caption: "Match day intensity", category: "Match days", createdAt: iso(-20) },
    { id: "ph2", src: "/img/photos/academy-05.jpg", caption: "Eyes on the ball", category: "Match days", createdAt: iso(-18) },
    { id: "ph3", src: "/img/photos/academy-02.jpg", caption: "Training session", category: "Training", createdAt: iso(-15) },
    { id: "ph4", src: "/img/photos/academy-04.jpg", caption: "Skills work", category: "Training", createdAt: iso(-12) },
    { id: "ph5", src: "/img/photos/academy-03.webp", caption: "Squad together", category: "Team", createdAt: iso(-9) },
    { id: "ph6", src: "/img/photos/academy-06.webp", caption: "The Golden Knights", category: "Team", createdAt: iso(-6) },
  ];
}

function buildSponsors(): Sponsor[] {
  return [
    {
      id: "sp1",
      name: "Agape Water",
      tier: "Hydration Partner",
      tagline: "Official hydration partner",
      description:
        "Agape Water supplies premium mineral water to our players and coaching staff at every training session and match day. Keeping Golden Knights hydrated and performing at their best, from first whistle to final whistle.",
      logo: "/img/sponsors/agape-water-logo.png",
      website: "",
      status: "approved",
      addedAt: iso(-60),
    },
  ];
}

export function buildSeed(): AdminData {
  const products = cloneProducts(CATALOG);
  const prospects: Prospect[] = [
    {
      id: "p1",
      childFirst: "Lethabo",
      childLast: "Mokoena",
      dob: "2016-04-12",
      ageGroup: "U9",
      parentName: "Thandi Mokoena",
      phone: "082 345 6789",
      email: "thandi@example.com",
      source: "Trial form",
      message: "Keen to start as soon as possible.",
      status: "new",
      notes: [],
      createdAt: iso(-1),
    },
    {
      id: "p2",
      parentName: "Sipho Dlamini",
      phone: "073 222 1144",
      email: "sipho@example.com",
      source: "Contact",
      message: "Do you have space in the U13 group next term?",
      status: "new",
      notes: [],
      createdAt: iso(-2),
    },
    {
      id: "p3",
      childFirst: "Karabo",
      childLast: "Nkosi",
      dob: "2014-09-01",
      ageGroup: "U11",
      parentName: "Naledi Nkosi",
      phone: "084 555 9090",
      source: "Trial form",
      status: "contacted",
      notes: [{ id: "n1", text: "Called, will confirm a Saturday trial.", at: iso(-3) }],
      createdAt: iso(-5),
    },
    {
      id: "p4",
      childFirst: "Junior",
      childLast: "Baloyi",
      dob: "2013-02-20",
      ageGroup: "U13",
      parentName: "Grace Baloyi",
      phone: "071 808 1212",
      source: "Trial form",
      status: "trial_booked",
      notes: [{ id: "n2", text: "Trial booked for Saturday 9am.", at: iso(-2) }],
      createdAt: iso(-7),
    },
    {
      id: "p5",
      childFirst: "Aphiwe",
      childLast: "Khumalo",
      dob: "2015-06-15",
      ageGroup: "U11",
      parentName: "Bongani Khumalo",
      phone: "082 100 2003",
      source: "Trial form",
      status: "trial_attended",
      notes: [{ id: "n3", text: "Attended, strong session. Likely to join.", at: iso(-1) }],
      createdAt: iso(-10),
    },
    {
      id: "p6",
      childFirst: "Tumi",
      childLast: "Radebe",
      dob: "2016-11-03",
      ageGroup: "U9",
      parentName: "Lerato Radebe",
      phone: "073 654 3210",
      source: "Contact",
      status: "declined",
      notes: [{ id: "n4", text: "Too far to travel, declined for now.", at: iso(-6) }],
      createdAt: iso(-14),
    },
  ];

  const members: Member[] = [
    mk("m1", "Sibusiso", "Ndlovu", "U13", "Nomsa Ndlovu", "082 111 2222", -400, 20),
    mk("m2", "Kabelo", "Mthembu", "U11", "Peter Mthembu", "071 333 4444", -200, 14),
    mk("m3", "Oratile", "Sithole", "U9", "Joyce Sithole", "084 555 6666", -90, 8),
    mk("m4", "Bandile", "Zulu", "U13+", "Andile Zulu", "073 777 8888", -350, 18, "active"),
    mk("m5", "Refilwe", "Maluleke", "U11", "Dineo Maluleke", "082 999 0000", -300, 25, "active"),
    mk("m6", "Tshepo", "Molefe", "U13", "Kgomotso Molefe", "071 246 8101", -420, -12, "overdue"),
    mk("m7", "Naledi", "Mahlangu", "U9", "Zanele Mahlangu", "084 135 7910", -380, -40, "overdue"),
    mk("m8", "Katlego", "Pretorius", "U13+", "Hannes Pretorius", "082 864 2086", -800, 60, "inactive"),
  ];

  // Each active/overdue member has a paid record for the current membership month.
  const payments: Payment[] = members
    .filter((m) => m.status !== "inactive")
    .map((m, i) => ({
      id: `pay-${i + 1}`,
      memberId: m.id,
      period: new Date().toISOString().slice(0, 7),
      amountCents: DEFAULT_FEES.monthlyFeeCents,
      kind: "monthly_fee" as const,
      status: "paid" as const,
      paidAt: iso(-30),
    }));

  const orderItem = (slug: string, variantLabel: string, qty: number): AdminOrderItem => {
    const product = products.find((p) => p.slug === slug);
    if (!product) throw new Error(`Missing seed product: ${slug}`);
    return {
      productId: product.id,
      productName: product.name,
      variantLabel,
      qty,
      unitCents: product.price_cents,
    };
  };
  const order = (
    id: string,
    suffix: string,
    customerName: string,
    status: AdminOrder["status"],
    createdOffset: number,
    items: AdminOrderItem[]
  ): AdminOrder => ({
    id,
    orderNumber: `GKSA-${thisYear}-${suffix}`,
    customerName,
    items,
    itemsCount: items.reduce((sum, item) => sum + item.qty, 0),
    totalCents: items.reduce((sum, item) => sum + item.qty * item.unitCents, 0),
    status,
    createdAt: iso(createdOffset),
  });

  const orders: AdminOrder[] = [
    order("o1", "000118", "Thandi Mokoena", "paid", -2, [
      orderItem("home-jersey-2026", "M", 1),
      orderItem("drawstring-bag", "One size", 1),
    ]),
    order("o2", "000117", "Peter Mthembu", "fulfilled", -6, [
      orderItem("away-jersey-2026", "L", 1),
    ]),
    order("o3", "000116", "Dineo Maluleke", "pending", -9, [
      orderItem("training-tee", "S", 2),
      orderItem("water-bottle", "750ml", 1),
      orderItem("cap", "One size", 1),
    ]),
  ];

  return {
    fees: { ...DEFAULT_FEES },
    prospects,
    members,
    payments,
    products,
    orders,
    galleryPhotos: buildGallery(),
    galleryVersion: GALLERY_SEED_VERSION,
    matches: buildMatches(),
    matchesVersion: MATCHES_SEED_VERSION,
    newsPosts: buildNews(),
    sponsors: buildSponsors(),
  };
}

function cloneProducts(products: Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => ({ ...variant })),
  }));
}

function mk(
  id: string,
  firstName: string,
  lastName: string,
  team: Member["team"],
  guardianName: string,
  guardianPhone: string,
  joinOffset: number,
  renewalOffset: number,
  status: Member["status"] = "active"
): Member {
  return {
    id,
    firstName,
    lastName,
    team,
    guardianName,
    guardianPhone,
    joinDate: isoDate(joinOffset),
    monthlyFeeCents: DEFAULT_FEES.monthlyFeeCents,
    joiningFeeCents: DEFAULT_FEES.joiningFeeCents,
    joiningFeePaidAt: iso(joinOffset),
    status,
    nextRenewal: isoDate(renewalOffset),
    photoConsent: true,
  };
}
