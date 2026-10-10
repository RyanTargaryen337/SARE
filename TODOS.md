# TODOS

## Deferred by /plan-ceo-review (2026-10-08)

- **One-tap reorder SMS (CEO-E5).** After delivery, send an SMS with a link that reopens the customer's last basket (OTP + pay only). Deferred until Gate 1 shows which vendors have repeat customers. Needs NDPA marketing-consent wording and opt-out, plus per-SMS cost budget. Source: docs/designs/sare-platform.md, CEO Review Ledger.
- **LGA classification + NIPOST postcode field (CEO-D1).** Moved to Phase 2: urban/semi-urban/rural/riverine tags from a reference dataset and a reserved postcode field (11-character format per the founder's research memo; confirm against NIPOST's published spec), needed for zone pricing and SLAs.
- **Tier 3 vendor verification (CEO-D2).** Moved to Phase 2 with priority placement: geotagged photo or field-visit address check + 30 clean orders.
- **Impersonation guard (CEO-D3).** Moved to Phase 2 marketplace: define the known-brand list source, the name-match rule, and the review owner and SLA.

## Deferred by /plan-design-review (2026-10-09)

- **Create a full DESIGN.md (design system).** Run /design-consultation to define colour tokens, spacing, type scale and components for both the light customer pages (DR-6A) and the dark vendor dashboard. Why: design review Pass 5 is capped at 7/10 because only minimums exist (DR-5A); without tokens each screen picks its own greens and oranges. Do before the Phase 1 UI build starts. Depends on: nothing.

## Deferred by /plan-eng-review (2026-10-10)

- **Re-tune OTP limits and alert thresholds with live data (D18).** After 2 weeks of live Phase 1 traffic, compare blocked-OTP counts and alert counts with real usage and reset the config values from D7 (1 OTP/60 s and 5/24 h per number, 10/h per IP, ₦20,000 daily SMS cap) and D12 (>5 webhook signature failures/h, SMS spend >2× 7-day average). Why: they are starting guesses; a tight IP limit blocks customers on shared carrier IPs silently. Effort S (values are config). Depends on: Phase 1 live for 2 weeks.
