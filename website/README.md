<div align="center">

<img src="./public/img/og-image.png" alt="Golden Knights Soccer Academy" width="480" />

# Golden Knights Soccer Academy

**Youth football coaching in Midrand.** The official academy website: programmes, teams, news, merchandise, and sponsorship.

[![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Motion](https://img.shields.io/badge/Motion-11-0055FF?logo=framer&logoColor=white)](https://motion.dev)

![Status](https://img.shields.io/badge/status-in%20development-ee3030)
![License](https://img.shields.io/badge/license-private-555)
![Brand](https://img.shields.io/badge/brand-%23EE3030-ee3030)

</div>

---

## Overview

A fast, mobile-first, award-quality marketing site for a youth football academy. It is built to win two audiences at once: families looking to book a trial, and businesses looking to sponsor. The shop is a fully interactive storefront backed by an in-memory catalogue that mirrors a MySQL schema, ready to connect to a real backend.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 4 (design tokens in `src/index.css`) |
| UI primitives | shadcn-style components (Radix Slot, CVA) |
| Animation | Motion (Framer Motion) + Lenis smooth scroll |
| Icons | lucide-react |
| Routing | react-router-dom 6 |
| Tooling | ESLint 9 (flat config) + Prettier |

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | TypeScript check (strict, no unused) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write over `src/` |

## Project structure

```
src/
├── main.tsx                 App entry + Router
├── App.tsx                  Route table (one entry per page)
├── index.css                Tailwind 4 theme + brand tokens (#EE3030)
├── components/
│   ├── layout/              Header, Footer, Layout (Lenis + cart)
│   ├── ui/                  Button, Field, Reveal, SectionHeading,
│   │                        PageHero, StepProgress
│   └── shop/                ProductTile, CartDrawer
├── hooks/useLenis.ts        Smooth scroll
├── lib/utils.ts             cn() + ZAR formatter
├── data/                    site (nav, stats, tiers), news, products
├── shop/cart.tsx            Cart context (localStorage persisted)
└── pages/                   Home, About, Programmes, Sponsors, Contact,
                             Teams, Gallery, News, Register, Shop, Product,
                             Checkout, Placeholder
```

### Shared building blocks

- **`PageHero`** powers every interior page hero (eyebrow, title, optional photo, actions).
- **`StepProgress`** drives both the Register and Sponsor wizards.
- **`Field`** auto-wires labels, ids, `aria-*`, helper and error text for accessible forms.
- **`SectionHeading` / `Eyebrow` / `Reveal`** keep section rhythm and scroll animations consistent.

## Pages

Home · About · Programmes · Teams & Fixtures · Gallery · News · **Sponsors** · Register · **Shop** · Contact

Primary nav: Programmes, Teams, About, Contact, plus a **More** menu (Gallery, News, Shop). Global CTAs: **Book a Trial** and **Sponsor a Player**.

## Shop (MySQL-ready)

The storefront is fully interactive: browse, filter, sort, pick a size, add to a persistent cart, and check out with a generated order number. The catalogue in `src/data/products.ts` mirrors the database schema (`products` / `product_variants`), stores prices in **cents**, and formats them as ZAR. To go live, replace the in-memory catalogue with API calls and connect a South African payment gateway. The data shapes stay the same. Full schema: `../content/10-shop.md`.

## Brand

Red `#EE3030` · Oswald (display) · Archivo (headings) · Inter (body). Logo and assets live in `public/img`. Source brand pack: `../brand`.

> House style: no em dashes anywhere. Use commas, colons, or parentheses.

## Before launch

- Wire the Contact, Register, and Sponsor forms to email/API.
- Replace placeholder media: coach photos, sponsor logos, product images, fixtures and results.
- Confirm founding year and founder name spelling, training venue address, and current fees.
- Connect a payment gateway for the shop.
