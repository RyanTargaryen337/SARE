import { describe, expect, it } from 'vitest';
import { commissionKobo, nairaToKobo } from './money';

describe('commissionKobo (5%, minimum ₦200)', () => {
  it.each([
    // [order total ₦, expected fee ₦]
    [0, 200],
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
