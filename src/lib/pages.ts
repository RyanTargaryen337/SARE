// src/lib/pages.ts
//
// Content for the marketing/info pages. Every claim here must match the approved plan
// (docs/designs/sare-platform.md): 5% commission with a ₦200 minimum taken inside the
// processor split, payouts on the processor's settlement schedule, Sare never holds
// customer or vendor money, customers pay menu price + the vendor's delivery fee only.
// Do not add traction numbers, team sizes, dates or contacts until they are true.
import { page } from './routes'

export interface PageSection {
  heading: string
  body?: string
  bullets?: string[]
  link?: { label: string; to: string }
}

export interface PageDef {
  slug: string
  group: 'product' | 'company' | 'legal' | 'support'
  eyebrow: string
  title: string
  lede: string
  /** live = in the pilot today, planned = not available yet, draft = legal text pending counsel review. */
  status: 'live' | 'planned' | 'draft'
  sections: PageSection[]
  cta?: { label: string; to: string }
  meta?: Array<{ k: string; v: string }>
}

export const STATUS_LABEL: Record<PageDef['status'], string> = {
  live: 'In pilot',
  planned: 'Planned · not available yet',
  draft: 'Draft · pending legal review, not in force',
}

export const PAGES: Record<string, PageDef> = {
  /* ── PRODUCT ───────────────────────────────────────────── */
  customers: {
    slug: 'customers',
    group: 'product',
    eyebrow: 'For customers',
    title: 'Order from the vendors you already love.',
    lede:
      'Your favourite local kitchen sends you their Sare link. You see their menu at the same price as the counter, pay securely, and follow your order until it reaches you.',
    status: 'live',
    sections: [
      {
        heading: 'What you can order today',
        body: 'During the pilot, Sare powers ordering links for individual vendors. One order is from one vendor.',
        bullets: [
          'Food from participating local kitchens',
          'Card, bank transfer or USSD through our payment processor',
          'Browsing groceries, pharmacies and markets across many vendors is planned, not live',
        ],
      },
      {
        heading: 'Set your location once',
        body: 'We ask where you are before we show anything. No fake "near you" listings. What you see should reflect what can actually reach your door.',
      },
      {
        heading: 'Know where your order is',
        body: 'You get a status page and an SMS when the vendor accepts, when your order is out for delivery and when it is delivered. If the vendor does not accept within 10 minutes of your payment, you are refunded automatically.',
      },
      {
        heading: 'What you pay',
        body: 'The menu price plus the vendor’s own delivery fee. No Sare service fee, no surge pricing. Sare’s fee is paid by the vendor and shown on your receipt.',
      },
    ],
    cta: { label: 'Try the ordering demo', to: 'order' },
  },

  vendors: {
    slug: 'vendors',
    group: 'product',
    eyebrow: 'For vendors',
    title: 'Get paid for your orders, on time, every time.',
    lede:
      'Sare gives your kitchen its own ordering link. Customers pay through a licensed payment processor, and your share goes straight to your bank. Sare never holds your money.',
    status: 'live',
    sections: [
      {
        heading: 'How you get paid',
        body: 'Every payment is split by the processor at the moment the customer pays. Your share settles to your bank account on the processor’s settlement schedule, the same for every vendor.',
        bullets: [
          'A morning SMS tells you what was sent, for how many orders, to which account',
          'Your ledger shows every order, fee, refund and settlement',
          'If a settlement is late, it is flagged and we chase the processor for you',
        ],
      },
      {
        heading: 'What it costs',
        body: '5% of each order (food plus your delivery fee), minimum ₦200 per order, taken inside the payment split. No monthly fee, no signup fee. Your menu price stays your price.',
      },
      {
        heading: 'Getting started',
        bullets: [
          'Sign up with your phone number',
          'Verify with your BVN and a bank account in your name',
          'Registered businesses can add CAC and TIN for a higher weekly limit',
          'Add your menu, set delivery fees per area, share your link on WhatsApp',
        ],
      },
    ],
    cta: { label: 'Open the Vendor Hub demo', to: 'vendor' },
  },

  riders: {
    slug: 'riders',
    group: 'product',
    eyebrow: 'For riders',
    title: 'A rider network, built carefully.',
    lede:
      'During the pilot, vendors deliver with their own riders. A Sare rider network comes later, zone by zone, once the vendor side is proven.',
    status: 'planned',
    sections: [
      {
        heading: 'What riders will need',
        bullets: [
          'NIN and BVN verification',
          'A valid licence, vehicle papers and insurance',
          'LASDRI registration for Lagos',
          'A smartphone with data',
        ],
      },
      {
        heading: 'What we are designing for',
        body: 'A per-delivery earnings breakdown, a minimum per delivery at peak hours, limits on continuous working hours, and no cash handling: customers pay through the processor, never the rider.',
      },
    ],
    cta: { label: 'See the Rider App demo', to: 'rider' },
  },

  ads: {
    slug: 'ads',
    group: 'product',
    eyebrow: 'Sare Ads',
    title: 'Advertising on Sare.',
    lede: 'Sare Ads is not available. Paid placements only make sense once customers browse across many vendors, which comes after the pilot.',
    status: 'planned',
    sections: [
      {
        heading: 'Ideas we are considering',
        bullets: [
          'Sponsored placements in category and search results',
          'Area-based targeting, never by personal identity',
          'Clear labels on anything that is paid for',
        ],
      },
    ],
    cta: { label: 'Register interest', to: page('contact') },
  },

  'soke-sare': {
    slug: 'soke-sare',
    group: 'product',
    eyebrow: 'Loyalty',
    title: 'Soke Sare.',
    lede: 'A rewards programme for regular customers is an idea, not a product. There are no points to earn or spend yet.',
    status: 'planned',
    sections: [
      {
        heading: 'What it could look like',
        bullets: [
          'Rewards for ordering again from your favourite vendors',
          'Perks agreed with vendors, never funded by raising menu prices',
        ],
      },
    ],
    cta: { label: 'Try the ordering demo', to: 'order' },
  },

  storefront: {
    slug: 'storefront',
    group: 'product',
    eyebrow: 'Storefront',
    title: 'Your own ordering link.',
    lede:
      'This is what Sare is today: a mobile ordering page for your kitchen that you share with your own customers on WhatsApp.',
    status: 'live',
    sections: [
      {
        heading: 'What you get',
        bullets: [
          'Your menu, your prices, shown with a "same price as the counter" badge',
          'A light page that loads on cheap phones and slow data',
          'Card, transfer and USSD payments through the processor',
          'Order alerts by SMS, plus a WhatsApp link to the customer',
          'Delivery with your own rider, at the fee you set per area',
        ],
      },
      {
        heading: 'What it costs',
        body: '5% of each order, minimum ₦200, taken inside the payment split. Nothing else.',
      },
    ],
    cta: { label: 'Open the Vendor Hub demo', to: 'vendor' },
  },

  documentation: {
    slug: 'documentation',
    group: 'product',
    eyebrow: 'Developers',
    title: 'Sare API.',
    lede: 'There is no public API yet. Documentation will be published here if and when partner access opens.',
    status: 'planned',
    sections: [
      {
        heading: 'If you want to integrate',
        body: 'Tell us what you would build and we will let you know when partner access is available.',
      },
    ],
    cta: { label: 'Get in touch', to: page('contact') },
  },

  'food-delivery': {
    slug: 'food-delivery',
    group: 'product',
    eyebrow: 'Food delivery',
    title: 'Food from your favourite kitchen, paid for safely.',
    lede:
      'Order through your vendor’s Sare link. Your payment is protected, the vendor is verified, and you always know where your order stands.',
    status: 'live',
    sections: [
      {
        heading: 'Why Sare',
        bullets: [
          'Verified vendors: BVN and bank account checks before they can sell',
          'Automatic refund if the vendor does not accept within 10 minutes',
          'A "Not delivered" button if your order is late',
          'SMS updates and a status page for every order',
        ],
      },
      {
        heading: 'How it works',
        body: 'Open the vendor’s link → verify your phone → pick your items → pay → track → eat.',
      },
    ],
    cta: { label: 'Try the ordering demo', to: 'order' },
  },

  /* ── COMPANY ───────────────────────────────────────────── */
  about: {
    slug: 'about',
    group: 'company',
    eyebrow: 'About Sare',
    title: 'Fast, honest payouts for local food vendors.',
    lede:
      'Sare starts with one problem: vendors waiting too long for their money. Everything else, from browsing to riders, comes after that is solved.',
    status: 'live',
    sections: [
      {
        heading: 'What we believe',
        bullets: [
          'Sare never holds your money: payments split at the processor',
          'Honest pricing: the menu price is the counter price, and our fee is on the receipt',
          'Local first: built around real addresses, not assumed cities',
          'Built for the road: works on cheap phones and bad data',
        ],
      },
      {
        heading: 'Where we are',
        body: 'Sare is pre-launch. We are working with a small group of vendors before opening more widely.',
      },
    ],
    meta: [
      { k: 'Stage', v: 'Pre-launch pilot' },
      { k: 'First product', v: 'Vendor ordering links' },
    ],
  },

  careers: {
    slug: 'careers',
    group: 'company',
    eyebrow: 'Careers',
    title: 'Not hiring yet.',
    lede: 'There are no open roles right now. If you care about local commerce and want to hear when that changes, get in touch.',
    status: 'planned',
    sections: [],
    cta: { label: 'Get in touch', to: page('contact') },
  },

  blog: {
    slug: 'blog',
    group: 'company',
    eyebrow: 'Blog',
    title: 'Notes from the road.',
    lede: 'No posts yet. Product updates and vendor stories will appear here once the pilot is running.',
    status: 'planned',
    sections: [],
  },

  contact: {
    slug: 'contact',
    group: 'company',
    eyebrow: 'Contact',
    title: 'Talk to us.',
    lede: 'Sare is in a small pilot. Public support channels will be listed here before launch.',
    status: 'live',
    sections: [
      {
        heading: 'Customers',
        body: 'For help with an order, use the help options on your order status page, or contact the vendor who shared your link.',
      },
      {
        heading: 'Vendors and partners',
        body: 'Interested in joining the pilot? Ask the vendor who introduced you to Sare, or reach the founder directly.',
      },
    ],
  },

  /* ── SUPPORT ───────────────────────────────────────────── */
  faqs: {
    slug: 'faqs',
    group: 'support',
    eyebrow: 'Help centre',
    title: 'Frequently asked questions.',
    lede: 'How Sare works during the pilot.',
    status: 'live',
    sections: [
      {
        heading: 'Orders & delivery',
        bullets: [
          'How long does delivery take? The vendor gives an estimate when they accept your order. You see it on your status page and by SMS.',
          'Can I order from more than one vendor at once? Not yet. Each order is from one vendor.',
          'What if the vendor doesn’t respond? If they don’t accept within 10 minutes of your payment, the order is cancelled and refunded automatically.',
          'What if my order doesn’t arrive? If it is late, a "Not delivered" button appears on your status page. Undelivered orders are refunded.',
        ],
      },
      {
        heading: 'Payment',
        bullets: [
          'How can I pay? Card, bank transfer or USSD, through our payment processor.',
          'Is there a service fee? No. You pay the menu price plus the vendor’s delivery fee.',
          'Does Sare hold my money? No. Payments are split by the processor; Sare never holds customer or vendor funds.',
          'Can I cancel? Yes, for a full refund, until the vendor accepts.',
        ],
      },
      {
        heading: 'Vendors',
        bullets: [
          'What does Sare cost? 5% of each order, minimum ₦200, taken inside the payment split.',
          'When do I get paid? On the payment processor’s settlement schedule, straight to your bank. You get an SMS each morning a settlement was sent.',
          'What do I need to sign up? Your phone number, BVN and a bank account in your name.',
        ],
      },
      {
        heading: 'Your data',
        bullets: [
          'Where do you deliver? Set your location to check. Coverage depends on participating vendors near you.',
          'How do I delete my data? Ask through the contact page and we will handle the request under the NDPA.',
        ],
      },
    ],
    cta: { label: 'Contact us', to: page('contact') },
  },

  /* ── LEGAL ─────────────────────────────────────────────── */
  terms: {
    slug: 'terms',
    group: 'legal',
    eyebrow: 'Legal',
    title: 'Terms of Use',
    lede: 'Draft for review. These terms are not yet in force and must be reviewed by Nigerian counsel before launch.',
    status: 'draft',
    sections: [
      {
        heading: '1. Your account',
        body: 'You verify your phone number to order. You are responsible for activity under your number.',
      },
      {
        heading: '2. Orders & payment',
        body: 'Payments are processed by our licensed payment processor and split between the vendor and Sare at the time of payment. Sare does not hold customer or vendor funds.',
      },
      {
        heading: '3. Delivery',
        body: 'During the pilot, delivery is performed by the vendor. Delivery times are the vendor’s estimates.',
      },
      {
        heading: '4. Cancellations and refunds',
        body: 'Full refund if you cancel before the vendor accepts, if the vendor rejects or does not respond within 10 minutes, or if the order is not delivered. Reported problems are reviewed with the vendor’s evidence.',
      },
      {
        heading: '5. Acceptable use',
        body: 'No fraud, harassment, scraping, or misuse of the ordering system.',
      },
      {
        heading: '6. Changes',
        body: 'Material changes will be announced before they take effect.',
      },
    ],
  },

  privacy: {
    slug: 'privacy',
    group: 'legal',
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    lede: 'Draft for review. This policy is not yet in force and must be reviewed for NDPA compliance before launch.',
    status: 'draft',
    sections: [
      {
        heading: 'What we collect',
        bullets: [
          'Customers: phone number, delivery address, order history',
          'Vendors: name, phone, bank account, BVN verification result (never the raw BVN; only the last 4 digits and the provider reference)',
          'Device data needed to run and secure the service',
        ],
      },
      {
        heading: 'Why we collect it',
        body: 'To take and deliver orders, pay vendors, prevent fraud and meet legal obligations. We do not sell your data.',
      },
      {
        heading: 'Who we share it with',
        body: 'The vendor fulfilling your order, our payment processor, our SMS provider and our identity verification provider, each only for that purpose.',
      },
      {
        heading: 'Where it is stored',
        body: 'Our database is hosted outside Nigeria; cross-border transfer is covered by the provider’s data processing agreement and will be described here in full before launch.',
      },
      {
        heading: 'Your rights',
        bullets: [
          'Access a copy of your data',
          'Correct anything inaccurate',
          'Ask for deletion, subject to record-keeping duties',
          'Withdraw consent for optional messages',
        ],
      },
    ],
  },
}

export const PAGE_GROUPS: Array<{ group: PageDef['group']; title: string }> = [
  { group: 'company', title: 'Company' },
  { group: 'product', title: 'Work with Sare' },
  { group: 'support', title: 'Help' },
  { group: 'legal', title: 'Legal' },
]
