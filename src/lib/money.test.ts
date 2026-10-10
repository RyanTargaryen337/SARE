import { describe, expect, it } from 'vitest';
import { commissionKobo, nairaToKobo, orderChargeNaira, vendorNetNaira } from './money';

describe('commissionKobo (5%, minimum ₦200)', () => {
  it.each([
    // [order total ₦, expected fee ₦]
    [0, 0], // the minimum is capped at the order total
    [150, 150],
    [200, 200],
    [2_000, 200],
    [2_500, 200],
    [3_000, 200],
    [4_000, 200], // 5% = exactly ₦200, the crossover
    [4_001, 200.05],
    [5_000, 250],
    [50_000, 2_500],
  ])('₦%d order → ₦%d fee', (total, fee) => {
    expect(commissionKobo(nairaToKobo(total))).toBe(nairaToKobo(fee));
  });

  it('rounds half a kobo up', () => {
    expect(commissionKobo(400_010)).toBe(20_001); // 5% of 400,010 kobo = 20,000.5
  });

  it('rejects fractional or negative kobo', () => {
    expect(() => commissionKobo(100.5)).toThrow(RangeError);
    expect(() => commissionKobo(-1)).toThrow(RangeError);
  });
});

describe('order charge and vendor net', () => {
  // service and small-order fees exist in the sim's fee object but are never charged
  const order = { subtotal: 6_000, fees: { delivery: 1_000, service: 300, small: 300, total: 1_600 } };

  it('charges menu price plus the vendor delivery fee only', () => {
    expect(orderChargeNaira(order)).toBe(7_000);
  });

  it('takes 5% of food plus delivery (regression: commission was on food only)', () => {
    expect(vendorNetNaira(order)).toBe(6_650); // 7,000 − 350
  });

  it('applies the ₦200 minimum to the full charge and never goes negative', () => {
    expect(vendorNetNaira({ subtotal: 2_000, fees: { delivery: 500 } })).toBe(2_300);
    expect(vendorNetNaira({ subtotal: 150, fees: { delivery: 0 } })).toBe(0);
  });
});
