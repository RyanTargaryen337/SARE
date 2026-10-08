// ── Sare · core data model for the Lagos dispatch network ──────────────

export interface Area {
  id: string;
  name: string;
  x: number; // 0-100 map grid
  y: number;
}

export const AREAS: Area[] = [
  { id: 'lekki', name: 'Lekki Phase 1', x: 78, y: 68 },
  { id: 'vi', name: 'Victoria Island', x: 62, y: 78 },
  { id: 'ikoyi', name: 'Ikoyi', x: 48, y: 72 },
  { id: 'yaba', name: 'Yaba', x: 34, y: 46 },
  { id: 'surulere', name: 'Surulere', x: 20, y: 52 },
  { id: 'ikeja', name: 'Ikeja GRA', x: 38, y: 18 },
  { id: 'maryland', name: 'Maryland', x: 50, y: 30 },
  { id: 'ajah', name: 'Ajah', x: 90, y: 56 },
  { id: 'festac', name: 'Festac Town', x: 8, y: 70 },
  { id: 'oshodi', name: 'Oshodi', x: 26, y: 34 },
];

export interface MenuItem {
  id: string;
  name: string;
  price: number; // naira
  tag?: string;
}

export interface Vendor {
  id: string;
  name: string;
  area: string;
  cuisine: string;
  rating: number;
  prepMins: number; // base prep time
  emojiHue: number; // for avatar
  menu: MenuItem[];
}

export const VENDORS: Vendor[] = [
  {
    id: 'v1', name: 'Mama Nkechi Kitchen', area: 'yaba', cuisine: 'Nigerian · Swallow', rating: 4.8, prepMins: 9, emojiHue: 20,
    menu: [
      { id: 'm11', name: 'Amala + Ewedu + Gbegiri + Assorted', price: 3500, tag: 'Bestseller' },
      { id: 'm12', name: 'Ofada Rice & Ayamase Sauce', price: 4200 },
      { id: 'm13', name: 'Pounded Yam + Egusi + Goat Meat', price: 4800 },
      { id: 'm14', name: 'Peppered Snail (6 pcs)', price: 5500 },
    ],
  },
  {
    id: 'v2', name: 'Suya Republic', area: 'ikeja', cuisine: 'Grill · Suya', rating: 4.7, prepMins: 7, emojiHue: 8,
    menu: [
      { id: 'm21', name: 'Beef Suya (Large, Extra Yaji)', price: 3800, tag: 'Hot' },
      { id: 'm22', name: 'Chicken Suya Wrap', price: 2800 },
      { id: 'm23', name: 'Kilishi 100g Pack', price: 4500 },
      { id: 'm24', name: 'Grilled Croaker + Chips', price: 6200 },
    ],
  },
  {
    id: 'v3', name: 'Jollof Junction', area: 'vi', cuisine: 'Rice · Party Style', rating: 4.9, prepMins: 8, emojiHue: 35,
    menu: [
      { id: 'm31', name: 'Smoky Party Jollof + Chicken', price: 4500, tag: 'Bestseller' },
      { id: 'm32', name: 'Native Rice + Peppered Ponmo', price: 3900 },
      { id: 'm33', name: 'Fried Rice & Jollof Combo + Turkey', price: 5800 },
      { id: 'm34', name: 'Chapman (50cl)', price: 1800 },
    ],
  },
  {
    id: 'v4', name: 'Buka Express', area: 'surulere', cuisine: 'Local · Fast', rating: 4.5, prepMins: 6, emojiHue: 50,
    menu: [
      { id: 'm41', name: 'Eba + Okra Soup + Fish', price: 2900 },
      { id: 'm42', name: 'Beans & Dodo (Ewa Agoyin)', price: 2400, tag: 'Value' },
      { id: 'm43', name: 'Moi Moi (2 pcs) + Pap', price: 2100 },
      { id: 'm44', name: 'White Rice + Ofe Akwu', price: 3300 },
    ],
  },
  {
    id: 'v5', name: 'Shawarma Stop 24/7', area: 'lekki', cuisine: 'Middle Eastern', rating: 4.6, prepMins: 5, emojiHue: 200,
    menu: [
      { id: 'm51', name: 'Double Chicken Shawarma', price: 4200, tag: 'Late Night' },
      { id: 'm52', name: 'Beef Shawarma + Extra Cheese', price: 4800 },
      { id: 'm53', name: 'Mixed Grill Platter (2 pax)', price: 9500 },
      { id: 'm54', name: 'Fresh Yoghurt Parfait', price: 2600 },
    ],
  },
  {
    id: 'v6', name: 'Eden Bowls & Smoothies', area: 'ikoyi', cuisine: 'Healthy · Bowls', rating: 4.7, prepMins: 6, emojiHue: 140,
    menu: [
      { id: 'm61', name: 'Grilled Chicken Protein Bowl', price: 6500 },
      { id: 'm62', name: 'Zobo + Ginger Smoothie', price: 2200, tag: 'Fresh' },
      { id: 'm63', name: 'Avocado & Quinoa Salad', price: 5900 },
      { id: 'm64', name: 'Tiger Nut Milk (50cl)', price: 2400 },
    ],
  },
  {
    id: 'v7', name: 'Chops & Chills', area: 'maryland', cuisine: 'Small Chops · Bakery', rating: 4.4, prepMins: 5, emojiHue: 280,
    menu: [
      { id: 'm71', name: 'Small Chops Pack (20 pcs)', price: 5000, tag: 'Party' },
      { id: 'm72', name: 'Meat Pie + Sausage Roll Combo', price: 2800 },
      { id: 'm73', name: 'Chin Chin Jar 500g', price: 3200 },
      { id: 'm74', name: 'Ice Cream Sundae', price: 2500 },
    ],
  },
  {
    id: 'v8', name: 'Pepper Dem Pasta', area: 'yaba', cuisine: 'Fusion · Pasta', rating: 4.6, prepMins: 10, emojiHue: 320,
    menu: [
      { id: 'm81', name: 'Peppered Alfredo + Shrimp', price: 7200, tag: 'Chef Pick' },
      { id: 'm82', name: 'Suya Bolognese', price: 6100 },
      { id: 'm83', name: 'Plantain Carbonara', price: 5600 },
      { id: 'm84', name: 'Garlic Bread (4 pcs)', price: 1800 },
    ],
  },
];

export const RIDER_NAMES = [
  'Tunde A.', 'Chidi O.', 'Musa B.', 'Emeka N.', 'Segun K.', 'Ifeanyi E.',
  'Damilola F.', 'Kelechi U.', 'Femi O.', 'Bala S.', 'Yusuf I.', 'Osas A.',
];

// ── Pricing constants (research-grounded, see Pricing page) ────────────
export const PRICING = {
  deliveryBase: 500,       // ₦ flat base
  deliveryPerKm: 120,      // ₦ per km
  freeDeliveryOver: 15000, // ₦ subtotal threshold
  serviceFeePct: 0.05,     // 5% of subtotal
  serviceFeeCap: 500,      // ₦ cap (mirrors Chowdeck's capped service fee)
  surgeMultiplier: 1.25,   // peak-hour / rain
  smallOrderFee: 300,      // ₦ when subtotal < ₦2000
  smallOrderBelow: 2000,
  vendorCommission: 0.20,  // 20% standard rate
  riderPerKm: 150,         // ₦ rider pay per km
  riderDropFee: 400,       // ₦ per completed drop
  riderMonthlyBonus: 10000, // ₦ food allowance at 300 deliveries/mo
  riderSundayBonus: 5000,  // ₦ Sunday streak bonus
};

export function naira(n: number): string {
  return '₦' + Math.round(n).toLocaleString('en-NG');
}

export function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** grid distance → real km (map ≈ 24km across Lagos) */
export function gridToKm(g: number): number {
  return g * 0.24;
}

export function deliveryFee(subtotal: number, km: number, surge: boolean) {
  const base =
    subtotal >= PRICING.freeDeliveryOver
      ? 0
      : (PRICING.deliveryBase + PRICING.deliveryPerKm * km) *
        (surge ? PRICING.surgeMultiplier : 1);
  const service = Math.min(subtotal * PRICING.serviceFeePct, PRICING.serviceFeeCap);
  const small = subtotal < PRICING.smallOrderBelow ? PRICING.smallOrderFee : 0;
  return {
    delivery: Math.round(base),
    service: Math.round(service),
    small,
    total: Math.round(base + service + small),
  };
}
