import { Bike, Store, UtensilsCrossed, Radar, Tag, Home } from 'lucide-react';
import { HOME, NAV_ITEMS, type AppView, type Navigate } from '../lib/routes';

const ICONS: Record<AppView, React.ReactNode> = {
  home: <Home size={13} />,
  order: <UtensilsCrossed size={13} />,
  vendor: <Store size={13} />,
  rider: <Bike size={13} />,
  ops: <Radar size={13} />,
  pricing: <Tag size={13} />,
};

/** `active` is null on info and discovery pages, so no tab is highlighted. */
export default function Nav({ active, go }: { active: AppView | null; go: Navigate }) {
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-forest-deep/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button onClick={() => go(HOME)} className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember font-display text-lg font-bold text-forest-deep">S</span>
          <span className="font-display text-lg font-bold tracking-tight text-cream">
            sare<span className="text-ember">.</span>
          </span>
          <span className="mono-label hidden sm:block">DELIVERY, YOUR WAY</span>
        </button>
        <nav className="ml-auto flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map((t) => (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              aria-current={active === t.id ? 'page' : undefined}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                active === t.id ? 'bg-ember text-forest-deep font-semibold' : 'text-cream-dim hover:bg-forest-mid hover:text-cream'
              }`}
            >
              {ICONS[t.id]}
              <span className="hidden md:inline">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
