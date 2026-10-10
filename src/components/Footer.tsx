import { ArrowRight, BookOpen, Building2, LifeBuoy, MapPin, Scale, Users, type LucideIcon } from 'lucide-react';
import { PAGES, PAGE_GROUPS, type PageDef } from '../lib/pages';
import { city, HOME, near, page, type Navigate } from '../lib/routes';
import { CATEGORIES, CITIES } from '../lib/discovery';

const GROUP_ICON: Record<PageDef['group'], LucideIcon> = { company: Building2, product: Users, support: LifeBuoy, legal: Scale };

const LINK_LABEL: Record<string, string> = {
  customers: 'Customers', vendors: 'Vendors', riders: 'Riders', ads: 'Sare Ads', 'soke-sare': 'Soke Sare',
  storefront: 'Storefront', documentation: 'Documentation', 'food-delivery': 'Food delivery',
  about: 'About', careers: 'Careers', blog: 'Blog', contact: 'Contact', faqs: 'FAQs',
  terms: 'Terms of Use', privacy: 'Privacy Policy',
};

const linkClass = 'text-left text-sm text-[#c0cec3] transition hover:text-white';

export default function Footer({ go, onChooseLocation }: { go: Navigate; onChooseLocation: () => void }) {
  const pages = Object.values(PAGES);
  return (
    <footer className="bg-[#10291f] text-[#f7f6f0]">
      <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
        <div className="flex items-center gap-2 text-sm font-bold"><MapPin size={16} className="text-[#f0a66d]" /> Discover near you</div>
        <div className="mt-4 grid gap-7 border-b border-white/10 pb-8 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#aabbb0]">Popular searches</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-3">
              {CATEGORIES.map((c) => <button key={c.slug} onClick={() => go(near(c.slug))} className={linkClass}>{c.label}</button>)}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-[#aabbb0]">Explore locations</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-3">
              {CITIES.map((c) => <button key={c.slug} onClick={() => go(city(c.slug))} className={linkClass}>{c.name}</button>)}
            </div>
            <p className="mt-3 text-xs leading-5 text-[#81968a]">Availability depends on your exact address and participating vendors. Location pages do not guarantee live coverage.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_3fr]">
        <div>
          <button onClick={() => go(HOME)} className="font-display text-3xl font-bold">sare<span className="text-[#f0a66d]">.</span></button>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#c0cec3]">Ordering links for local food vendors, with payouts straight from the payment processor to the vendor’s bank. Sare never holds your money.</p>
          <button onClick={onChooseLocation} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f0a66d] px-4 py-2.5 text-sm font-bold text-[#173126]">Set delivery location <ArrowRight size={15} /></button>
        </div>
        <div className="grid gap-8 sm:grid-cols-4">
          {PAGE_GROUPS.map(({ group, title }) => {
            const Icon = GROUP_ICON[group] ?? BookOpen;
            return (
              <div key={group}>
                <h2 className="flex items-center gap-2 text-sm font-bold"><Icon size={16} className="text-[#f0a66d]" />{title}</h2>
                <ul className="mt-4 space-y-3">
                  {pages.filter((p) => p.group === group).map((p) => (
                    <li key={p.slug}><button onClick={() => go(page(p.slug))} className={linkClass}>{LINK_LABEL[p.slug] ?? p.title}</button></li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-[#aabbb0] sm:px-8">
          <span>© {new Date().getFullYear()} Sare. Demo build: simulated network, not live service.</span>
          <div className="flex gap-4">
            <button onClick={() => go(page('terms'))} className="hover:text-white">Terms</button>
            <button onClick={() => go(page('privacy'))} className="hover:text-white">Privacy</button>
            <button onClick={() => go(page('contact'))} className="hover:text-white">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
