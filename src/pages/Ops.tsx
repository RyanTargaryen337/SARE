import { useSim } from '../lib/sim';
import { AREAS, VENDORS, naira } from '../lib/data';
import LagosMap from '../components/LagosMap';

export default function Ops() {
  const sim = useSim();
  const active = sim.orders.filter((o) => o.state !== 'delivered' && o.state !== 'rejected');
  const inTransit = active.filter((o) => o.state === 'picked' || o.state === 'claimed');
  const online = sim.riders.filter((r) => r.online);
  const busy = online.filter((r) => r.status !== 'idle');
  const gmv = active.reduce((s, o) => s + o.subtotal + o.fees.total, 0);

  const perArea = AREAS.map((a) => ({
    a,
    n: active.filter((o) => o.areaId === a.id).length,
  })).sort((x, y) => y.n - x.n);
  const maxN = Math.max(1, ...perArea.map((x) => x.n));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      {/* header strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline pb-4">
        <div>
          <p className="mono-label">SARE NETWORK OPS · LAGOS GRID</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-cream">Command view</h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px] tracking-wider">
          <span className="flex items-center gap-1.5 text-leaf"><span className="h-1.5 w-1.5 rounded-full bg-leaf pulse-dot" />LIVE</span>
          <span className="text-cream-dim">TICK {sim.tick}</span>
          <span className="text-cream-dim">1s = 1 MIN</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr_320px]">
        {/* left: layer stats */}
        <div className="space-y-4">
          <div className="panel p-4">
            <p className="mono-label mb-3">NETWORK</p>
            {[
              ['Riders online', `${online.length}/${sim.riders.length}`, 'text-cream'],
              ['On a run', String(busy.length), 'text-ember'],
              ['Orders in motion', String(active.length), 'text-cream'],
              ['In transit now', String(inTransit.length), 'text-leaf'],
              ['GMV in motion', naira(gmv), 'text-cream'],
            ].map(([l, r, c]) => (
              <div key={l as string} className="flex justify-between border-b hairline py-2 text-sm last:border-0">
                <span className="text-cream-dim">{l}</span>
                <span className={`font-mono ${c}`}>{r}</span>
              </div>
            ))}
          </div>
          <div className="panel p-4">
            <p className="mono-label mb-3">DEMAND BY AREA</p>
            {perArea.map(({ a, n }) => (
              <div key={a.id} className="mb-2">
                <div className="flex justify-between font-mono text-[10px] tracking-wider text-cream-dim">
                  <span>{a.name.toUpperCase()}</span><span>{n}</span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-forest-mid">
                  <div className="h-full rounded-full bg-ember transition-all duration-700" style={{ width: `${(n / maxN) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="panel p-4">
            <p className="mono-label mb-2">LEGEND</p>
            {[
              ['#B8AC9C', 'Rider idle'], ['#34d399', 'Rider on run'], ['#F95E2C', 'Your rider / vendor'],
              ['#1F503F', 'Vendor pin'], ['#0a3f4a', 'Lagoon'],
            ].map(([c, l]) => (
              <div key={l} className="flex items-center gap-2 py-1 text-xs text-cream-dim">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* center: map */}
        <div className="panel relative min-h-[420px] overflow-hidden lg:min-h-[560px]">
          <LagosMap riders={sim.riders} />
          <div className="absolute bottom-3 left-3 rounded-lg bg-forest-deep/80 px-3 py-2 font-mono text-[10px] tracking-wider text-cream-dim backdrop-blur">
            LAGOS · 10 AREAS · {VENDORS.length} VENDORS · GRID ≈ 24 KM ACROSS
          </div>
        </div>

        {/* right: live feed */}
        <div className="panel flex max-h-[560px] flex-col p-4">
          <p className="mono-label mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-ember pulse-dot" /> EVENT STREAM
          </p>
          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {sim.events.map((e, i) => (
              <div key={i} className={`border-l-2 py-1 pl-3 font-mono text-[11px] leading-relaxed ${
                i === 0 ? 'border-ember text-cream' : 'border-cream/15 text-cream-dim'
              }`}>
                {e}
              </div>
            ))}
          </div>
          <div className="mt-3 border-t hairline pt-3">
            <p className="mono-label mb-2">ACTIVE ORDERS</p>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {active.slice(0, 12).map((o) => (
                <div key={o.id} className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-cream">{o.code}{o.isUser ? ' ·YOU' : ''}</span>
                  <span className={
                    o.state === 'picked' || o.state === 'claimed' ? 'text-leaf' :
                    o.state === 'incoming' ? 'text-ember' : 'text-cream-dim'
                  }>{o.state.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
