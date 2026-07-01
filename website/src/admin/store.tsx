import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  type Prospect,
  type Member,
  type Payment,
  type AdminOrder,
  type AdminOrderItem,
  type ProspectStatus,
  type AgeGroup,
  type GalleryPhoto,
  type GalleryCategory,
  type Match,
  type NewsPost,
  type NewsCategory,
  type Sponsor,
  AGE_GROUPS,
  DEFAULT_FEES,
  type AdminFeeSettings,
  ageGroupFromDob,
} from "./types";
import { buildSeed, type AdminData } from "./seed";
import { toneForCategory, type Category, type Product, type Variant } from "@/data/products";

const STORAGE_KEY = "gksa-admin";
const uid = () => Math.random().toString(36).slice(2, 10);
const nowIso = () => new Date().toISOString();
const todayDate = () => nowIso().slice(0, 10);

function addOneMonth(isoDateStr: string) {
  const d = new Date(isoDateStr);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

function monthPeriod(isoDateStr: string) {
  return isoDateStr.slice(0, 7);
}

function dateOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function normalizeNextPaymentDate(member: Member) {
  if (member.status === "inactive") return member.nextRenewal;
  const days = (new Date(member.nextRenewal).getTime() - Date.now()) / (24 * 3600 * 1000);
  return days > 45 ? dateOffset(25) : member.nextRenewal;
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "shop-item"
  );
}

function uniqueSlug(name: string, products: Product[]) {
  const base = slugify(name);
  const existing = new Set(products.map((product) => product.slug));
  if (!existing.has(base)) return base;
  let index = 2;
  while (existing.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function normalizeProducts(products: Product[]): Product[] {
  return products.map((product, productIndex) => ({
    ...product,
    id: product.id ?? productIndex + 1,
    slug: product.slug || slugify(product.name),
    active: product.active ?? true,
    tone: product.tone ?? toneForCategory(product.category),
    price_cents: Math.max(0, Math.round(product.price_cents)),
    variants: product.variants.map((variant, variantIndex) => ({
      ...variant,
      id: variant.id ?? product.id * 100 + variantIndex + 1,
      stock_qty: Math.max(0, Math.round(variant.stock_qty)),
    })),
  }));
}

function nextProductId(products: Product[]) {
  return Math.max(0, ...products.map((product) => product.id)) + 1;
}

function buildVariants(productId: number, mode: NewProduct["variantMode"], stockQty: number): Variant[] {
  const stock = Math.max(0, Math.round(stockQty));
  const sizes = mode === "sizes" ? ["S", "M", "L", "XL"] : ["One size"];
  return sizes.map((size, index) => {
    const id = productId * 100 + index + 1;
    return {
      id,
      sku: `GKSA-${id}`,
      size,
      stock_qty: stock,
    };
  });
}

export type NewProspect = {
  childFirst?: string;
  childLast?: string;
  dob?: string;
  parentName: string;
  phone: string;
  email?: string;
  source: Prospect["source"];
  message?: string;
  photoConsent?: boolean;
};

export type NewMember = {
  firstName: string;
  lastName: string;
  dob?: string;
  team: AgeGroup;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  photoConsent?: boolean;
};

export type NewSponsor = {
  name: string;
  tier: string;
  tagline?: string;
  description?: string;
  logo?: string;
  website?: string;
  status: Sponsor["status"];
};

export type NewProduct = {
  name: string;
  description: string;
  category: Category;
  priceCents: number;
  photo?: string;
  active: boolean;
  variantMode: "sizes" | "one";
  stockQty: number;
};

interface AdminContextValue extends AdminData {
  addProspect: (input: NewProspect) => string;
  setProspectStatus: (id: string, status: ProspectStatus) => void;
  addProspectNote: (id: string, text: string) => void;
  convertProspect: (id: string) => void;
  addMember: (input: NewMember) => void;
  recordPayment: (memberId: string) => void;
  updateFeeSettings: (input: AdminFeeSettings, applyToExistingMembers?: boolean) => void;
  addProduct: (input: NewProduct) => void;
  updateProduct: (product: Product) => void;
  updatePhotoConsent: (memberId: string, consent: boolean) => void;
  addSponsor: (input: NewSponsor) => void;
  updateSponsor: (id: string, patch: Partial<Omit<Sponsor, "id" | "addedAt">>) => void;
  removeSponsor: (id: string) => void;
  addOrder: (input: {
    customerName: string;
    items: AdminOrderItem[];
    totalCents: number;
  }) => string;
  updateOrderStatus: (id: string, status: AdminOrder["status"]) => void;
  addGalleryPhoto: (input: { src: string; caption?: string; category: GalleryCategory }) => void;
  updateGalleryPhoto: (
    id: string,
    patch: Partial<Pick<GalleryPhoto, "caption" | "category">>
  ) => void;
  removeGalleryPhoto: (id: string) => void;
  moveGalleryPhoto: (id: string, direction: -1 | 1) => void;
  addMatch: (input: {
    team: AgeGroup;
    opponent: string;
    date: string;
    venue?: string;
    status: "upcoming" | "played";
    gf?: number;
    ga?: number;
  }) => void;
  updateMatch: (
    id: string,
    patch: Partial<Pick<Match, "team" | "opponent" | "date" | "venue" | "status" | "gf" | "ga">>
  ) => void;
  removeMatch: (id: string) => void;
  addNewsPost: (input: {
    title: string;
    category: NewsCategory;
    date?: string;
    excerpt: string;
    body: string;
    img?: string;
  }) => void;
  updateNewsPost: (
    id: string,
    patch: Partial<Pick<NewsPost, "title" | "category" | "date" | "excerpt" | "body" | "img">>
  ) => void;
  removeNewsPost: (id: string) => void;
  updateMember: (id: string, patch: Partial<Pick<Member, "firstName" | "lastName" | "dob" | "team" | "guardianName" | "guardianPhone" | "guardianEmail" | "photoConsent">>) => void;
  removeMember: (id: string) => void;
  removeProspect: (id: string) => void;
  removeProduct: (id: number) => void;
  removeOrder: (id: string) => void;
  reset: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function load(): AdminData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeData(JSON.parse(raw) as Partial<AdminData>);
  } catch {
    /* ignore */
  }
  return buildSeed();
}

function normalizeData(raw: Partial<AdminData>): AdminData {
  const seed = buildSeed();
  const fees = {
    monthlyFeeCents: raw.fees?.monthlyFeeCents ?? DEFAULT_FEES.monthlyFeeCents,
    joiningFeeCents: raw.fees?.joiningFeeCents ?? DEFAULT_FEES.joiningFeeCents,
  };
  const members = (raw.members ?? seed.members).map((m) => {
    const legacy = m as Member & { annualFeeCents?: number };
    const isLegacyAnnualMember = m.monthlyFeeCents == null && legacy.annualFeeCents != null;
    return {
      ...m,
      monthlyFeeCents: m.monthlyFeeCents ?? legacy.annualFeeCents ?? fees.monthlyFeeCents,
      joiningFeeCents: m.joiningFeeCents ?? fees.joiningFeeCents,
      joiningFeePaidAt: m.joiningFeePaidAt ?? (isLegacyAnnualMember ? m.joinDate : undefined),
      nextRenewal: normalizeNextPaymentDate(m),
    };
  });
  const payments = (raw.payments ?? seed.payments).map((payment) => ({
    ...payment,
    period: payment.period?.length === 4 ? new Date().toISOString().slice(0, 7) : payment.period,
    kind: payment.kind ?? ("monthly_fee" as const),
  }));
  const products = normalizeProducts(raw.products ?? seed.products);

  // Re-seed the gallery whenever the seed version changes, so saved demos
  // pick up newly added photos instead of keeping the old set.
  const galleryPhotos =
    raw.galleryVersion === seed.galleryVersion
      ? (raw.galleryPhotos ?? seed.galleryPhotos)
      : seed.galleryPhotos;

  return {
    fees,
    prospects: raw.prospects ?? seed.prospects,
    members,
    payments,
    products,
    orders: raw.orders ?? seed.orders,
    galleryPhotos,
    galleryVersion: seed.galleryVersion,
    sponsors: raw.sponsors ?? seed.sponsors,
    matches:
      raw.matchesVersion === seed.matchesVersion ? (raw.matches ?? seed.matches) : seed.matches,
    matchesVersion: seed.matchesVersion,
    newsPosts: raw.newsPosts ?? seed.newsPosts,
  };
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);

  const value = useMemo<AdminContextValue>(() => {
    return {
      ...data,
      addProspect: (input) => {
        const id = uid();
        const prospect: Prospect = {
          id,
          ...input,
          ageGroup: ageGroupFromDob(input.dob),
          status: "new",
          notes: [],
          createdAt: nowIso(),
        };
        setData((d) => ({ ...d, prospects: [prospect, ...d.prospects] }));
        return id;
      },
      setProspectStatus: (id, status) =>
        setData((d) => ({
          ...d,
          prospects: d.prospects.map((p) => (p.id === id ? { ...p, status } : p)),
        })),
      addProspectNote: (id, text) =>
        setData((d) => ({
          ...d,
          prospects: d.prospects.map((p) =>
            p.id === id
              ? { ...p, notes: [...p.notes, { id: uid(), text, at: nowIso() }] }
              : p
          ),
        })),
      convertProspect: (id) =>
        setData((d) => {
          const p = d.prospects.find((x) => x.id === id);
          if (!p) return d;
          const memberId = uid();
          const member: Member = {
            id: memberId,
            firstName: p.childFirst || p.parentName.split(" ")[0] || "Player",
            lastName: p.childLast || "",
            dob: p.dob,
            team: p.ageGroup || ageGroupFromDob(p.dob) || "U9",
            guardianName: p.parentName,
            guardianPhone: p.phone,
            guardianEmail: p.email,
            joinDate: todayDate(),
            monthlyFeeCents: d.fees.monthlyFeeCents,
            joiningFeeCents: d.fees.joiningFeeCents,
            status: "overdue",
            nextRenewal: todayDate(),
            prospectId: p.id,
            photoConsent: p.photoConsent,
          };
          return {
            ...d,
            members: [member, ...d.members],
            prospects: d.prospects.map((x) => (x.id === id ? { ...x, status: "joined" } : x)),
          };
        }),
      addMember: (input) =>
        setData((d) => {
          const member: Member = {
            id: uid(),
            ...input,
            joinDate: todayDate(),
            monthlyFeeCents: d.fees.monthlyFeeCents,
            joiningFeeCents: d.fees.joiningFeeCents,
            status: "overdue",
            nextRenewal: todayDate(),
          };
          return { ...d, members: [member, ...d.members] };
        }),
      recordPayment: (memberId) =>
        setData((d) => {
          const m = d.members.find((x) => x.id === memberId);
          if (!m) return d;
          const joiningDue = memberJoiningFeeDueCents(m);
          const period = monthPeriod(m.nextRenewal);
          const payment: Payment = {
            id: uid(),
            memberId,
            period,
            amountCents: memberPaymentDueCents(m),
            kind: joiningDue > 0 ? "joining_and_monthly" : "monthly_fee",
            status: "paid",
            paidAt: nowIso(),
          };
          return {
            ...d,
            members: d.members.map((x) =>
              x.id === memberId
                ? {
                    ...x,
                    status: "active",
                    joiningFeePaidAt: x.joiningFeePaidAt ?? (joiningDue > 0 ? nowIso() : undefined),
                    nextRenewal: addOneMonth(x.nextRenewal),
                  }
                : x
            ),
            payments: [payment, ...d.payments],
          };
        }),
      updateFeeSettings: (input, applyToExistingMembers = false) =>
        setData((d) => {
          const fees = {
            monthlyFeeCents: Math.max(0, Math.round(input.monthlyFeeCents)),
            joiningFeeCents: Math.max(0, Math.round(input.joiningFeeCents)),
          };
          return {
            ...d,
            fees,
            members: applyToExistingMembers
              ? d.members.map((m) => ({
                  ...m,
                  monthlyFeeCents: fees.monthlyFeeCents,
                  joiningFeeCents: m.joiningFeePaidAt ? m.joiningFeeCents : fees.joiningFeeCents,
                }))
              : d.members,
          };
        }),
      addProduct: (input) =>
        setData((d) => {
          const id = nextProductId(d.products);
          const product: Product = {
            id,
            slug: uniqueSlug(input.name, d.products),
            name: input.name,
            description: input.description,
            category: input.category,
            price_cents: Math.max(0, Math.round(input.priceCents)),
            active: input.active,
            tone: toneForCategory(input.category),
            photo: input.photo || undefined,
            variants: buildVariants(id, input.variantMode, input.stockQty),
          };
          return { ...d, products: [product, ...d.products] };
        }),
      updateProduct: (product) =>
        setData((d) => ({
          ...d,
          products: normalizeProducts(
            d.products.map((current) =>
              current.id === product.id
                ? {
                    ...product,
                    slug: product.slug || uniqueSlug(product.name, d.products),
                    tone: product.tone ?? toneForCategory(product.category),
                    photo: product.photo || undefined,
                  }
                : current
            )
          ),
        })),
      addOrder: (input) => {
        const orderNumber = `GKSA-${new Date().getFullYear()}-${String(
          Math.floor(100000 + Math.random() * 900000)
        )}`;
        const order: AdminOrder = {
          id: uid(),
          orderNumber,
          customerName: input.customerName,
          items: input.items,
          itemsCount: input.items.reduce((sum, i) => sum + i.qty, 0),
          totalCents: input.totalCents,
          status: "pending",
          createdAt: nowIso(),
        };
        setData((d) => ({ ...d, orders: [order, ...d.orders] }));
        return orderNumber;
      },
      updateOrderStatus: (id, status) =>
        setData((d) => ({
          ...d,
          orders: d.orders.map((order) => (order.id === id ? { ...order, status } : order)),
        })),
      addGalleryPhoto: (input) =>
        setData((d) => {
          const photo: GalleryPhoto = {
            id: uid(),
            src: input.src,
            caption: input.caption,
            category: input.category,
            createdAt: nowIso(),
          };
          return { ...d, galleryPhotos: [...d.galleryPhotos, photo] };
        }),
      updateGalleryPhoto: (id, patch) =>
        setData((d) => ({
          ...d,
          galleryPhotos: d.galleryPhotos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removeGalleryPhoto: (id) =>
        setData((d) => ({
          ...d,
          galleryPhotos: d.galleryPhotos.filter((p) => p.id !== id),
        })),
      moveGalleryPhoto: (id, direction) =>
        setData((d) => {
          const photos = [...d.galleryPhotos];
          const i = photos.findIndex((p) => p.id === id);
          const j = i + direction;
          if (i < 0 || j < 0 || j >= photos.length) return d;
          [photos[i], photos[j]] = [photos[j], photos[i]];
          return { ...d, galleryPhotos: photos };
        }),
      addMatch: (input) =>
        setData((d) => {
          const match: Match = {
            id: uid(),
            team: input.team,
            opponent: input.opponent,
            date: input.date,
            venue: input.venue,
            status: input.status,
            gf: input.status === "played" ? input.gf : undefined,
            ga: input.status === "played" ? input.ga : undefined,
            createdAt: nowIso(),
          };
          return { ...d, matches: [match, ...d.matches] };
        }),
      updateMatch: (id, patch) =>
        setData((d) => ({
          ...d,
          matches: d.matches.map((m) => {
            if (m.id !== id) return m;
            const merged = { ...m, ...patch };
            if (merged.status === "upcoming") {
              merged.gf = undefined;
              merged.ga = undefined;
            }
            return merged;
          }),
        })),
      removeMatch: (id) =>
        setData((d) => ({ ...d, matches: d.matches.filter((m) => m.id !== id) })),
      addNewsPost: (input) =>
        setData((d) => {
          const existing = new Set(d.newsPosts.map((p) => p.slug));
          let slug = slugify(input.title);
          let n = 2;
          while (existing.has(slug)) slug = `${slugify(input.title)}-${n++}`;
          const post: NewsPost = {
            id: uid(),
            slug,
            title: input.title,
            date:
              input.date?.trim() ||
              new Date().toLocaleDateString("en-ZA", { month: "long", year: "numeric" }),
            category: input.category,
            excerpt: input.excerpt,
            img: input.img || "/img/photos/academy-01.jpg",
            body: input.body
              .split(/\n{2,}/)
              .map((s) => s.trim())
              .filter(Boolean),
            createdAt: nowIso(),
          };
          return { ...d, newsPosts: [post, ...d.newsPosts] };
        }),
      updateNewsPost: (id, patch) =>
        setData((d) => ({
          ...d,
          newsPosts: d.newsPosts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removeNewsPost: (id) =>
        setData((d) => ({ ...d, newsPosts: d.newsPosts.filter((p) => p.id !== id) })),
      updateMember: (id, patch) =>
        setData((d) => ({
          ...d,
          members: d.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      removeMember: (id) =>
        setData((d) => ({ ...d, members: d.members.filter((m) => m.id !== id) })),
      removeProspect: (id) =>
        setData((d) => ({ ...d, prospects: d.prospects.filter((p) => p.id !== id) })),
      removeProduct: (id) =>
        setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) })),
      removeOrder: (id) =>
        setData((d) => ({ ...d, orders: d.orders.filter((o) => o.id !== id) })),
      updatePhotoConsent: (memberId, consent) =>
        setData((d) => ({
          ...d,
          members: d.members.map((m) => (m.id === memberId ? { ...m, photoConsent: consent } : m)),
        })),
      addSponsor: (input) =>
        setData((d) => {
          const sponsor: Sponsor = { id: uid(), ...input, addedAt: nowIso() };
          return { ...d, sponsors: [...d.sponsors, sponsor] };
        }),
      updateSponsor: (id, patch) =>
        setData((d) => ({
          ...d,
          sponsors: d.sponsors.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),
      removeSponsor: (id) =>
        setData((d) => ({ ...d, sponsors: d.sponsors.filter((s) => s.id !== id) })),
      reset: () => setData(buildSeed()),
    };
  }, [data]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

/* ----------------------------------------------------------- derived helpers */

export type RenewalState = "inactive" | "overdue" | "due" | "ok";

export const PAYMENT_FOLLOW_UP_STATES: RenewalState[] = ["due", "overdue"];
export const PROSPECT_FOLLOW_UP_STATUSES: ProspectStatus[] = [
  "new",
  "contacted",
  "trial_booked",
  "trial_attended",
];

export function renewalState(member: Member): RenewalState {
  if (member.status === "inactive") return "inactive";
  const days = (new Date(member.nextRenewal).getTime() - Date.now()) / (24 * 3600 * 1000);
  if (days < 0) return "overdue";
  if (days <= 7) return "due";
  return "ok";
}

export function memberMonthlyFeeCents(member: Member) {
  const legacy = member as Member & { annualFeeCents?: number };
  return member.monthlyFeeCents ?? legacy.annualFeeCents ?? DEFAULT_FEES.monthlyFeeCents;
}

export function memberJoiningFeeCents(member: Member) {
  return member.joiningFeeCents ?? DEFAULT_FEES.joiningFeeCents;
}

export function memberJoiningFeeDueCents(member: Member) {
  return member.joiningFeePaidAt ? 0 : memberJoiningFeeCents(member);
}

export function memberPaymentDueCents(member: Member) {
  return memberMonthlyFeeCents(member) + memberJoiningFeeDueCents(member);
}

export function isActiveMember(member: Member) {
  return member.status !== "inactive";
}

export function getActiveMembers(members: Member[]) {
  return members.filter(isActiveMember);
}

export function isPaymentFollowUp(member: Member) {
  return PAYMENT_FOLLOW_UP_STATES.includes(renewalState(member));
}

export function getPaymentFollowUps(members: Member[]) {
  return members
    .filter(isPaymentFollowUp)
    .sort((a, b) => +new Date(a.nextRenewal) - +new Date(b.nextRenewal));
}

export function paymentFollowUpTotalCents(members: Member[]) {
  return getPaymentFollowUps(members).reduce(
    (sum, member) => sum + memberPaymentDueCents(member),
    0
  );
}

export function prospectName(prospect: Prospect) {
  return [prospect.childFirst, prospect.childLast].filter(Boolean).join(" ") || prospect.parentName;
}

export function isProspectFollowUp(prospect: Prospect) {
  return PROSPECT_FOLLOW_UP_STATUSES.includes(prospect.status);
}

export function prospectFollowUpPriority(status: ProspectStatus) {
  const order: Record<ProspectStatus, number> = {
    new: 0,
    trial_booked: 1,
    trial_attended: 2,
    contacted: 3,
    joined: 4,
    declined: 5,
  };
  return order[status];
}

export function getProspectFollowUps(prospects: Prospect[]) {
  return prospects
    .filter(isProspectFollowUp)
    .sort((a, b) => {
      const priorityDelta = prospectFollowUpPriority(a.status) - prospectFollowUpPriority(b.status);
      if (priorityDelta !== 0) return priorityDelta;
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });
}

export function isOrderNeedingReview(order: AdminOrder) {
  return order.status === "pending";
}

export function getPendingOrders(orders: AdminOrder[]) {
  return orders.filter(isOrderNeedingReview);
}

export function getTeamSummaries(members: Member[]) {
  return AGE_GROUPS.map((team) => {
    const roster = members.filter((member) => member.team === team && isActiveMember(member));
    return {
      team,
      members: roster,
      count: roster.length,
      monthlyTotalCents: roster.reduce((sum, member) => sum + memberMonthlyFeeCents(member), 0),
    };
  });
}

export interface Kpis {
  activeMembers: number;
  overdueRenewals: number;
  newProspectsThisMonth: number;
  monthlyRevenueCents: number;
  outstandingCents: number;
  funnel: { status: ProspectStatus; count: number }[];
}

export function computeKpis(data: AdminData): Kpis {
  const now = new Date();
  const active = getActiveMembers(data.members);
  const paymentFollowUps = getPaymentFollowUps(data.members);
  const newProspects = data.prospects.filter((p) => {
    const c = new Date(p.createdAt);
    return c.getMonth() === now.getMonth() && c.getFullYear() === now.getFullYear();
  });
  const funnelOrder: ProspectStatus[] = [
    "new",
    "contacted",
    "trial_booked",
    "trial_attended",
    "joined",
    "declined",
  ];
  return {
    activeMembers: active.length,
    overdueRenewals: paymentFollowUps.length,
    newProspectsThisMonth: newProspects.length,
    monthlyRevenueCents: active.reduce((s, m) => s + memberMonthlyFeeCents(m), 0),
    outstandingCents: paymentFollowUps.reduce((s, m) => s + memberPaymentDueCents(m), 0),
    funnel: funnelOrder.map((status) => ({
      status,
      count: data.prospects.filter((p) => p.status === status).length,
    })),
  };
}
