# Sare

Food delivery for Lagos, in minutes. Sare connects vendors, customers and dispatch riders through one dispatch engine with geotagged orders and nearest-rider matching.

This repo is an interactive demo: every order, rider and payout is simulated in the browser. There is no backend yet.

## Views

| View | File | What it shows |
| --- | --- | --- |
| Home | `src/pages/Landing.tsx` | Hero, live Lagos map, order ticker |
| Order | `src/pages/Customer.tsx` | Browse vendors, checkout with fee breakdown, live tracking |
| Vendor | `src/pages/Vendor.tsx` | Incoming order queue: accept, reject, mark ready |
| Rider | `src/pages/Rider.tsx` | Claim, pick up and deliver runs; earnings |
| Ops | `src/pages/Ops.tsx` | Network-wide command view |
| Pricing | `src/pages/Pricing.tsx` | Monetization model |

## How the simulation works

`src/lib/sim.tsx` runs a 1-second loop where one tick is one minute. It spawns orders across 10 Lagos areas, auto-accepts orders left in the queue for 8 ticks, and dispatches the nearest idle online rider 7 ticks after an order is ready. Riders move across a 0–100 map grid (about 24 km across Lagos). State lives in React memory, so a refresh resets it.

Vendors, areas, riders and every pricing constant live in `src/lib/data.ts`:

- Delivery: ₦500 base + ₦120/km, free over ₦15,000
- Service fee: 5% of subtotal, capped at ₦500
- Surge: ×1.25
- Small order fee: ₦300 under ₦2,000
- Vendor commission: 20% (Growth tier)
- Rider pay: ₦150/km + ₦400 per drop

## Development

Requires Node.js 20+.

```sh
npm ci
npm run dev      # start the dev server
npm run build    # typecheck and build to dist/
npm run lint
npm test         # Vitest unit tests (sim, commission)
npm run test:e2e # Playwright smoke tests (builds, then serves on :4173)
```

Pages live at hash routes: `#/vendor`, `#/page/<slug>` (content in `src/lib/pages.ts`),
`#/near/<category>` and `#/city/<place>` (lists in `src/lib/discovery.ts`). Page copy must
match the approved plan in `docs/designs/sare-platform.md`.

Built with React 19, TypeScript, Vite, Tailwind CSS 3, shadcn/ui and Framer Motion.
