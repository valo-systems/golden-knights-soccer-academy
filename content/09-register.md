# Register / Join, Page Content Spec

| | |
|---|---|
| **Slug** | `/register` |
| **In nav** | Via header CTA "Join the Academy" (+ linked from Programmes) |
| **Priority** | Phase 1 (as a form) → standalone page Phase 2 |
| **Primary audience** | Parents & prospective players |
| **Page goal** | Convert interest into a trial booking / registration enquiry. |
| **Primary CTA** | Submit registration / trial request |

---

## Section 1, Page hero

**Heading:** Join Golden Knights Soccer Academy
**Sub:** *Book a trial and take the first step. We welcome players of all backgrounds.*

---

## Section 2, Registration / trial form

**Player details:**
- Player first & last name
- Date of birth (drives age group)
- Position (optional)
- Previous experience (optional)

**Parent / guardian details:**
- Name
- Email (required)
- Phone (required)
- Preferred age group (auto-suggested from DOB)
- How did you hear about us? (optional)
- Message / questions

**Consent:** checkbox for POPIA-compliant data consent (SA privacy law) + link to privacy note.

**Behaviour:** validation, success/error states, routes to academy email; spam protection.

---

## Section 3, What happens next

**Draft copy (3 steps):**
1. We'll contact you to confirm a trial session.
2. Your child attends and meets the coaches.
3. Complete registration and join the team.

---

## Section 4, Fees & assistance (optional)

Short note on fees (or "we'll share current fees when we contact you") and a line that financial assistance is available for players who need it.

---

## Data note (for build)
For launch this can be a simple form emailing the academy. If the MySQL backend is built, store submissions in a `registrations` table (player + guardian fields, age_group, created_at, status) so the academy can track and follow up, mock with a few sample entries so an admin view feels real.

## SEO
- **Title tag:** Register / Book a Trial | GKSA Midrand
- **Meta description:** Join Golden Knights Soccer Academy in Midrand. Book a trial for your child today, all backgrounds welcome.

## Assets checklist
- [ ] Age-group mapping from DOB
- [ ] POPIA consent wording
- [ ] Form recipient confirmed
- [ ] Fees/assistance wording approved
