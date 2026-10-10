import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, Check, X, Flame, Wallet, TrendingUp, ClipboardList } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { VENDORS, AREAS, naira } from '../lib/data';
import { commissionKobo, koboToNaira, nairaToKobo } from '../lib/money';
import { useSim } from '../lib/useSim';

const ease = [0.23, 0.34, 0.18, 1] as const;
// The hub runs as "Jollof Junction" (v3)
const MY_VENDOR = 'v3';

const sales = [
  { d: 'Mon', v: 186 }, { d: 'Tue', v: 204 }, { d: 'Wed', v: 178 },
  { d: 'Thu', v: 232 }, { d: 'Fri', v: 310 }, { d: 'Sat', v: 368 }, { d: 'Sun', v: 294 },
];

export default function Vendor() {
  const sim = useSim();
  const mine = sim.orders.filter((o) => o.vendorId === MY_VENDOR && o.state !== 'delivered' && o.state !== 'rejected');
  const incoming = mine.filter((o) => o.state === 'incoming');
  const doneToday = 214 + sim.orders.filter((o) => o.vendorId === MY_VENDOR && o.state === 'delivered').length;
  const gross = 812400;
  // Demo figure: today's orders at the average basket, each charged 5% with the ₦200 minimum.
  const commission = koboToNaira(doneToday * commissionKobo(nairaToKobo(Math.round(gross / doneToday))));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono-label">VENDOR HUB · JOLLOF JUNCTION · VICTORIA ISLAND</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-cream md:text-4xl">Kitchen is live.</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-leaf/40 bg-leaf/10 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-leaf pulse-dot" />
          <span className="font-mono text-[11px] tracking-wider text-leaf">ACCEPTING ORDERS</span>
        </div>
      </div>

      {/* stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <ClipboardList size={15} />, k: String(doneToday), v: 'orders today' },
          { icon: <Wallet size={15} />, k: naira(gross), v: 'gross sales today' },
          { icon: <TrendingUp size={15} />, k: naira(gross - commission), v: 'net after Sare fee (5%, min ₦200/order)' },
          { icon: <Flame size={15} />, k: '8 min', v: 'avg prep time' },
        ].map((s) => (
          <div key={s.v} className="panel p-4">
            <div className="mb-1 text-ember">{s.icon}</div>
            <div className="font-display text-2xl font-bold text-cream">{s.k}</div>
            <div className="mono-label">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* order queue */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <BellRing size={16} className="text-ember" />
            <h2 className="font-display text-xl font-bold text-cream">Order queue</h2>
            {incoming.length > 0 && (
              <span className="rounded-full bg-ember px-2 py-0.5 font-mono text-[11px] font-bold text-forest-deep">{incoming.length} NEW</span>
            )}
          </div>

          <AnimatePresence>
            {mine.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="panel border-dashed p-10 text-center">
                <p className="text-cream-dim">No active orders. New ones land here in real time — try placing one from the Customer app.</p>
              </motion.div>
            )}
            {mine.map((o) => (
              <motion.div key={o.id} layout initial={{ opacity: 0, y: -16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.4, ease }}
                className={`panel p-5 ${o.state === 'incoming' ? 'border-ember' : ''}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-ember">{o.code}</span>
                    {o.isUser && <span className="rounded bg-leaf/15 px-2 py-0.5 font-mono text-[10px] tracking-wider text-leaf">YOUR TEST ORDER</span>}
                    <span className="mono-label">{AREAS.find((a) => a.id === o.areaId)?.name} · {o.km.toFixed(1)} KM</span>
                  </div>
                  <span className={`mono-label rounded px-2 py-1 ${
                    o.state === 'incoming' ? 'bg-ember/15 text-ember' :
                    o.state === 'preparing' ? 'bg-amber/15 text-amber' : 'bg-leaf/15 text-leaf'
                  }`}>{o.state.toUpperCase()}</span>
                </div>
                <div className="mt-3 space-y-1">
                  {o.items.map((i) => (
                    <p key={i.name} className="text-sm text-cream">{i.qty}× {i.name}</p>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t hairline pt-3">
                  <span className="font-mono text-sm text-cream-dim">
                    {naira(o.subtotal)} <span className="text-cream-dim/60">(you net {naira(o.subtotal - koboToNaira(commissionKobo(nairaToKobo(o.subtotal))))})</span>
                  </span>
                  <div className="flex gap-2">
                    {o.state === 'incoming' && (
                      <>
                        <button onClick={() => sim.rejectOrder(o.id)}
                          className="flex items-center gap-1 rounded-full border border-danger/40 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/10">
                          <X size={14} /> Reject
                        </button>
                        <button onClick={() => sim.acceptOrder(o.id)}
                          className="flex items-center gap-1 rounded-full bg-ember px-4 py-2 text-sm font-semibold text-forest-deep transition hover:bg-ember-soft">
                          <Check size={14} /> Accept · {o.prepTicksLeft} min
                        </button>
                      </>
                    )}
                    {o.state === 'preparing' && (
                      <>
                        <span className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-amber">
                          <Flame size={12} /> {Math.max(1, o.prepTicksLeft)} MIN LEFT
                        </span>
                        <button onClick={() => sim.markReady(o.id)}
                          className="rounded-full bg-leaf px-4 py-2 text-sm font-semibold text-forest-deep transition hover:opacity-85">
                          Mark ready for pickup
                        </button>
                      </>
                    )}
                    {(o.state === 'ready' || o.state === 'claimed') && (
                      <span className="font-mono text-[11px] tracking-wider text-leaf">WAITING FOR RIDER…</span>
                    )}
                    {o.state === 'picked' && (
                      <span className="font-mono text-[11px] tracking-wider text-leaf">RIDER EN ROUTE TO CUSTOMER</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* side column */}
        <div className="space-y-6">
          <div className="panel p-5">
            <p className="mono-label mb-2">SALES THIS WEEK (₦ THOUSAND)</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sales} margin={{ top: 6, right: 0, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F95E2C" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#F95E2C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" tick={{ fill: '#B8AC9C', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#B8AC9C', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#022F2A', border: '1px solid #1a3f35', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 12 }}
                    labelStyle={{ color: '#E9DFD3' }} itemStyle={{ color: '#F95E2C' }} formatter={(v) => [`₦${v}k`, 'sales']} />
                  <Area type="monotone" dataKey="v" stroke="#F95E2C" strokeWidth={2} fill="url(#sg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel p-5">
            <p className="mono-label mb-3">PAYOUT · PROCESSOR SETTLEMENT</p>
            {[
              ['Gross sales', naira(gross)],
              ['Sare fee (5%, min ₦200/order)', `−${naira(commission)}`],
              ['Net payout', naira(gross - commission)],
              ['Next settlement', "Processor's next run"],
            ].map(([l, r]) => (
              <div key={l} className="flex justify-between border-b hairline py-2 text-sm last:border-0">
                <span className="text-cream-dim">{l}</span><span className="font-mono text-cream">{r}</span>
              </div>
            ))}
            <p className="mono-label mt-3">SENT BY THE PROCESSOR TO GTB •••• 4821 · SARE NEVER HOLDS YOUR MONEY</p>
          </div>

          <div className="panel p-5">
            <p className="mono-label mb-3">TOP ITEMS TODAY</p>
            {VENDORS.find((v) => v.id === MY_VENDOR)!.menu.slice(0, 3).map((m, i) => (
              <div key={m.id} className="flex items-center justify-between py-1.5 text-sm">
                <span className="text-cream"><span className="mr-2 font-mono text-ember">{i + 1}.</span>{m.name}</span>
                <span className="font-mono text-cream-dim">{68 - i * 17} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
