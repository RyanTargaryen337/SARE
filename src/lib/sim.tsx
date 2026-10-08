import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AREAS, VENDORS, RIDER_NAMES, PRICING, dist, gridToKm, deliveryFee } from './data';
import { SimCtx, type Order, type OrderItem, type Rider, type SimApi, type SimState } from './useSim';

const area = (id: string) => AREAS.find((a) => a.id === id)!;
const vendor = (id: string) => VENDORS.find((v) => v.id === id)!;

let seq = 1000;
const nextCode = () => `SR-${++seq}`;

function makeRiders(): Rider[] {
  return RIDER_NAMES.map((name, i) => {
    const a = AREAS[i % AREAS.length];
    const jx = (Math.random() - 0.5) * 8, jy = (Math.random() - 0.5) * 8;
    return {
      id: `r${i}`, name, x: a.x + jx, y: a.y + jy,
      fx: a.x + jx, fy: a.y + jy, tx: a.x + jx, ty: a.y + jy,
      legTicks: 0, legTotal: 1,
      status: 'idle', orderId: null,
      deliveries: Math.floor(Math.random() * 6),
      monthDeliveries: 180 + Math.floor(Math.random() * 160),
      earnings: 3000 + Math.floor(Math.random() * 9000),
      online: Math.random() > 0.15,
    };
  });
}

function makeOrder(tick: number, isUser: boolean, vendorId?: string, items?: OrderItem[], areaId?: string): Order {
  const v = vendor(vendorId ?? VENDORS[Math.floor(Math.random() * VENDORS.length)].id);
  const va = area(v.area);
  const customerArea = areaId ?? AREAS[Math.floor(Math.random() * AREAS.length)].id;
  const ca = area(customerArea);
  const km = Math.max(1.2, gridToKm(dist(va, ca)) * (0.8 + Math.random() * 0.4));
  const its = items ?? [0, 1].map(() => {
    const m = v.menu[Math.floor(Math.random() * v.menu.length)];
    return { name: m.name, qty: 1 + (Math.random() > 0.7 ? 1 : 0), price: m.price };
  }).filter((m, i, arr) => arr.findIndex((x) => x.name === m.name) === i);
  const subtotal = its.reduce((s, i) => s + i.price * i.qty, 0);
  const surge = Math.random() < 0.2;
  return {
    id: `o${tick}-${Math.random().toString(36).slice(2, 7)}`,
    code: nextCode(), vendorId: v.id, areaId: customerArea, items: its, subtotal,
    fees: deliveryFee(subtotal, km, surge), km, surge,
    state: 'incoming', placedAt: tick,
    prepTicksLeft: v.prepMins + Math.floor(Math.random() * 4),
    riderId: null, isUser, incomingSince: tick, readySince: null, deliveredAt: null,
  };
}

function assignRider(order: Order, riders: Rider[]): string | null {
  const va = area(vendor(order.vendorId).area);
  let best: Rider | null = null; let bd = Infinity;
  for (const r of riders) {
    if (!r.online || r.status !== 'idle') continue;
    const d = dist(r, va);
    if (d < bd) { bd = d; best = r; }
  }
  return best?.id ?? null;
}

function startLeg(r: Rider, tx: number, ty: number) {
  const d = dist(r, { x: tx, y: ty });
  // 1 tick ≈ 1 minute; rider ≈ 24km/h in Lagos traffic ⇒ 1 grid unit ≈ 0.24km ⇒ ~0.6 grid/tick
  const ticks = Math.max(2, Math.round(d / 0.9));
  r.fx = r.x; r.fy = r.y; r.tx = tx; r.ty = ty; r.legTicks = ticks; r.legTotal = ticks;
}

const pushEvent = (evts: string[], msg: string) => [msg, ...evts].slice(0, 24);

export function SimProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SimState>(() => {
    const riders = makeRiders();
    const orders: Order[] = [];
    for (let i = 0; i < 6; i++) orders.push(makeOrder(-i * 3, false));
    return { tick: 0, riders, orders, surge: false, events: ['Network live — Lagos grid online'] };
  });
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    const iv = setInterval(() => {
      setState((prev) => {
        const tick = prev.tick + 1;
        const riders = prev.riders.map((r) => ({ ...r }));
        const orders = prev.orders.map((o) => ({ ...o }));
        const events = [...prev.events];

        // spawn ambient orders
        if (tick % 5 === 0 && orders.filter((o) => o.state !== 'delivered' && o.state !== 'rejected').length < 14) {
          const o = makeOrder(tick, false);
          orders.push(o);
          pushEvent(events, `${o.code} · ${vendor(o.vendorId).name} → ${area(o.areaId).name}`);
        }

        for (const o of orders) {
          // auto-accept stale incoming orders (auto-dispatch SLA)
          if (o.state === 'incoming' && tick - o.incomingSince >= 8) {
            o.state = 'preparing';
            pushEvent(events, `${o.code} auto-accepted · prep started`);
          }
          if (o.state === 'preparing') {
            o.prepTicksLeft -= 1;
            if (o.prepTicksLeft <= 0) { o.state = 'ready'; o.readySince = tick; pushEvent(events, `${o.code} ready for pickup`); }
          }
          if (o.state === 'accepted') { o.state = 'preparing'; }
          // auto-assign a rider shortly after ready (gives the rider app a claim window)
          if (o.state === 'ready' && !o.riderId && tick - (o.readySince ?? tick) >= 7) {
            const rid = assignRider(o, riders);
            if (rid) {
              o.riderId = rid; o.state = 'claimed';
              const r = riders.find((x) => x.id === rid)!;
              const va = area(vendor(o.vendorId).area);
              r.status = 'pickup'; r.orderId = o.id;
              startLeg(r, va.x, va.y);
              pushEvent(events, `${o.code} · ${r.name} dispatched`);
            }
          }
        }

        // move riders
        for (const r of riders) {
          if (r.legTicks > 0) {
            r.legTicks -= 1;
            const p = 1 - r.legTicks / r.legTotal;
            r.x = r.fx + (r.tx - r.fx) * p;
            r.y = r.fy + (r.ty - r.fy) * p;
            if (r.legTicks === 0 && r.orderId) {
              const o = orders.find((x) => x.id === r.orderId);
              if (o) {
                if (r.status === 'pickup') {
                  o.state = 'picked';
                  const ca = area(o.areaId);
                  r.status = 'dropoff';
                  startLeg(r, ca.x, ca.y);
                  pushEvent(events, `${o.code} picked up · en route to ${ca.name}`);
                } else if (r.status === 'dropoff') {
                  o.state = 'delivered'; o.deliveredAt = tick;
                  r.status = 'idle'; r.orderId = null;
                  r.deliveries += 1; r.monthDeliveries += 1;
                  r.earnings += Math.round(PRICING.riderDropFee + PRICING.riderPerKm * o.km);
                  pushEvent(events, `${o.code} delivered · ${tick - o.placedAt} min door-to-door`);
                }
              }
            }
          }
        }

        // prune old delivered orders (keep user's)
        const kept = orders.filter((o) => (o.state !== 'delivered' && o.state !== 'rejected') || o.isUser || (o.deliveredAt && tick - o.deliveredAt < 20)).slice(-40);

        return { tick, riders, orders: kept, surge: prev.surge, events };
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const placeOrder = useCallback((vendorId: string, items: OrderItem[], areaId: string) => {
    const o = makeOrder(stateRef.current.tick, true, vendorId, items, areaId);
    setState((p) => ({ ...p, orders: [...p.orders, o], events: pushEvent([...p.events], `${o.code} · YOUR ORDER · ${vendor(vendorId).name}`) }));
    return o.id;
  }, []);

  const upd = useCallback((id: string, fn: (o: Order, tick: number) => void) => {
    setState((p) => ({ ...p, orders: p.orders.map((o) => { if (o.id === id) { const c = { ...o }; fn(c, p.tick); return c; } return o; }) }));
  }, []);

  const acceptOrder = useCallback((id: string) => upd(id, (o) => { if (o.state === 'incoming') o.state = 'preparing'; }), [upd]);
  const rejectOrder = useCallback((id: string) => upd(id, (o) => { if (o.state === 'incoming') o.state = 'rejected'; }), [upd]);
  const markReady = useCallback((id: string) => upd(id, (o, tick) => {
    if (o.state === 'preparing' || o.state === 'accepted') { o.state = 'ready'; o.readySince = tick; o.prepTicksLeft = 0; }
  }), [upd]);

  const claimOrder = useCallback((orderId: string, riderId: string) => {
    setState((p) => {
      const riders = p.riders.map((r) => ({ ...r }));
      const orders = p.orders.map((o) => ({ ...o }));
      const o = orders.find((x) => x.id === orderId);
      const r = riders.find((x) => x.id === riderId);
      if (!o || !r || o.riderId || (o.state !== 'ready' && o.state !== 'preparing')) return p;
      o.riderId = riderId; o.state = 'claimed';
      r.status = 'pickup'; r.orderId = orderId;
      const va = area(vendor(o.vendorId).area);
      startLeg(r, va.x, va.y);
      return { ...p, riders, orders, events: pushEvent([...p.events], `${o.code} · YOU claimed the run`) };
    });
  }, []);

  const pickupOrder = useCallback((orderId: string) => {
    // instant pickup when rider is near vendor (demo shortcut)
    setState((p) => {
      const riders = p.riders.map((r) => ({ ...r }));
      const orders = p.orders.map((o) => ({ ...o }));
      const o = orders.find((x) => x.id === orderId);
      const r = riders.find((x) => x.orderId === orderId);
      if (!o || !r || o.state !== 'claimed') return p;
      o.state = 'picked';
      const ca = area(o.areaId);
      r.status = 'dropoff';
      startLeg(r, ca.x, ca.y);
      return { ...p, riders, orders, events: pushEvent([...p.events], `${o.code} picked up · en route to ${ca.name}`) };
    });
  }, []);

  const completeOrder = useCallback((orderId: string) => {
    setState((p) => {
      const riders = p.riders.map((r) => ({ ...r }));
      const orders = p.orders.map((o) => ({ ...o }));
      const o = orders.find((x) => x.id === orderId);
      const r = riders.find((x) => x.orderId === orderId);
      if (!o || !r || o.state !== 'picked') return p;
      o.state = 'delivered'; o.deliveredAt = p.tick;
      r.status = 'idle'; r.orderId = null; r.deliveries += 1; r.monthDeliveries += 1;
      r.earnings += Math.round(PRICING.riderDropFee + PRICING.riderPerKm * o.km);
      return { ...p, riders, orders, events: pushEvent([...p.events], `${o.code} delivered · confirmed`) };
    });
  }, []);

  const toggleRider = useCallback((riderId: string) => {
    setState((p) => ({ ...p, riders: p.riders.map((r) => (r.id === riderId ? { ...r, online: !r.online } : r)) }));
  }, []);

  const api: SimApi = { ...state, placeOrder, acceptOrder, rejectOrder, markReady, claimOrder, pickupOrder, completeOrder, toggleRider };
  return <SimCtx.Provider value={api}>{children}</SimCtx.Provider>;
}
