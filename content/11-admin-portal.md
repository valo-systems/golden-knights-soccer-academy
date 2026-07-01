# Admin Portal, Plan & Spec (Thursday demo)

A management area for the academy, behind a login, that turns website captures into members and tracks the R500/month membership plus R250 once-off joining fee. Built for the Thursday coach demo on an in-memory store that mirrors the future MySQL schema, so it maps to a real backend with minimal change.

---

## 1. Goal

Show the coaches that the website is not just a brochure: it captures prospects and runs the academy's admin.

- **Record-keeping:** every trial booking / enquiry from the site lands in a pipeline.
- **Membership:** convert a prospect to a member at **R500/month** (flat across all teams) plus a **R250 joining fee**, and track monthly payments.
- **At a glance:** dashboard with members, overdue fees, new prospects, and monthly membership revenue.

---

## 2. Scope for the demo

In scope (confirmed):

1. **Dashboard** (KPIs + revenue)
2. **Prospects pipeline** (capture from site + convert to member)
3. **Members + Renewals** (R500/month + R250 joining fee tracking, mark paid)
4. **Shop orders** (read-only list)

Extra academy-relevant features (include if time allows, otherwise phase 2): see section 8.

---

## 3. Data model (in-memory now, MySQL later)

Three core records plus a reference to the existing shop orders. Money stored in **cents**.

### prospects
| Field | Type | Notes |
|-------|------|-------|
| id | string/int | |
| child_first, child_last | string | |
| dob | date | drives age group |
| age_group | enum | U9 / U11 / U13 / U13+ (derived) |
| parent_name | string | |
| phone | string | WhatsApp number |
| email | string? | optional (matches public form) |
| source | enum | Trial form / Contact / Manual |
| message | text? | |
| status | enum | new, contacted, trial_booked, trial_attended, joined, declined |
| notes | array? | follow-up timeline (nice-to-have) |
| created_at | datetime | |

### members
| Field | Type | Notes |
|-------|------|-------|
| id | string/int | |
| first_name, last_name | string | |
| dob | date | |
| team | enum | age group |
| guardian_name, guardian_phone, guardian_email | string | |
| join_date | date | |
| monthly_fee_cents | int | default 50000 (R500/month) |
| joining_fee_cents | int | default 25000 (R250 once-off) |
| joining_fee_paid_at | datetime? | set once the joining fee has been paid |
| status | enum | active, overdue, inactive |
| next_renewal_date | date | next monthly payment date |
| prospect_id | fk? | link back to the prospect they came from |

### payments
| Field | Type | Notes |
|-------|------|-------|
| id | string/int | |
| member_id | fk | |
| period | string | membership month, "YYYY-MM" |
| amount_cents | int | monthly fee, or monthly fee + unpaid joining fee |
| kind | enum | monthly_fee / joining_fee / joining_and_monthly |
| status | enum | paid, due, overdue |
| paid_at | datetime? | |
| method | enum? | cash / EFT (optional) |

### orders
Already defined in `10-shop.md` (`orders` / `order_items`). Admin reads this for the orders list.

---

## 4. In-memory store design

- **`src/admin/store.tsx`**: an `AdminProvider` React context holding `prospects`, `members`, `payments`, seeded with sample data and **persisted to `localStorage`** (key `gksa-admin`) so it survives refreshes during the demo.
- **Actions:** `addProspect`, `updateProspectStatus`, `convertProspectToMember`, `addMember`, `recordPayment(memberId, period)`, plus derived selectors for KPIs.
- **Renewal logic:** a member is **Due** if `next_renewal_date` is within the next ~7 days, **Overdue** if past. `recordPayment` writes a `payments` row, includes the joining fee if it is still unpaid, advances `next_renewal_date` by one month, and sets status Active.
- **Fee settings:** admin can edit the monthly fee and joining fee in the Members screen; new members and prospect conversions use those settings.
- **Capture wiring:** the public **Register** wizard calls `addProspect` on submit (source = Trial form). The **Contact** form also creates prospects (source = Contact). This is what makes the demo's "fill form, watch it appear in admin" moment work.
- **Reset:** a "Reset demo data" button restores the seed, so the demo can be re-run cleanly.

Same shapes as the MySQL tables, so the real build swaps the context for API calls.

---

## 5. Access / auth (demo)

- Login screen at **`/admin/login`** with **hardcoded credentials**:
  - Email: `sibusiso.mashita@goldenknightsfc.co.za`
  - Password: `Pass@123`
- Session flag kept in memory/localStorage; all `/admin/*` routes redirect to login when not signed in.
- **Security note:** hardcoded, client-side credentials are visible in the built JavaScript and are for the demo only. The real version needs proper server-side authentication. (Password will not be stored in project memory.)

---

## 6. Screens / routes

| Route | Screen | Key contents & actions |
|-------|--------|------------------------|
| `/admin/login` | Login | Branded sign-in, hardcoded check |
| `/admin` | Dashboard | KPI cards: active members, overdue fees, new prospects (this month), **monthly membership revenue** (active × monthly fee), outstanding amount; prospect funnel; recent activity |
| `/admin/prospects` | Pipeline | Table or board grouped by status; filter/search; row actions: change status, **Convert to member**, WhatsApp link; add prospect manually |
| `/admin/members` | Members | Searchable list; status + next payment date; add member; open member detail |
| `/admin/renewals` | Renewals | Due + overdue monthly payments; **Mark paid** (advances payment date by one month); shows monthly fee plus any unpaid joining fee and total collected/outstanding |
| `/admin/orders` | Orders | Read-only list of shop orders with status and totals |

Shared **admin shell**: left sidebar (logo, nav, sign out), separate from the public header/footer.

---

## 7. The demo script (Thursday)

1. Public site: open **Book a Trial**, fill it in, submit.
2. Sign in at **/admin** with the hardcoded login.
3. **Prospects:** the new trial booking is sitting in "New". Move it along, then **Convert to member**.
4. **Members:** the new member appears at R500/month plus the R250 joining fee with a payment date.
5. **Renewals:** click **Mark paid**; status flips to Active, joining fee is marked paid if due, and next payment advances by one month.
6. **Dashboard:** revenue and counts update live.
7. (Optional) **Orders:** show a shop order in the same admin.

Seeded with ~8 members, a few prospects, and a couple of orders so it looks like a live operation.

---

## 8. Extra academy-relevant features

Cheap, high-impact additions to consider (in priority order):

- **WhatsApp quick-action** on every prospect/member (`wa.me` link). Coaches live on WhatsApp; very persuasive.
- **Prospect notes / timeline** (record each follow-up). Reinforces the "record-keeping" ask.
- **CSV export** of members and prospects.
- **Team rosters** (members grouped by age group), useful per coach.

Future (post-demo, real build):

- Attendance register per training session.
- Coach accounts and roles (not just one admin).
- Automated renewal reminders by email/WhatsApp.
- POPIA consent records and document storage.
- Real payments (debit order / gateway) feeding the payments table.

---

## 9. Public site changes (tie-ins)

- **Programmes:** add a clear pricing line, "R500 per month, all age groups, plus R250 once-off joining fee."
- **Register:** show R500/month and the R250 joining fee in the fees area, and write submissions into the prospects store.
- **Contact:** route relevant enquiries into prospects too.

---

## 10. Build sequence (when approved)

1. Admin data model + seed + `AdminProvider` (localStorage).
2. Auth: login page + route guard + sign out.
3. Admin shell (sidebar layout) + routes.
4. Dashboard (KPIs + revenue + funnel).
5. Prospects pipeline + convert-to-member.
6. Members + Renewals (mark paid).
7. Shop orders list.
8. Wire Register (and optionally Contact) to create prospects.
9. Public pricing copy (R500).
10. Extras from section 8 if time.
11. Verify typecheck / lint / build; write a one-page demo script.

---

## 11. Open decisions

- **Admin password:** `Pass@123`.
- **Contact capture:** yes, Contact creates prospects.
- **Pipeline:** kanban board for the Thursday demo.
- **Extras:** include WhatsApp actions, notes/timeline, CSV export, and team rosters now.
- **Future:** include a visible online-payment affordance, but keep real payment processing for phase 2.
