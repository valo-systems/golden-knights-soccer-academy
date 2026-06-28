# News / Blog, Page Content Spec

| | |
|---|---|
| **Slug** | `/news` (posts at `/news/{slug}`) |
| **In nav** | Yes |
| **Priority** | Phase 2 |
| **Primary audience** | Community (also drives SEO + social) |
| **Page goal** | Keep the site alive, celebrate achievements and partners, and feed search/social. |
| **Primary CTA** | Read post / share |

---

## Section 1, Listing page

**Contains:**
- Page heading "News & updates".
- Grid of post cards: featured image, title, category tag, date, excerpt.
- Category filter: Match reports · Academy news · Community · Sponsors.
- Pagination or "load more".

---

## Section 2, Single post template

**Contains:**
- Title, date, author, category, featured image.
- Body (rich text: headings, images, quotes).
- Share buttons (WhatsApp, Facebook, X) using the asset-pack share images.
- "Related posts" + a CTA band (Join / Sponsor).

---

## Recommended launch posts
1. "Welcome to the new GKSA website", announcement.
2. A founding-story / milestone post (since 2016).
3. A sponsor spotlight / thank-you post (great for showing partnership well).
4. A recent match report or tournament recap.

---

## Data note (for build)
Posts should be manageable without a developer (CMS), or, if the MySQL backend is built, a `posts` table (id, slug, title, body, excerpt, category, featured_image, published_at). Mock with 3–4 seed posts so the section feels real at launch.

## SEO
- **Title tag:** News & Updates | Golden Knights Soccer Academy
- **Meta description:** Match reports, achievements, and academy news from Golden Knights Soccer Academy in Midrand.
- **Note:** Each post needs its own title tag + meta description; this is the main SEO engine over time.

## Assets checklist
- [ ] 3–4 launch posts written
- [ ] Featured image per post
- [ ] Category list confirmed
