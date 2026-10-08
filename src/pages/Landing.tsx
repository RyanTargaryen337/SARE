import { motion } from 'framer-motion';
import { ArrowRight, Bike, Store, Timer, Zap } from 'lucide-react';
import { useSim } from '../lib/useSim';
import LagosMap from '../components/LagosMap';
import type { View } from '../components/Nav';

const ease = [0.23, 0.34, 0.18, 1] as const;

export default function Landing({ go }: { go: (v: View) => void }) {
  const { riders, orders, events, tick } = useSim();
  const live = orders.filter((o) => o.state !== 'delivered' && o.state !== 'rejected');
  const deliveredToday = 1240 + orders.filter((o) => o.state === 'delivered').length;
  const activeRiders = riders.filter((r) => r.online).length;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <LagosMap riders={riders} compact className="absolute inset-0" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/80 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <motion.p initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
              className="mono-label mb-5 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-leaf pulse-dot" />
              {activeRiders} RIDERS ON THE GRID · {live.length} ORDERS IN MOTION
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease }}
              className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-cream md:text-7xl">
              Lagos moves in <span className="text-ember">minutes</span>, not hours.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease }}
              className="mt-6 max-w-md text-lg text-cream-dim">
              Sare connects the city's best vendors to hungry customers with a dispatch network tuned for Lagos traffic — geotagged orders, nearest-rider matching, door-to-door in ~30 minutes.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45, ease }}
              className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => go('order')}
                className="group flex items-center gap-2 rounded-full bg-ember px-6 py-3 font-semibold text-forest-deep transition hover:bg-ember-soft">
                Order now <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={() => go('rider')}
                className="flex items-center gap-2 rounded-full border border-cream/25 px-6 py-3 font-semibold text-cream transition hover:border-ember hover:text-ember">
                <Bike size={16} /> Ride with us
              </button>
              <button onClick={() => go('vendor')}
                className="flex items-center gap-2 rounded-full border border-cream/25 px-6 py-3 font-semibold text-cream transition hover:border-ember hover:text-ember">
                <Store size={16} /> Sell on Sare
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-12 grid max-w-md grid-cols-3 gap-4">
              {[
                { icon: <Timer size={15} />, k: '28 min', v: 'avg delivery' },
                { icon: <Zap size={15} />, k: `${deliveredToday.toLocaleString()}`, v: 'drops today' },
                { icon: <Bike size={15} />, k: `${activeRiders} online`, v: 'dispatch riders' },
              ].map((s) => (
                <div key={s.v} className="panel p-3">
                  <div className="mb-1 text-ember">{s.icon}</div>
                  <div className="font-display text-xl font-bold text-cream">{s.k}</div>
                  <div className="mono-label">{s.v}</div>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="hidden md:block" />
        </div>

        {/* live ticker */}
        <div className="relative border-t hairline bg-forest-deep/70 py-2 backdrop-blur-sm">
          <div className="flex overflow-hidden">
            <div className="ticker-track flex shrink-0 gap-10 pr-10">
              {[...events, ...events].map((e, i) => (
                <span key={i} className="whitespace-nowrap font-mono text-[11px] tracking-wider text-cream-dim">
                  <span className="mr-2 text-ember">●</span>{e}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it moves ── */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <p className="mono-label mb-3">THE MOTION</p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-cream md:text-4xl">
          Three apps. One dispatch engine.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              n: '01', title: 'Customer orders', view: 'order' as View,
              body: 'Browse vendors within a tight radius, transparent fee breakdown at checkout — delivery, capped service fee, no surprises. Track the rider live on the map.',
            },
            {
              n: '02', title: 'Vendor fires it', view: 'vendor' as View,
              body: 'Orders hit the Vendor Hub with a loud queue. Accept, set prep time, mark ready. Daily payouts, 20% standard commission, zero hidden charges.',
            },
            {
              n: '03', title: 'Rider runs it', view: 'rider' as View,
              body: 'Geotagged dispatch sends each order to the nearest online rider. Per-km pay that beats the market, drop fees, monthly meal allowance at 300 deliveries.',
            },
          ].map((c, i) => (
            <motion.button key={c.n} onClick={() => go(c.view)}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12, ease }}
              className="panel group p-6 text-left transition hover:border-ember/60">
              <div className="font-mono text-sm text-ember">{c.n}</div>
              <div className="mt-3 flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-cream">{c.title}</h3>
                <ArrowRight size={16} className="text-cream-dim transition group-hover:translate-x-1 group-hover:text-ember" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream-dim">{c.body}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Ops teaser ── */}
      <section className="border-t hairline bg-forest/40">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
            <p className="mono-label mb-3">NETWORK OPS</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-cream">Watch the whole city breathe.</h2>
            <p className="mt-4 max-w-md text-cream-dim">
              Every order, every rider, every kilometre — a live command view across Lekki, VI, Ikoyi, Yaba, Ikeja and beyond. This is the exact simulation running under this demo.
            </p>
            <button onClick={() => go('ops')} className="mt-6 flex items-center gap-2 rounded-full bg-ember px-6 py-3 font-semibold text-forest-deep transition hover:bg-ember-soft">
              Open command view <ArrowRight size={16} />
            </button>
            <p className="mono-label mt-8">TICK {tick} · SIMULATION RUNNING</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}
            className="panel aspect-square overflow-hidden">
            <LagosMap riders={riders} />
          </motion.div>
        </div>
      </section>

      <footer className="border-t hairline py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4">
          <span className="font-display font-bold text-cream">sare<span className="text-ember">.</span></span>
          <p className="font-mono text-[11px] tracking-wider text-cream-dim">
            DEMO CONCEPT · LAGOS, NIGERIA · FEES IN NAIRA (₦) · SIMULATED NETWORK
          </p>
        </div>
      </footer>
    </div>
  );
}
