// Phase 1 commission rule (CEO-M1): 5% of the full amount charged (food + the vendor's
// delivery fee), minimum ₦200 per order. Money is integer kobo to avoid float drift.

export const COMMISSION_RATE_BPS = 500; // 5.00%
export const COMMISSION_MIN_KOBO = 200_00; // ₦200

export const nairaToKobo = (naira: number) => Math.round(naira * 100);
export const koboToNaira = (kobo: number) => kobo / 100;

/** Sare's fee on one order, in kobo. Rounds half up to the nearest kobo. */
export function commissionKobo(orderTotalKobo: number): number {
  if (!Number.isInteger(orderTotalKobo) || orderTotalKobo < 0) {
    throw new RangeError(`order total must be a non-negative integer number of kobo, got ${orderTotalKobo}`);
  }
  const pct = Math.floor((orderTotalKobo * COMMISSION_RATE_BPS + 5_000) / 10_000);
  // The ₦200 minimum never exceeds the order itself, so a vendor's net is never negative.
  return Math.min(Math.max(pct, COMMISSION_MIN_KOBO), orderTotalKobo);
}

type Charged = { subtotal: number; fees: { delivery: number } };

/** What the customer pays, in naira: menu price plus the vendor's delivery fee. Sare adds no customer fees. */
export const orderChargeNaira = (o: Charged) => o.subtotal + o.fees.delivery;

/** What the vendor keeps, in naira: the full charge minus Sare's fee on that full charge. */
export function vendorNetNaira(o: Charged): number {
  const charge = nairaToKobo(orderChargeNaira(o));
  return koboToNaira(charge - commissionKobo(charge));
}
