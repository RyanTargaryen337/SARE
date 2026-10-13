// Phase 1 pricing (pre-seed deck, Oct 2026): vendors pay 5% of the food bill, minimum ₦200 per
// order; customers pay a ₦100 service fee shown on the menu; Sàrè partner riders pay a 5% booking
// fee on the delivery fee (vendors' own riders pay nothing). Money is integer kobo to avoid float drift.

export const COMMISSION_RATE_BPS = 500; // 5.00%
export const COMMISSION_MIN_KOBO = 200_00; // ₦200
export const SERVICE_FEE_KOBO = 100_00; // ₦100, paid by the customer
export const BOOKING_FEE_BPS = 500; // 5.00% of the delivery fee, partner riders only

export const nairaToKobo = (naira: number) => Math.round(naira * 100);
export const koboToNaira = (kobo: number) => kobo / 100;

const assertKobo = (kobo: number, what: string) => {
  if (!Number.isInteger(kobo) || kobo < 0) {
    throw new RangeError(`${what} must be a non-negative integer number of kobo, got ${kobo}`);
  }
};

/** `bps` basis points of `kobo`, rounded half up to the nearest kobo. */
const percentOf = (kobo: number, bps: number) => Math.floor((kobo * bps + 5_000) / 10_000);

/** Sàrè's commission on one order's food bill, in kobo. */
export function commissionKobo(foodKobo: number): number {
  assertKobo(foodKobo, 'food bill');
  // The ₦200 minimum never exceeds the food bill itself, so a vendor's net is never negative.
  return Math.min(Math.max(percentOf(foodKobo, COMMISSION_RATE_BPS), COMMISSION_MIN_KOBO), foodKobo);
}

/** Booking fee a Sàrè partner rider pays on a delivery, in kobo. Vendors' own riders pay none. */
export function bookingFeeKobo(deliveryKobo: number): number {
  assertKobo(deliveryKobo, 'delivery fee');
  return percentOf(deliveryKobo, BOOKING_FEE_BPS);
}

type Charged = { subtotal: number; fees: { delivery: number } };

/** What the customer pays, in naira: menu price, delivery fee and the ₦100 service fee. */
export const orderChargeNaira = (o: Charged) => o.subtotal + o.fees.delivery + koboToNaira(SERVICE_FEE_KOBO);

/** What the vendor keeps from the food bill, in naira, before processor fees. */
export function vendorNetNaira(o: Pick<Charged, 'subtotal'>): number {
  const food = nairaToKobo(o.subtotal);
  return koboToNaira(food - commissionKobo(food));
}
