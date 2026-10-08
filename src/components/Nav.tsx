import { Bike, Store, UtensilsCrossed, Radar, Tag, Home } from 'lucide-react';

export type View = 'home' | 'order' | 'vendor' | 'rider' | 'ops' | 'pricing';

const TABS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home size={13} /> },
  { id: 'order', label: 'Order Food', icon: <UtensilsCrossed size={13} /> },
  { id: 'vendor', label: 'Vendor Hub', icon: <Store size={13} /> },
  { id: 'rider', label: 'Rider App', icon: <Bike size={13} /> },
  { id: 'ops', label: 'Network Ops', icon: <Radar size={13} /> },
  { id: 'pricing', label: 'Pricing', icon: <Tag size={13} /> },
];

export default function Nav({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-forest-deep/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button onClick={() => setView('home')} className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember font-display text-lg font-bold text-forest-deep">S</span>
          <span className="font-display text-lg font-bold tracking-tight text-cream">
            sare<span className="text-ember">.</span>
          </span>
          <span className="mono-label hidden sm:block">LAGOS · LIVE</span>
        </button>
        <nav className="ml-auto flex items-center gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                view === t.id ? 'bg-ember text-forest-deep font-semibold' : 'text-cream-dim hover:bg-forest-mid hover:text-cream'
              }`}
            >
              {t.icon}
              <span className="hidden md:inline">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
