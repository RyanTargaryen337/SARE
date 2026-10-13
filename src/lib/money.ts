// Phase 1 pricing (pre-seed deck, Oct 2026): vendors pay 5% of the food bill, minimum ₦200 per
// order; customers pay a ₦100 service fee shown on the menu; Sàrè partner riders pay a 5% booking
// fee on the delivery fee (vendors' own riders pay nothing). Sàrè pays the processor's fee out of
// its own share (decision, Oct 2026), so vendors and riders get exactly their share minus their 5%.
// Money is integer kobo to avoid float drift.

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

/** What the vendor keeps from the food bill, in naira. Sàrè pays the processor's fee. */
export function vendorNetNaira(o: Pick<Charged, 'subtotal'>): number {
  const food = nairaToKobo(o.subtotal);
  return koboToNaira(food - commissionKobo(food));
}

// Paystack's published local card pricing: 1.5% + ₦100, the ₦100 waived under ₦2,500, capped at ₦2,000.
// Confirm the real rate (and transfer/USSD rates) in Gate 0 before relying on it.
const PROCESSOR_RATE_BPS = 150;
const PROCESSOR_FLAT_KOBO = 100_00;
const PROCESSOR_FLAT_WAIVED_BELOW_KOBO = 2_500_00;
const PROCESSOR_CAP_KOBO = 2_000_00;

/** The processor's fee on one payment, in kobo (published local card pricing). */
export function processorFeeKobo(totalKobo: number): number {
  assertKobo(totalKobo, 'payment total');
  const flat = totalKobo < PROCESSOR_FLAT_WAIVED_BELOW_KOBO ? 0 : PROCESSOR_FLAT_KOBO;
  return Math.min(percentOf(totalKobo, PROCESSOR_RATE_BPS) + flat, PROCESSOR_CAP_KOBO);
}

export interface Split { totalKobo: number; vendorKobo: number; riderKobo: number; sareGrossKobo: number; processorKobo: number; sareNetKobo: number }

/**
 * How one payment splits, in kobo. With `partnerRider` the delivery fee goes to a Sàrè partner rider,
 * who pays the 5% booking fee; otherwise it goes to the vendor (their own rider). Sàrè's net can be
 * negative on unusual orders (a very large delivery fee on a small food bill): callers should check.
 */
export function splitPayment(foodKobo: number, deliveryKobo: number, partnerRider: boolean): Split {
  const commission = commissionKobo(foodKobo);
  const booking = partnerRider ? bookingFeeKobo(deliveryKobo) : 0;
  const totalKobo = foodKobo + deliveryKobo + SERVICE_FEE_KOBO;
  const vendorKobo = foodKobo - commission + (partnerRider ? 0 : deliveryKobo);
  const riderKobo = partnerRider ? deliveryKobo - booking : 0;
  const sareGrossKobo = commission + booking + SERVICE_FEE_KOBO;
  const processorKobo = processorFeeKobo(totalKobo);
  return { totalKobo, vendorKobo, riderKobo, sareGrossKobo, processorKobo, sareNetKobo: sareGrossKobo - processorKobo };
}
