import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { PRICING, naira } from '../lib/data';

const ease = [0.23, 0.34, 0.18, 1] as const;

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true }, transition: { duration: 0.55, delay: i * 0.08, ease },
});

export default function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div role="note" className="mb-8 flex gap-3 rounded-xl border border-ember/50 bg-ember/10 p-4 text-sm text-cream">
        <Info size={18} className="mt-0.5 shrink-0 text-ember" />
        <p>
          <span className="font-semibold">Illustrative Phase 2 marketplace model, not today's vendor offer.</span>{' '}
          Today vendors pay 5% per order (minimum ₦200), taken inside the payment split, and customers pay only the menu price plus the vendor's delivery fee.
        </p>
      </div>
      <p className="mono-label">MONETIZATION MODEL · BENCHMARKED ON THE NIGERIAN MARKET</p>
      <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-cream md:text-5xl">
        Four revenue streams. Priced so every side of the market wins.
      </h1>
      <p className="mt-4 max-w-2xl text-cream-dim">
        The model mirrors what has been proven in Lagos: commissions + delivery fees + capped service fees + surge. The value metric everywhere is <span className="text-cream font-semibold">per order</span> — when vendors sell more and riders run more, the platform earns more. Growth is the pricing.
      </p>

      {/* ── Customer fees ── */}
      <section className="mt-14">
        <motion.h2 {...fade(0)} className="font-display text-2xl font-bold text-cream">Customer side</motion.h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { t: 'Delivery fee', d: `${naira(PRICING.deliveryBase)} base + ${naira(PRICING.deliveryPerKm)}/km`, n: 'Free above ₦15,000 subtotal — nudges basket size up (anchoring).', c: '🟡' },
            { t: 'Service fee', d: '5% of subtotal, capped at ₦500', n: 'Covers payments & support. The cap stops big orders feeling punished.', c: '🟢' },
            { t: 'Surge fee', d: '×1.25 at peak / rain', n: 'Balances rider supply when demand spikes — contingency, not a gouge.', c: '🟢' },
            { t: 'Small order fee', d: `${naira(PRICING.smallOrderFee)} under ₦2,000`, n: 'Protects unit economics on micro-baskets; customers can just add an item.', c: '🟡' },
          ].map((f, i) => (
            <motion.div key={f.t} {...fade(i)} className="panel p-5">
              <p className="mono-label text-ember">{f.t}</p>
              <p className="mt-2 font-display text-lg font-bold leading-snug text-cream">{f.d}</p>
              <p className="mt-2 text-xs leading-relaxed text-cream-dim">{f.n}</p>
              <p className="mt-3 font-mono text-[10px] text-cream-dim/70">{f.c} {f.c === '🟢' ? 'verified market practice' : 'estimated, test in market'}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Vendor tiers ── */}
      <section className="mt-16">
        <motion.h2 {...fade(0)} className="font-display text-2xl font-bold text-cream">Vendor side — three tiers, middle is the default</motion.h2>
        <p className="mt-2 max-w-2xl text-sm text-cream-dim">
          Commission-only entry keeps roadside vendors coming; the Partner tier trades a lower take-rate for a monthly commitment. Competing platforms in Lagos charge 20–30%, so 20% is the anchor.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              name: 'Starter', price: '25% commission', sub: '₦0 monthly', rec: false,
              feats: ['Full marketplace listing', 'Standard rider dispatch', 'Weekly payout', 'Email support', 'Basic sales dashboard'],
            },
            {
              name: 'Growth', price: '20% commission', sub: '₦0 monthly', rec: true,
              feats: ['Everything in Starter', 'Daily same-day payout', 'Priority dispatch radius', 'Sponsored placement credits ₦10k/mo', 'Prep-time analytics'],
            },
            {
              name: 'Partner', price: '15% commission', sub: '₦25,000 monthly', rec: false,
              feats: ['Everything in Growth', 'Dedicated account manager', 'Menu & pricing consultancy', 'API + POS integration', 'Co-marketing campaigns'],
            },
          ].map((t, i) => (
            <motion.div key={t.name} {...fade(i)}
              className={`panel relative p-6 ${t.rec ? 'border-ember' : ''}`}>
              {t.rec && (
                <span className="absolute -top-3 left-6 rounded-full bg-ember px-3 py-1 font-mono text-[10px] font-bold tracking-wider text-forest-deep">
                  RECOMMENDED
                </span>
              )}
              <p className="mono-label">{t.name.toUpperCase()}</p>
              <p className="mt-3 font-display text-3xl font-bold text-cream">{t.price}</p>
              <p className="font-mono text-xs text-cream-dim">{t.sub}</p>
              <div className="mt-5 space-y-2.5">
                {t.feats.map((f) => (
                  <p key={f} className="flex items-start gap-2 text-sm text-cream-dim">
                    <Check size={14} className="mt-0.5 shrink-0 text-leaf" />{f}
                  </p>
                ))}
              </div>
              <button className={`mt-6 w-full rounded-full py-3 text-sm font-semibold transition ${
                t.rec ? 'bg-ember text-forest-deep hover:bg-ember-soft' : 'border border-cream/25 text-cream hover:border-ember hover:text-ember'
              }`}>
                Start as {t.name}
              </button>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs text-cream-dim">
          <Info size={13} className="mt-0.5 shrink-0" />
          Take-rate ladder: 25% / 20% / 15% anchors vendors to Growth. A vendor doing ₦1M/month saves ₦50k on Partner vs Growth — against a ₦25k fee, it pays for itself at ₦500k/month. 🔴 Threshold assumed; validate with first 50 vendors.
        </p>
      </section>

      {/* ── Rider pay ── */}
      <section className="mt-16">
        <motion.h2 {...fade(0)} className="font-display text-2xl font-bold text-cream">Rider side — pay for the run, reward the streak</motion.h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <motion.div {...fade(1)} className="panel p-6">
            <p className="mono-label mb-3">PER-DELIVERY PAY</p>
            {[
              ['Drop fee', naira(PRICING.riderDropFee)],
              ['Distance pay', `${naira(PRICING.riderPerKm)} / km`],
              ['Typical 4 km run', naira(PRICING.riderDropFee + PRICING.riderPerKm * 4)],
            ].map(([l, r]) => (
              <div key={l} className="flex justify-between border-b hairline py-2 text-sm last:border-0">
                <span className="text-cream-dim">{l}</span><span className="font-mono text-cream">{r}</span>
              </div>
            ))}
            <p className="mt-3 text-xs text-cream-dim">Per-km pay set above incumbent rates — rider loyalty is the moat. 🟢 benchmarked</p>
          </motion.div>
          <motion.div {...fade(2)} className="panel p-6">
            <p className="mono-label mb-3">RETENTION BONUSES</p>
            {[
              ['Meal allowance', `${naira(PRICING.riderMonthlyBonus)}/mo at 300 deliveries`],
              ['Sunday streak', `${naira(PRICING.riderSundayBonus)} per Sunday worked`],
              ['Top riders', '~₦100,000 / week total'],
            ].map(([l, r]) => (
              <div key={l} className="flex justify-between border-b hairline py-2 text-sm last:border-0">
                <span className="text-cream-dim">{l}</span><span className="font-mono text-cream">{r}</span>
              </div>
            ))}
            <p className="mt-3 text-xs text-cream-dim">300 drops/mo ≈ 10/day — the allowance is earned, not given. Riders who chase it anchor fleet supply. 🟢 benchmarked</p>
          </motion.div>
        </div>
      </section>

      {/* ── Unit economics ── */}
      <section className="mb-10 mt-16">
        <motion.h2 {...fade(0)} className="font-display text-2xl font-bold text-cream">Unit economics on a typical order</motion.h2>
        <motion.div {...fade(1)} className="panel mt-6 overflow-x-auto p-6">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="mono-label border-b hairline text-left">
                <th className="pb-3">LINE ITEM</th><th className="pb-3 text-right">₦4,500 JOLLOF ORDER · 4 KM</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {[
                ['Customer pays: subtotal', '4,500'],
                ['+ delivery fee (₦500 + ₦120×4km)', '980'],
                ['+ service fee (5% of 4,500 = 225, under cap)', '225'],
                ['Vendor commission (20% of 4,500)', '900'],
                ['Platform revenue', '2,105'],
                ['− rider pay (₦400 + ₦150×4km)', '(1,000)'],
                ['− payment processing (~1.5%)', '(86)'],
                ['Contribution before ops/marketing', '≈ 1,019'],
              ].map(([l, r], i) => (
                <tr key={l} className={`border-b hairline last:border-0 ${i >= 4 ? 'font-bold text-cream' : 'text-cream-dim'}`}>
                  <td className="py-2.5">{l}</td>
                  <td className={`py-2.5 text-right ${i === 7 ? 'text-leaf' : ''}`}>{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-cream-dim">🟡 Illustrative model — every Lagos-scale player that survived has targeted profit per delivery, not growth-at-all-costs. Dense zones enable bicycle delivery, cutting the largest cost line further.</p>
        </motion.div>
      </section>
    </div>
  );
}
