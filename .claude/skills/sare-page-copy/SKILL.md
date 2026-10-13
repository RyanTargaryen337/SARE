---
name: sare-page-copy
description: Write or rework copy for a Sàrè marketing or info page (src/lib/pages.ts, Landing, recruitment pages such as riders or vendors). Use when asked to rewrite, improve or create page copy, headlines, CTAs or an application/apply section for the Sàrè site.
---

# Sàrè page copy

Copy on this site sells, and it must be true on the day it ships. Persuasion
comes from specific facts, not adjectives.

## 1. Research before writing (no exceptions)

Read these before you write a word:

- `docs/designs/sare-platform.md`: the approved plan. It is the source of truth
  for what exists, what phase it belongs to, and what Sàrè promises.
- `src/lib/pages.ts`: the header rules and the current copy for every page.
- The page's live UI (`npm run dev`, then open the route) so you see what the
  reader sees.

Write down:

1. **The one remarkable fact.** Something specific and true that a
   competitor cannot say. Examples: Sàrè never holds money; the processor pays
   the vendor directly; riders carry no customer cash.
2. **The phase.** Live in the pilot, planned, or draft. The page's `status`
   must match, and every sentence about a planned feature says so
   ("when your zone opens", "the rider app is built around").
3. **The reader and the action.** Who is reading, and the single thing they
   should do next.

## 2. Truth rules (these override persuasion)

- Never invent numbers: earnings, traction, customer counts, dates, team size,
  response times or contacts. If a number isn't in the plan or the code's
  approved constants, leave it out. Don't use a placeholder on a live page.
- Demo constants in `src/lib/data.ts` (rider pay, bonuses, surge) are
  illustrative. Never present them as an offer.
- Money claims must match the plan (pricing per the Oct 2026 pre-seed deck): vendors pay
  5% of the food bill, ₦200 minimum, taken inside the processor split; customers pay the menu
  price, the delivery fee and a ₦100 service fee; Sàrè partner riders pay a 5% booking fee on
  the delivery fee (vendors' own riders pay nothing); next-business-day settlement; Sàrè never
  holds funds.
- Regulatory and verification steps (NIN, BVN, FRSC, LASDRI, NHIA) are listed
  exactly as the plan states them.

## 3. Headline

Write at least 10 candidates in your notes, then pick one that:

- names Sàrè, or the reader ("riders", "vendors"), and states the promise;
- is specific (a fact, not "a better way to…");
- is framed positively and has no puns;
- is 6 to 14 words.

Put the headline in `title`. The `lede` carries the honest phase and timing.

## 4. Body

- Lead each section with its most important fact. Use short sentences, the
  reader's words and no jargon.
- Use bullets for facts the reader will check: requirements, protections,
  steps.
- End with one clear call to action. Use a secondary CTA only for the demo.

## 5. Apply / application sections

A recruitment page (riders, vendors) gets an `apply` block in its `PageDef`:

- **External form:** the embed ID comes from an env var (for example
  `VITE_RIDER_TYPEFORM_ID`). Validate it as an alphanumeric ID before building
  the URL, and give the iframe a `title`.
- **No form configured:** show a client-only readiness checklist built from the
  plan's verification list. It collects and stores nothing. Say that on the
  page.
- Never collect NIN, BVN or other identity data in our own frontend. Identity
  checks belong to the verification provider.

## 6. Ship it

- Update the tests that pin page content (`src/lib/pages.test.ts`,
  `src/pages/SitePage.test.tsx`, `e2e/demo-smoke.spec.ts`).
- Run `npm test`, `npm run lint`, `npm run build` and `npm run test:e2e`.
- In the commit message, list any claim you removed because it wasn't true.
