import { motion, AnimatePresence } from 'framer-motion';
import { Bike, MapPin, Navigation, Wallet, Gift, CalendarCheck, PackageCheck, Zap } from 'lucide-react';
import { VENDORS, AREAS, naira, PRICING, gridToKm, dist } from '../lib/data';
import { useSim } from '../lib/sim';
import LagosMap from '../components/LagosMap';

const ease = [0.23, 0.34, 0.18, 1] as const;
// You are rider r0 — Tunde A.
const ME = 'r0';

export default function Rider() {
  const sim = useSim();
  const me = sim.riders.find((r) => r.id === ME)!;
  const myOrder = sim.orders.find((o) => o.id === me.orderId) ?? null;
  const open = sim.orders.filter((o) => (o.state === 'ready' || o.state === 'preparing') && !o.riderId);

  const monthlyTarget = 300;
  const pct = Math.min(100, (me.monthDeliveries / monthlyTarget) * 100);
  const estPay = (km: number) => Math.round(PRICING.riderDropFee + PRICING.riderPerKm * km);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mono-label">RIDER APP · {me.name.toUpperCase()} · LAGOS ISLAND GRID</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-cream md:text-4xl">Runs near you.</h1>
        </div>
        <button onClick={() => sim.toggleRider(ME)}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[12px] font-bold tracking-wider transition ${
            me.online ? 'bg-leaf text-forest-deep' : 'bg-forest-mid text-cream-dim'
          }`}>
          <span className={`h-2 w-2 rounded-full ${me.online ? 'bg-forest-deep pulse-dot' : 'bg-cream-dim'}`} />
          {me.online ? 'ONLINE' : 'OFFLINE'}
        </button>
      </div>

      {/* earnings strip */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel p-4">
          <div className="mb-1 text-ember"><Wallet size={15} /></div>
          <div className="font-display text-2xl font-bold text-cream">{naira(me.earnings)}</div>
          <div className="mono-label">earned today</div>
        </div>
        <div className="panel p-4">
          <div className="mb-1 text-ember"><Bike size={15} /></div>
          <div className="font-display text-2xl font-bold text-cream">{me.deliveries}</div>
          <div className="mono-label">drops today</div>
        </div>
        <div className="panel p-4">
          <div className="mb-1 text-ember"><Gift size={15} /></div>
          <div className="font-display text-2xl font-bold text-cream">{me.monthDeliveries}<span className="text-sm text-cream-dim">/300</span></div>
          <div className="mono-label">to ₦10,000 meal allowance</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-forest-mid">
            <motion.div className="h-full bg-ember" animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease }} />
          </div>
        </div>
        <div className="panel p-4">
          <div className="mb-1 text-ember"><CalendarCheck size={15} /></div>
          <div className="font-display text-2xl font-bold text-cream">{naira(PRICING.riderSundayBonus)}</div>
          <div className="mono-label">sunday streak bonus</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* job feed */}
        <div className="space-y-4 lg:col-span-3">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-cream">
            <Zap size={16} className="text-ember" /> Dispatch feed
          </h2>

          {/* active run */}
          <AnimatePresence>
            {myOrder && (
              <motion.div layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4, ease }} className="panel border-ember p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-ember">{myOrder.code} · YOUR RUN</span>
                  <span className="mono-label rounded bg-ember/15 px-2 py-1 text-ember">{myOrder.state.toUpperCase()}</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-ember" />
                    <div>
                      <p className="mono-label">PICKUP</p>
                      <p className="text-sm font-semibold text-cream">{VENDORS.find((v) => v.id === myOrder.vendorId)?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Navigation size={15} className="mt-0.5 shrink-0 text-leaf" />
                    <div>
                      <p className="mono-label">DROP-OFF</p>
                      <p className="text-sm font-semibold text-cream">{AREAS.find((a) => a.id === myOrder.areaId)?.name} · {myOrder.km.toFixed(1)} km</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t hairline pt-4">
                  <span className="font-mono text-sm text-cream">Earn <span className="font-bold text-leaf">{naira(estPay(myOrder.km))}</span></span>
                  {myOrder.state === 'claimed' && me.legTicks === 0 && (
                    <button onClick={() => sim.pickupOrder(myOrder.id)}
                      className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-forest-deep transition hover:bg-ember-soft">
                      Confirm pickup
                    </button>
                  )}
                  {myOrder.state === 'claimed' && me.legTicks > 0 && (
                    <span className="font-mono text-[11px] tracking-wider text-amber">HEADING TO VENDOR · {me.legTicks} MIN</span>
                  )}
                  {myOrder.state === 'picked' && me.legTicks > 0 && (
                    <span className="font-mono text-[11px] tracking-wider text-leaf">EN ROUTE · {me.legTicks} MIN TO CUSTOMER</span>
                  )}
                  {myOrder.state === 'picked' && me.legTicks === 0 && (
                    <button onClick={() => sim.completeOrder(myOrder.id)}
                      className="flex items-center gap-1 rounded-full bg-leaf px-5 py-2.5 text-sm font-semibold text-forest-deep transition hover:opacity-85">
                      <PackageCheck size={14} /> Confirm delivered
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* claimable jobs */}
          {!myOrder && me.online && open.length === 0 && (
            <div className="panel border-dashed p-10 text-center">
              <p className="text-cream-dim">Scanning for orders near you… the grid fires one every few seconds.</p>
            </div>
          )}
          {!myOrder && me.online && (
            <AnimatePresence>
              {open.slice(0, 5).map((o) => {
                const v = VENDORS.find((x) => x.id === o.vendorId)!;
                const va = AREAS.find((a) => a.id === v.area)!;
                const dKm = gridToKm(dist(me, va));
                return (
                  <motion.div key={o.id} layout initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.35, ease }} className="panel p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-sm font-bold text-cream">{o.code}</span>
                      <span className={`mono-label rounded px-2 py-1 ${o.state === 'ready' ? 'bg-leaf/15 text-leaf' : 'bg-amber/15 text-amber'}`}>
                        {o.state === 'ready' ? 'READY NOW' : 'PREPARING'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-cream-dim">
                      {v.name} <span className="text-cream-dim/60">({dKm.toFixed(1)} km from you)</span> → {AREAS.find((a) => a.id === o.areaId)?.name} · {o.km.toFixed(1)} km run
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-sm text-cream">Earn <span className="font-bold text-leaf">{naira(estPay(o.km))}</span></span>
                      <button onClick={() => sim.claimOrder(o.id, ME)}
                        className="rounded-full bg-ember px-5 py-2 text-sm font-semibold text-forest-deep transition hover:bg-ember-soft">
                        Claim run
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          {!me.online && (
            <div className="panel border-dashed p-10 text-center">
              <p className="text-cream-dim">You're offline. Go online to receive dispatch offers.</p>
            </div>
          )}
        </div>

        {/* position map + pay structure */}
        <div className="space-y-6 lg:col-span-2">
          <div className="panel aspect-square overflow-hidden">
            <LagosMap riders={sim.riders} highlightOrder={myOrder} />
          </div>
          <div className="panel p-5">
            <p className="mono-label mb-3">HOW YOU EARN</p>
            {[
              ['Drop fee', `${naira(PRICING.riderDropFee)} / delivery`],
              ['Distance pay', `${naira(PRICING.riderPerKm)} / km`],
              ['Meal allowance', `${naira(PRICING.riderMonthlyBonus)} / mo at 300 drops`],
              ['Sunday bonus', `${naira(PRICING.riderSundayBonus)} / Sunday`],
            ].map(([l, r]) => (
              <div key={l} className="flex justify-between border-b hairline py-2 text-sm last:border-0">
                <span className="text-cream-dim">{l}</span><span className="font-mono text-cream">{r}</span>
              </div>
            ))}
            <p className="mono-label mt-3">TOP RIDERS AVERAGE ~₦100,000 / WEEK</p>
          </div>
        </div>
      </div>
    </div>
  );
}
