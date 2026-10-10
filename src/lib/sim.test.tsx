import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SimProvider } from './sim';
import { useSim, type SimApi } from './useSim';
import { VENDORS } from './data';

const wrapper = ({ children }: { children: ReactNode }) => <SimProvider>{children}</SimProvider>;

function setup() {
  return renderHook(() => useSim(), { wrapper });
}

/** Each tick is one setInterval(1000) step of the simulation. */
function tick(n: number) {
  act(() => { vi.advanceTimersByTime(n * 1000); });
}

const order = (sim: SimApi, id: string) => sim.orders.find((o) => o.id === id)!;

describe('SimProvider', () => {
  // Fixed randomness keeps rider availability and travel times deterministic.
  beforeEach(() => { vi.useFakeTimers(); vi.spyOn(Math, 'random').mockReturnValue(0.5); });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  it('records ambient network events in the feed (regression: pushEvent result was discarded)', () => {
    const { result } = setup();
    expect(result.current.events).toHaveLength(1); // boot line only
    tick(30);
    const feed = result.current.events.join('\n');
    expect(result.current.events.length).toBeGreaterThan(1);
    expect(feed).toMatch(/auto-accepted|ready for pickup|dispatched|→/);
  });

  it('runs a customer order from placed to delivered', () => {
    const { result } = setup();
    const v = VENDORS[0];
    let id = '';
    act(() => { id = result.current.placeOrder(v.id, [{ name: v.menu[0].name, qty: 1, price: v.menu[0].price }], 'yaba'); });
    expect(order(result.current, id).state).toBe('incoming');
    act(() => { result.current.acceptOrder(id); });
    expect(order(result.current, id).state).toBe('preparing');
    act(() => { result.current.markReady(id); });
    expect(order(result.current, id).state).toBe('ready');
    tick(400);
    const done = order(result.current, id);
    expect(done.state).toBe('delivered');
    expect(done.riderId).not.toBeNull();
  });

  it('a rejected order never reaches a rider', () => {
    const { result } = setup();
    const v = VENDORS[1];
    let id = '';
    act(() => { id = result.current.placeOrder(v.id, [{ name: v.menu[0].name, qty: 1, price: v.menu[0].price }], 'ikeja'); });
    act(() => { result.current.rejectOrder(id); });
    const riderId = result.current.riders[0].id;
    act(() => { result.current.claimOrder(id, riderId); });
    tick(20);
    expect(order(result.current, id).state).toBe('rejected');
    expect(order(result.current, id).riderId).toBeNull();
  });

  it('only acts on orders in the right state', () => {
    const { result } = setup();
    const v = VENDORS[2];
    let id = '';
    act(() => { id = result.current.placeOrder(v.id, [{ name: v.menu[0].name, qty: 1, price: v.menu[0].price }], 'vi'); });
    act(() => { result.current.pickupOrder(id); result.current.completeOrder(id); });
    expect(order(result.current, id).state).toBe('incoming'); // pickup/complete ignored before a claim
    act(() => { result.current.acceptOrder(id); result.current.rejectOrder(id); });
    expect(order(result.current, id).state).toBe('preparing'); // reject ignored once accepted

    const rider = result.current.riders.find((r) => r.status === 'idle')!;
    act(() => { result.current.markReady(id); result.current.claimOrder(id, rider.id); });
    expect(order(result.current, id).state).toBe('claimed');
    act(() => { result.current.completeOrder(id); });
    expect(order(result.current, id).state).toBe('claimed'); // complete ignored before pickup
    act(() => { result.current.pickupOrder(id); });
    expect(order(result.current, id).state).toBe('picked');
    act(() => { result.current.completeOrder(id); });
    expect(order(result.current, id).state).toBe('delivered');
  });
});
