# GKSA Website, Page Content Specs

Content-spec files for every page on the Golden Knights Soccer Academy website.
Each file is a section-by-section brief, purpose, content, draft copy, CTAs, SEO, and an assets checklist, ready to hand to a designer or developer.

Based on the **GKSA Website Plan & Blueprint** (in the parent folder).

## Pages (10)

| # | Page | File | Phase | Primary audience |
|---|---|---|---|---|
| 1 | Home | `01-home.md` | 1 | All |
| 2 | About | `02-about.md` | 1 | Sponsors + Parents |
| 3 | Programmes | `03-programmes.md` | 1 | Parents |
| 4 | Sponsors & Partners ⭐ | `04-sponsors.md` | 1 | Sponsors |
| 5 | Contact | `05-contact.md` | 1 | All |
| 6 | Teams & Fixtures | `06-teams-fixtures.md` | 2 | Community + Parents |
| 7 | Gallery | `07-gallery.md` | 2 | All |
| 8 | News / Blog | `08-news.md` | 2 | Community |
| 9 | Register / Join | `09-register.md` | 1 (form) → 2 | Parents |
| 10 | Shop / Merchandise | `10-shop.md` | 2/3, MySQL-backed | Community |

⭐ = the centrepiece page (digital version of the sponsorship proposal).

## Global elements (on every page)
- **Header:** logo + nav (Home · About · Programmes · Teams & Fixtures · Gallery · News · Sponsors · Contact) + CTAs "Register / Join" and "Become a Sponsor".
- **Footer:** logo, mission line, nav, contacts, social links, "Become a Sponsor" button.
- **Brand:** red `#EE3030`, white knight crest, asset pack favicons/manifest/social images.

## Store note
The Shop runs on **MySQL**, mocked data for now (seeded catalogue, simulated payment) but built to feel and behave like a real store, so it can flip to live with minimal change. Full schema in `10-shop.md`.

## Open items to confirm (recurring across pages)
- Founding year (2016?) and founder name spelling (Katlego Ntsheke / Katleho Ntsekhe).
- Current age groups, training schedule, venue, and fees.
- Training base address (for maps).
- Current sponsor list, logos, and tiers.
- Form recipient email(s) and a branded `info@` address.
