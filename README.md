# Sare

Food delivery for Lagos, in minutes. Sare connects vendors, customers and dispatch riders through one dispatch engine with geotagged orders and nearest-rider matching.

This repo is an interactive demo: every order, rider and payout is simulated in the browser. There is no backend yet.

## Views

| View | File | What it shows |
| --- | --- | --- |
| Home | `src/pages/Landing.tsx` | Location-first hero with a modal location picker, category shortcuts, simulated Lagos network map |
| Order | `src/pages/Customer.tsx` | Browse vendors, checkout with fee breakdown, live tracking |
| Vendor | `src/pages/Vendor.tsx` | Incoming order queue: accept, reject, mark ready |
| Rider | `src/pages/Rider.tsx` | Claim, pick up and deliver runs; earnings |
| Ops | `src/pages/Ops.tsx` | Network-wide command view |
| Pricing | `src/pages/Pricing.tsx` | Monetization model |

## How the simulation works

`src/lib/sim.tsx` runs a 1-second loop where one tick is one minute. It spawns orders across 10 Lagos areas, auto-accepts orders left in the queue for 8 ticks, and dispatches the nearest idle online rider 7 ticks after an order is ready. Riders move across a 0–100 map grid (about 24 km across Lagos). State lives in React memory, so a refresh resets it.

Vendors, areas, riders and every pricing constant live in `src/lib/data.ts`:

- Delivery: ₦500 base + ₦120/km, free over ₦15,000
- Service fee: 5% of subtotal, capped at ₦500 (illustrative Phase 2 constant; the demo checkout charges only the menu price plus the vendor's delivery fee)
- Surge: ×1.25 (illustrative Phase 2 constant; the sim and pilot apply no surge)
- Small order fee: ₦300 under ₦2,000 (illustrative Phase 2 constant; not charged in the demo checkout)
- Vendor commission: 5% of the full charge (food plus the vendor's delivery fee), ₦200 minimum, never more than the order total (`src/lib/money.ts`)
- Rider pay: ₦150/km + ₦400 per drop

## Development

Requires Node.js 20+.

```sh
npm ci
npm run dev      # start the dev server
npm run build    # typecheck and build to dist/
npm run lint
npm test         # Vitest unit tests (sim, commission, routes, discovery, pages, components)
npm run test:e2e # Playwright smoke tests (builds, then serves on :4173)
```

Pages live at hash routes: `#/vendor`, `#/page/<slug>` (content in `src/lib/pages.ts`),
`#/near/<category>` and `#/city/<place>` (lists in `src/lib/discovery.ts`). Route parsing
(`src/lib/routes.ts`) ignores a `?query`, an inner `#fragment` and trailing slashes, and
unknown routes fall back to Home. Page copy must match the approved plan in
`docs/designs/sare-platform.md`.

The riders page (`#/page/riders`) has an Apply section. Set `VITE_RIDER_TYPEFORM_ID` to a Typeform
form ID (for example in `.env.local`) to embed the application form. Without it, the page shows a
readiness checklist that stays in the browser and sends nothing.

Built with React 19, TypeScript, Vite, Tailwind CSS 3, shadcn/ui and Framer Motion.
