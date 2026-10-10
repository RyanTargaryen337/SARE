import { useState } from 'react';
import { ArrowRight, MapPin, Search, Store, Utensils, Clock3 } from 'lucide-react';
import { PAGES, STATUS_LABEL, type PageDef } from '../lib/pages';
import { city as cityRoute, near, ORDER, type Navigate } from '../lib/routes';
import { CATEGORIES, CITIES, findCategory, findCity, readSavedLocation } from '../lib/discovery';

type Props = { kind: 'page' | 'near' | 'city'; slug: string; go: Navigate; onChooseLocation: () => void };

const STATUS_STYLE: Record<PageDef['status'], string> = {
  live: 'bg-[#e5f3e7] text-[#1f6b43]',
  planned: 'bg-amber-50 text-amber-800',
  draft: 'bg-rose-50 text-rose-800',
};

function LocationButton({ onChooseLocation, label }: { onChooseLocation: () => void; label: string }) {
  return (
    <button onClick={onChooseLocation} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 font-semibold">
      <MapPin size={16} /> {label}
    </button>
  );
}

function DiscoveryPage({ kind, slug, go, onChooseLocation }: Props) {
  const saved = readSavedLocation();
  const place = kind === 'city' ? findCity(slug) : undefined;
  const category = kind === 'near' ? findCategory(slug) : undefined;
  const title = place
    ? `Food delivery in ${place.name}`
    : category
      ? `${category.topic} ${saved?.city ? `in ${saved.city}` : 'near you'}`
      : 'Discover what’s near you';
  const intro = place
    ? `Explore food, groceries and local essentials in ${place.name}. Set your exact delivery address to check current coverage and see vendors available to you.`
    : category?.description ?? 'Set your delivery location to see what is available.';

  return (
    <div className="min-h-[65vh] bg-[#faf9f6] text-[#18251f]">
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#278052]">Sare · Local discovery</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={onChooseLocation} className="inline-flex items-center gap-2 rounded-full bg-[#176b45] px-5 py-3 font-semibold text-white">
            <MapPin size={17} /> {saved?.city ? `Delivering to ${saved.city}` : 'Set delivery location'} <ArrowRight size={16} />
          </button>
          <button onClick={() => go(ORDER)} className="rounded-full border border-slate-300 px-5 py-3 font-semibold">Browse the demo</button>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Utensils, title: 'Food', text: 'Meals from nearby kitchens' },
            { icon: Store, title: 'Groceries & shops', text: 'Planned: everyday essentials from local stores' },
            { icon: Clock3, title: 'Availability first', text: 'Confirm your address to check service coverage' },
          ].map(({ icon: Icon, title: t, text }) => (
            <div key={t} className="rounded-2xl border border-[#e4eae2] bg-white p-5">
              <Icon className="text-[#278052]" size={24} />
              <h2 className="mt-4 font-display text-lg font-bold">{t}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs text-slate-400">Availability varies by address. Discovery pages describe categories and places, not a guarantee of live vendors or delivery coverage.</p>
      </section>
    </div>
  );
}

function DiscoveryGrid({ go }: { go: Navigate }) {
  const [search, setSearch] = useState('');
  const shown = CATEGORIES.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()));
  return (
    <section className="border-t border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#278052]">Local discovery</p>
            <h2 className="mt-2 font-display text-3xl font-bold">What are you looking for?</h2>
          </div>
          <label className="relative w-full sm:max-w-xs">
            <span className="sr-only">Search food and categories</span>
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search food and categories" className="w-full rounded-xl border border-slate-200 bg-[#faf9f6] py-3 pl-10 pr-3 outline-none focus:border-[#278052]" />
          </label>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(({ label, slug, icon: Icon }) => (
            <button key={slug} onClick={() => go(near(slug))} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#9dbca4] hover:bg-[#f6faf5]">
              <span className="rounded-xl bg-[#eaf3e8] p-3 text-[#278052]"><Icon size={20} /></span>
              <span className="flex-1 font-semibold">{label}</span>
              <ArrowRight size={16} className="text-slate-400" />
            </button>
          ))}
          {shown.length === 0 && <p className="text-sm text-slate-500">No categories match “{search}”.</p>}
        </div>
        <h3 className="mt-12 font-display text-xl font-bold">Explore places</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <button key={c.slug} onClick={() => go(cityRoute(c.slug))} className="rounded-full border border-slate-200 bg-[#faf9f6] px-4 py-2 text-sm font-medium transition hover:border-[#278052] hover:text-[#176b45]">{c.name}</button>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">These are discovery links, not a confirmation that service is live in each place.</p>
      </div>
    </section>
  );
}

export default function SitePage(props: Props) {
  const { kind, slug, go, onChooseLocation } = props;
  if (kind !== 'page') return <DiscoveryPage {...props} />;

  const def = PAGES[slug];
  if (!def) {
    return (
      <div className="mx-auto min-h-[60vh] max-w-3xl px-5 py-24 text-[#18251f] sm:px-8">
        <h1 className="font-display text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-slate-600">That page doesn’t exist. Try the menu at the bottom of the page.</p>
        <button onClick={() => go('home')} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#176b45] px-5 py-3 font-semibold text-white">Back to home <ArrowRight size={16} /></button>
      </div>
    );
  }

  const isLegal = def.group === 'legal';
  return (
    <div className="bg-[#faf9f6] text-[#18251f]">
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#278052]">{def.eyebrow}</p>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLE[def.status]}`}>{STATUS_LABEL[def.status]}</span>
        </div>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">{def.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{def.lede}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {def.cta && (
            <button onClick={() => go(def.cta!.to)} className="inline-flex items-center gap-2 rounded-full bg-[#176b45] px-5 py-3 font-semibold text-white">
              {def.cta.label} <ArrowRight size={16} />
            </button>
          )}
          {!isLegal && <LocationButton onChooseLocation={onChooseLocation} label="Set location" />}
        </div>

        {def.meta && (
          <dl className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            {def.meta.map((m) => (
              <div key={m.k} className="rounded-2xl border border-[#e4eae2] bg-white p-4">
                <dt className="text-xs uppercase tracking-wider text-slate-500">{m.k}</dt>
                <dd className="mt-1 font-semibold">{m.v}</dd>
              </div>
            ))}
          </dl>
        )}

        {def.sections.length > 0 && (
          <div className={`mt-12 grid gap-4 ${isLegal ? 'max-w-3xl' : 'sm:grid-cols-2'}`}>
            {def.sections.map((s) => (
              <article key={s.heading} className="rounded-2xl border border-[#e4eae2] bg-white p-6">
                <h2 className="font-display text-xl font-bold">{s.heading}</h2>
                {s.body && <p className="mt-3 leading-7 text-slate-700">{s.body}</p>}
                {s.bullets && (
                  <ul className="mt-3 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-2 leading-7 text-slate-700">
                        <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#278052]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.link && (
                  <button onClick={() => go(s.link!.to)} className="mt-4 inline-flex items-center gap-1 font-semibold text-[#176b45]">
                    {s.link.label} <ArrowRight size={14} />
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
      {(slug === 'customers' || slug === 'food-delivery' || slug === 'about') && <DiscoveryGrid go={go} />}
    </div>
  );
}
