# Teams & Fixtures, Page Content Spec

| | |
|---|---|
| **Slug** | `/teams` |
| **In nav** | Yes |
| **Priority** | Phase 2 |
| **Primary audience** | Community + Parents |
| **Page goal** | Keep families and supporters connected to squads, games, and results. |
| **Primary CTA** | Follow on social / view full fixtures |

---

## Section 1, Page hero

**Heading:** Teams & fixtures
**Sub:** *Meet our squads and follow every match.*

---

## Section 2, Squads

**Contains:** A card per age-group team:
- Team photo
- Age group + short description
- Optional: coach for that team, number of players.

**Assets needed:** Current team photos per age group.

---

## Section 3, Leagues & competitions

**Draft copy:** *GKSA competes in SAFA-affiliated league matches and tournaments through the North Rand Football Association.* (⚠️ confirm current leagues/competitions.)

---

## Section 4, Fixtures (upcoming)

**Contains:** Simple list/table, date, time, opponent, venue, age group. Kept easy to update.

| Date | Time | Team | Opponent | Venue |
|---|---|---|---|---|
| *to populate* | | | | |

---

## Section 5, Results (recent)

**Contains:** List/table, date, team, opponent, score, optional link to a match report on /news.

| Date | Team | Result | Report |
|---|---|---|---|
| *to populate* | | | |

---

## Data note (for build)
Fixtures and results should be editable without a developer, either via the chosen CMS or, if the store/DB is built, the same MySQL backend (tables: `teams`, `fixtures`, `results`). For launch, a simple editable list is enough.

## SEO
- **Title tag:** Teams, Fixtures & Results | GKSA Midrand
- **Meta description:** Follow Golden Knights Soccer Academy squads, upcoming fixtures, and recent results.

## Assets checklist
- [ ] Team photos
- [ ] Current leagues/competitions confirmed
- [ ] Initial fixtures & results to seed
