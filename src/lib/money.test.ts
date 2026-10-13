import { describe, expect, it } from 'vitest';
import { bookingFeeKobo, commissionKobo, nairaToKobo, orderChargeNaira, processorFeeKobo, splitPayment, vendorNetNaira } from './money';

describe('commissionKobo (5% of the food bill, minimum ₦200)', () => {
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

describe('order charge, vendor net and booking fee (pre-seed deck pricing)', () => {
  // service and small-order fees exist in the sim's fee object but are never charged
  const order = { subtotal: 6_000, fees: { delivery: 1_000, service: 300, small: 300, total: 1_600 } };

  it('charges menu price, delivery fee and the ₦100 service fee', () => {
    expect(orderChargeNaira(order)).toBe(7_100);
  });

  it('takes 5% of the food bill only, not the delivery fee', () => {
    expect(vendorNetNaira(order)).toBe(5_700); // 6,000 − 300
  });

  it('applies the ₦200 minimum to the food bill and never goes negative', () => {
    expect(vendorNetNaira({ subtotal: 3_000 })).toBe(2_800);
    expect(vendorNetNaira({ subtotal: 150 })).toBe(0);
  });

  it('charges partner riders 5% of the delivery fee', () => {
    expect(bookingFeeKobo(nairaToKobo(2_000))).toBe(nairaToKobo(100));
    expect(bookingFeeKobo(0)).toBe(0);
    expect(() => bookingFeeKobo(-1)).toThrow(RangeError);
  });
});

describe('splitPayment (Sàrè pays the processor fee)', () => {
  const k = nairaToKobo;

  it('deck worked example: ₦3,000 food + ₦2,000 partner delivery', () => {
    expect(splitPayment(k(3_000), k(2_000), true)).toEqual({
      totalKobo: k(5_100),
      vendorKobo: k(2_800), // 3,000 − ₦200 minimum commission
      riderKobo: k(1_900), // 2,000 − 5% booking fee
      sareGrossKobo: k(400), // 200 + 100 + 100 service fee
      processorKobo: k(176.5), // 1.5% of 5,100 + ₦100
      sareNetKobo: k(223.5),
    });
  });

  it("pilot case: the vendor's own rider keeps the whole delivery fee", () => {
    const s = splitPayment(k(3_000), k(2_000), false);
    expect([s.vendorKobo, s.riderKobo, s.sareNetKobo]).toEqual([k(4_800), 0, k(123.5)]);
  });

  it('every kobo is accounted for', () => {
    for (const [food, delivery, partner] of [[1_000, 500, false], [4_000, 2_000, true], [50_000, 3_000, false]] as const) {
      const s = splitPayment(k(food), k(delivery), partner);
      expect(s.vendorKobo + s.riderKobo + s.sareGrossKobo).toBe(s.totalKobo);
    }
  });

  it('processor fee: ₦100 waived under ₦2,500, capped at ₦2,000', () => {
    expect(processorFeeKobo(k(1_600))).toBe(k(24));
    expect(processorFeeKobo(k(2_500))).toBe(k(137.5));
    expect(processorFeeKobo(k(500_000))).toBe(k(2_000));
  });
});
