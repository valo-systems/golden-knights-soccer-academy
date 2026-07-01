/**
 * Admin domain types. These mirror the future MySQL tables
 * (prospects / members / payments) described in content/11-admin-portal.md.
 * Money is stored in CENTS.
 */

export const AGE_GROUPS = ["U9", "U11", "U13", "U13+"] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export const PROSPECT_STATUSES = [
  "new",
  "contacted",
  "trial_booked",
  "trial_attended",
  "joined",
  "declined",
] as const;
export type ProspectStatus = (typeof PROSPECT_STATUSES)[number];

export const PROSPECT_STATUS_LABEL: Record<ProspectStatus, string> = {
  new: "New",
  contacted: "Contacted",
  trial_booked: "Trial booked",
  trial_attended: "Trial attended",
  joined: "Joined",
  declined: "Declined",
};

export type ProspectSource = "Trial form" | "Contact" | "Manual";

export interface ProspectNote {
  id: string;
  text: string;
  at: string; // ISO
}

export interface Prospect {
  id: string;
  childFirst?: string;
  childLast?: string;
  dob?: string;
  ageGroup?: AgeGroup;
  parentName: string;
  phone: string;
  email?: string;
  source: ProspectSource;
  message?: string;
  status: ProspectStatus;
  notes: ProspectNote[];
  photoConsent?: boolean;
  createdAt: string; // ISO
}

export type MemberStatus = "active" | "overdue" | "inactive";

export interface AdminFeeSettings {
  monthlyFeeCents: number;
  joiningFeeCents: number;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  dob?: string;
  team: AgeGroup;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  joinDate: string; // ISO date
  monthlyFeeCents: number; // copied from admin fee settings when the member joins
  joiningFeeCents: number; // copied from admin fee settings when the member joins
  joiningFeePaidAt?: string; // ISO datetime once the once-off joining fee is paid
  status: MemberStatus;
  nextRenewal: string; // ISO date for the next monthly fee
  prospectId?: string;
  photoConsent?: boolean;
}

export type PaymentStatus = "paid" | "due" | "overdue";
export type PaymentKind = "monthly_fee" | "joining_fee" | "joining_and_monthly";

export interface Payment {
  id: string;
  memberId: string;
  period: string; // membership month, e.g. "2026-06"
  amountCents: number;
  kind: PaymentKind;
  status: PaymentStatus;
  paidAt?: string; // ISO
}

export interface AdminOrderItem {
  productId: number;
  productName: string;
  variantLabel: string;
  qty: number;
  unitCents: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  itemsCount: number;
  totalCents: number;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  createdAt: string; // ISO
  items?: AdminOrderItem[];
}

export const GALLERY_CATEGORIES = ["Match days", "Training", "Team", "Community"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export interface GalleryPhoto {
  id: string;
  src: string; // public path, remote URL, or uploaded data URL
  caption?: string;
  category: GalleryCategory;
  createdAt: string; // ISO
}

/* --------------------------------------------------------------- Matches */

export interface Match {
  id: string;
  team: AgeGroup;
  opponent: string;
  date: string; // ISO date
  venue?: string;
  status: "upcoming" | "played";
  gf?: number; // goals for (GKSA)
  ga?: number; // goals against
  createdAt: string;
}

export function matchOutcome(m: Match): "W" | "D" | "L" | null {
  if (m.status !== "played" || m.gf == null || m.ga == null) return null;
  if (m.gf > m.ga) return "W";
  if (m.gf < m.ga) return "L";
  return "D";
}

/* ----------------------------------------------------------------- News */

export const NEWS_CATEGORIES = ["Academy news", "Match reports", "Community", "Sponsors"] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  date: string; // display label, e.g. "June 2026"
  category: NewsCategory;
  excerpt: string;
  img: string;
  body: string[];
  createdAt: string; // ISO, for ordering
}

/* --------------------------------------------------------------- Sponsors */

export interface Sponsor {
  id: string;
  name: string;
  tier: string;
  tagline?: string;
  description?: string;
  logo?: string;
  website?: string;
  status: "pending" | "approved";
  addedAt: string; // ISO
}

export const DEFAULT_MONTHLY_FEE_CENTS = 50000; // R500 per month
export const DEFAULT_JOINING_FEE_CENTS = 25000; // R250 once-off joining fee

export const DEFAULT_FEES: AdminFeeSettings = {
  monthlyFeeCents: DEFAULT_MONTHLY_FEE_CENTS,
  joiningFeeCents: DEFAULT_JOINING_FEE_CENTS,
};

export function ageGroupFromDob(dob?: string): AgeGroup | undefined {
  if (!dob) return undefined;
  const age = (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000);
  if (age < 10) return "U9";
  if (age < 12) return "U11";
  if (age < 14) return "U13";
  return "U13+";
}
