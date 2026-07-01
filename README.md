<div align="center">

<img src="./brand/og-image-1200x630.png" alt="Golden Knights Soccer Academy" width="480" />

# Golden Knights Soccer Academy

**Youth football coaching in Midrand.** Strategy, brand assets, page content, and the full website build for the official GKSA online presence.

![Status](https://img.shields.io/badge/status-demo%20ready-ee3030)
![License](https://img.shields.io/badge/license-private-555)
![Brand](https://img.shields.io/badge/brand-%23EE3030-ee3030)

</div>

---

## Overview

This repository is the single source of truth for the GKSA digital project. It contains the strategic plan and blueprint, all page content specs, the complete brand asset pack, and the production website build. The site is a fast, mobile-first marketing site built to win two audiences at once: families looking to book a trial, and businesses looking to sponsor.

## Repository structure

```
Golden Knights Soccer Academy/
├── README.md                          You are here
├── AGENTS.md                          Claude Code project instructions
├── docs/
│   ├── website-plan-and-blueprint.docx   Strategy, sitemap, sponsor funnel, roadmap
│   └── sponsorship-proposal.pdf          Academy sponsorship proposal (source)
├── content/                           Page content specs, one file per page
│   ├── README.md                         Index of all 11 pages with phases and audiences
│   └── 01-home.md … 10-shop.md, 11-admin-portal.md
├── brand/                             Web-ready asset pack
│   ├── README.md                         Asset usage notes and colour reference (#EE3030)
│   ├── gksa-logo.svg, logo-source.png    Master logo and source
│   └── icons, og-image, twitter-card, site.webmanifest, favicons …
├── media/
│   ├── photos/                           academy-01 … academy-11 (training and match day)
│   └── audio/                            soccer-laduma-spotlight.mp3 (podcast feature)
└── website/                           React + TypeScript website (see website/README.md)
```

## Where to start

| Task | Go to |
|------|-------|
| Understand the project strategy | `docs/website-plan-and-blueprint.docx` |
| Write or review page copy | `content/` (one `.md` per page) |
| Drop brand assets into the site | `brand/` (see `brand/README.md` for usage) |
| Work on the website build | `website/` (see `website/README.md`) |
| Understand the shop data model | `content/10-shop.md` |
| Understand the admin portal spec | `content/11-admin-portal.md` |

## Pages (11)

Home · About · Programmes · Sponsors · Contact · Teams & Fixtures · Gallery · News · Register · Shop · **Admin Portal**

See `content/README.md` for per-page phase, audience, and priority notes.

## Website

The `website/` folder is a standalone React 18 + TypeScript + Vite 6 application. Full tech stack, scripts, and component docs are in `website/README.md`.

**Key traits:**
- Fully interactive shop: browse, filter, sort, add to a persistent cart, and check out.
- Product images sourced from Pexels (free, hotlink-safe) with graceful fallback to branded tiles.
- Catalogue in `website/src/data/products.ts` mirrors the MySQL schema and stores prices in cents.
- Admin portal at `/admin` behind a login: prospects pipeline, members + renewals, shop orders, and a live dashboard. Data is persisted to `localStorage` with the same shapes as the planned MySQL tables.

## Admin portal

A coach-facing management area built for the Thursday demo. It runs entirely in the browser on an in-memory store (React context + `localStorage`) that mirrors the future MySQL schema.

| Route | Screen |
|-------|--------|
| `/admin/login` | Branded sign-in |
| `/admin` | Dashboard: active members, overdue fees, new prospects, monthly revenue |
| `/admin/prospects` | Kanban pipeline: trial bookings from the public site, WhatsApp links, convert-to-member |
| `/admin/members` | Searchable member list; add member; R500/month + R250 joining fee |
| `/admin/renewals` | Due and overdue payments; mark paid advances next renewal date |
| `/admin/orders` | Read-only shop orders |

Public **Register** and **Contact** forms write directly into the prospects store, so the "fill a form, watch it appear in admin" demo moment works end-to-end.

**Post-demo:** the in-memory store swaps for a PHP REST API without touching the UI. Payment processing (Peach Payments / PayFast) is phase 2.

## Brand

Red `#EE3030` · Oswald (display) · Archivo (headings) · Inter (body). Source pack in `brand/`. Drop the folder contents straight into `website/public`.

> House style: no em dashes anywhere. Use commas, colons, or parentheses.

## Sponsors

Agape Water is confirmed as the official hydration partner. Logo is live on the Sponsors page.

## Open items to confirm

- Founding year (2016?) and founder name spelling (Katlego Ntsheke / Katleho Ntsekhe).
- Age groups, training schedule, venue, and current fees.
- Training base address (for the embedded map).
- Additional sponsor logos and tier assignments.
- Form recipient email(s) and a branded `info@` address.
- Domain name confirmed and hosting arranged.
- Payment gateway choice (Peach Payments, PayFast, or similar) for phase 2.
