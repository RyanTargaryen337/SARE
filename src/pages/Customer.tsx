import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Plus, Minus, MapPin, CheckCircle2, Bike, ChefHat, Receipt, PackageCheck } from 'lucide-react';
import { AREAS, VENDORS, naira, gridToKm, dist, deliveryFee } from '../lib/data';

const _a = (id: string) => AREAS.find((x) => x.id === id)!;
import { useSim, type Order } from '../lib/useSim';
import LagosMap from '../components/LagosMap';

const ease = [0.23, 0.34, 0.18, 1] as const;

const STAGES: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'accepted', label: 'Vendor confirmed', icon: <Receipt size={14} /> },
  { key: 'preparing', label: 'Cooking your food', icon: <ChefHat size={14} /> },
  { key: 'picked', label: 'Rider picked up', icon: <Bike size={14} /> },
  { key: 'delivered', label: 'Delivered', icon: <PackageCheck size={14} /> },
];

function stageIndex(o: Order): number {
  if (o.state === 'delivered') return 3;
  if (o.state === 'picked') return 2;
  if (o.state === 'preparing' || o.state === 'ready' || o.state === 'claimed') return 1;
  if (o.state === 'incoming' || o.state === 'accepted') return 0;
  return -1;
}

export default function Customer() {
  const sim = useSim();
  const [vendorId, setVendorId] = useState(VENDORS[2].id);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [areaId, setAreaId] = useState('vi');
  const [placedId, setPlacedId] = useState<string | null>(null);

  const v = VENDORS.find((x) => x.id === vendorId)!;
  const placed = sim.orders.find((o) => o.id === placedId) ?? null;

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, q]) => q > 0)
        .map(([id, qty]) => {
          const m = v.menu.find((m) => m.id === id)!;
          return { id, name: m.name, price: m.price, qty };
        }),
    [cart, v],
  );
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const km = Math.max(1.2, gridToKm(dist(_a(v.area), _a(areaId))) * 0.9);
  const fees = deliveryFee(subtotal, km, sim.surge);
  const add = (id: string, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));

  const submit = () => {
    if (!cartItems.length) return;
    const id = sim.placeOrder(vendorId, cartItems.map(({ name, qty, price }) => ({ name, qty, price })), areaId);
    setPlacedId(id);
  };

  if (placed) {
    const si = stageIndex(placed);
    const vOf = VENDORS.find((x) => x.id === placed.vendorId)!;
    const eta = placed.state === 'delivered' ? 0 : Math.max(2, 30 - (sim.tick - placed.placedAt));
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="mono-label">LIVE TRACKING · {placed.code}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-cream md:text-4xl">
            {placed.state === 'delivered' ? 'Delivered. Enjoy your meal.' : (
              <>Arriving in <span className="text-ember">~{eta} min</span></>
            )}
          </h1>
          <p className="mt-2 text-cream-dim">{vOf.name} → {_a(placed.areaId).name} · {placed.km.toFixed(1)} km</p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }}
            className="panel relative aspect-square overflow-hidden lg:col-span-3">
            <LagosMap riders={sim.riders} highlightOrder={placed} />
            <div className="absolute left-3 top-3 rounded-lg bg-forest-deep/80 px-3 py-2 backdrop-blur">
              <p className="mono-label">RIDER</p>
              <p className="font-mono text-sm text-cream">
                {placed.riderId ? sim.riders.find((r) => r.id === placed.riderId)?.name : 'Assigning nearest rider…'}
              </p>
            </div>
          </motion.div>

          <div className="space-y-6 lg:col-span-2">
            <div className="panel p-5">
              {STAGES.map((s, i) => {
                const done = i < si || placed.state === 'delivered';
                const active = i === si && placed.state !== 'delivered';
                return (
                  <div key={s.key} className="flex gap-3 pb-5 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`grid h-8 w-8 place-items-center rounded-full border ${
                        done ? 'border-leaf bg-leaf/15 text-leaf' : active ? 'border-ember bg-ember/15 text-ember' : 'border-cream/20 text-cream-dim'
                      }`}>
                        {done ? <CheckCircle2 size={14} /> : s.icon}
                      </div>
                      {i < STAGES.length - 1 && <div className={`w-px flex-1 ${i < si ? 'bg-leaf/60' : 'bg-cream/15'}`} />}
                    </div>
                    <div className="pt-1.5">
                      <p className={`text-sm font-semibold ${done || active ? 'text-cream' : 'text-cream-dim'}`}>{s.label}</p>
                      {active && (
                        <p className="mono-label mt-1 flex items-center gap-1.5">
                          <span className="inline-block h-1 w-1 rounded-full bg-ember pulse-dot" /> IN PROGRESS
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="panel p-5">
              <p className="mono-label mb-3">ORDER SUMMARY</p>
              {placed.items.map((i) => (
                <div key={i.name} className="flex justify-between py-1 text-sm">
                  <span className="text-cream">{i.qty}× {i.name}</span>
                  <span className="font-mono text-cream-dim">{naira(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="mt-3 space-y-1 border-t hairline pt-3 text-sm">
                <Row l="Subtotal" r={naira(placed.subtotal)} />
                <Row l={`Vendor delivery fee (${placed.km.toFixed(1)} km)`} r={placed.fees.delivery === 0 ? 'FREE' : naira(placed.fees.delivery)} />
                <Row l="Sare fee" r="paid by vendor" />
                <div className="flex justify-between pt-2 font-display text-base font-bold text-cream">
                  <span>Total</span><span>{naira(placed.subtotal + placed.fees.delivery)}</span>
                </div>
              </div>
            </div>

            <button onClick={() => { setPlacedId(null); setCart({}); }}
              className="w-full rounded-full border border-cream/25 py-3 font-semibold text-cream transition hover:border-ember hover:text-ember">
              Order something else
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="mono-label">CUSTOMER APP</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-cream md:text-4xl">What are you craving?</h1>

      {/* delivery area */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <MapPin size={15} className="text-ember" />
        <span className="mono-label mr-1">DELIVER TO</span>
        {AREAS.map((a) => (
          <button key={a.id} onClick={() => setAreaId(a.id)}
            className={`rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wider transition ${
              areaId === a.id ? 'bg-ember font-semibold text-forest-deep' : 'bg-forest text-cream-dim hover:text-cream'
            }`}>
            {a.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* vendors */}
        <div className="space-y-3 lg:col-span-1">
          {VENDORS.map((x, i) => {
            const dKm = Math.max(1.2, gridToKm(dist(_a(x.area), _a(areaId))) * 0.9);
            return (
              <motion.button key={x.id} onClick={() => { setVendorId(x.id); setCart({}); }}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05, ease }}
                className={`panel flex w-full items-center gap-3 p-4 text-left transition hover:border-ember/60 ${vendorId === x.id ? 'border-ember' : ''}`}>
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg font-display text-lg font-bold text-forest-deep"
                  style={{ background: `hsl(${x.emojiHue} 70% 62%)` }}>
                  {x.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-cream">{x.name}</p>
                  <p className="truncate text-xs text-cream-dim">{x.cuisine} · {_a(x.area).name}</p>
                  <p className="mt-1 flex items-center gap-3 font-mono text-[10px] tracking-wider text-cream-dim">
                    <span className="flex items-center gap-1 text-amber"><Star size={10} fill="currentColor" />{x.rating}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{Math.round(x.prepMins + dKm * 2.5)}–{Math.round(x.prepMins + dKm * 2.5) + 8} min</span>
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* menu + cart */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div key={vendorId} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.35, ease }}>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-cream">{v.name}</h2>
                  <p className="text-sm text-cream-dim">{v.cuisine} · prep ~{v.prepMins} min</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {v.menu.map((m) => {
                  const q = cart[m.id] ?? 0;
                  return (
                    <div key={m.id} className="panel p-4">
                      {m.tag && <span className="mono-label mb-2 inline-block rounded bg-ember/15 px-2 py-0.5 text-ember">{m.tag}</span>}
                      <p className="font-semibold leading-snug text-cream">{m.name}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-mono text-sm text-cream">{naira(m.price)}</span>
                        {q === 0 ? (
                          <button onClick={() => add(m.id, 1)} aria-label={`Add ${m.name}`} className="grid h-8 w-8 place-items-center rounded-full bg-ember text-forest-deep transition hover:bg-ember-soft">
                            <Plus size={15} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button onClick={() => add(m.id, -1)} aria-label={`Remove one ${m.name}`} className="grid h-8 w-8 place-items-center rounded-full bg-forest-mid text-cream"><Minus size={14} /></button>
                            <span className="w-5 text-center font-mono text-sm text-cream">{q}</span>
                            <button onClick={() => add(m.id, 1)} aria-label={`Add one more ${m.name}`} className="grid h-8 w-8 place-items-center rounded-full bg-ember text-forest-deep"><Plus size={15} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* checkout */}
              <div className="panel mt-6 p-5">
                <p className="mono-label mb-3">CHECKOUT · MENU PRICE + DELIVERY, NOTHING ELSE</p>
                <div className="space-y-1 text-sm">
                  <Row l="Subtotal" r={naira(subtotal)} />
                  <Row l={`Vendor delivery fee to ${_a(areaId).name} (${km.toFixed(1)} km)`}
                    r={subtotal === 0 ? '—' : fees.delivery === 0 ? 'FREE' : naira(fees.delivery)} />
                  <Row l="Sare fee" r="paid by vendor" />
                  <div className="flex justify-between border-t hairline pt-3 font-display text-lg font-bold text-cream">
                    <span>Total</span><span>{naira(subtotal + fees.delivery)}</span>
                  </div>
                </div>
                <button onClick={submit} disabled={!cartItems.length}
                  className="mt-4 w-full rounded-full bg-ember py-3.5 font-semibold text-forest-deep transition hover:bg-ember-soft disabled:cursor-not-allowed disabled:opacity-40">
                  Place order · dispatch a rider
                </button>
                <p className="mono-label mt-3 text-center">RIDER ASSIGNED BY PROXIMITY · ETA SHOWN LIVE</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Row({ l, r }: { l: string; r: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-cream-dim">{l}</span>
      <span className="font-mono text-cream">{r}</span>
    </div>
  );
}
