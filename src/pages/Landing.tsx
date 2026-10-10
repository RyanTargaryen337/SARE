import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bike, Store, Timer, Zap, MapPin, LocateFixed, ShoppingBag, Utensils, Pill, ShoppingBasket, ChevronDown, ShieldCheck } from 'lucide-react';
import { useSim } from '../lib/useSim';
import LagosMap from '../components/LagosMap';
import { ORDER, OPS, RIDER, VENDOR, type Navigate } from '../lib/routes';
import { readSavedLocation, writeSavedLocation, type SavedLocation } from '../lib/discovery';

/** Dispatched by the footer and info pages to open the location picker on Home. */
export const CHOOSE_LOCATION_EVENT = 'sare:choose-location';

const cities: Record<string, string[]> = {
  Nigeria: ['Choose a city', 'Lagos', 'Abuja', 'Benin City', 'Ibadan', 'Port Harcourt', 'Enugu', 'Kano'],
  Ghana: ['Choose a city', 'Accra', 'Kumasi', 'Tema'],
};
const categories = [
  { name: 'Food', desc: 'Meals from local favourites', icon: Utensils, color: 'bg-orange-100 text-orange-700' },
  { name: 'Groceries', desc: 'Coming later: everyday essentials', icon: ShoppingBasket, color: 'bg-lime-100 text-lime-800' },
  { name: 'Shops', desc: 'Coming later: local shops', icon: ShoppingBag, color: 'bg-violet-100 text-violet-700' },
  { name: 'Pharmacy', desc: 'Coming later: health and personal care', icon: Pill, color: 'bg-sky-100 text-sky-700' },
];

export default function Landing({ go }: { go: Navigate }) {
  const { riders, orders, tick } = useSim();
  const [locationOpen, setLocationOpen] = useState(false);
  const [country, setCountry] = useState('Nigeria');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<SavedLocation | null>(readSavedLocation);
  const [locationError, setLocationError] = useState('');
  const live = orders.filter((o) => o.state !== 'delivered' && o.state !== 'rejected');
  const activeRiders = riders.filter((r) => r.online).length;

  useEffect(() => {
    const openLocation = () => setLocationOpen(true);
    window.addEventListener(CHOOSE_LOCATION_EVENT, openLocation);
    return () => window.removeEventListener(CHOOSE_LOCATION_EVENT, openLocation);
  }, []);


  const saveLocation = () => {
    if (!city || city === 'Choose a city' || !address.trim()) {
      setLocationError('Choose your city and enter a delivery address to continue.');
      return;
    }
    const next = { country, city, address: address.trim() };
    setLocation(next);
    writeSavedLocation(next);
    setLocationError('');
    setLocationOpen(false);
  };

  const requestLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Location detection is unavailable in this browser. Enter your city and address instead.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => setLocationError('Location detected. For accurate delivery, please select your city and enter your street or landmark below.'),
      () => setLocationError('We couldn’t access your location. You can enter your city and address manually.'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  };

  return (
    <div className="bg-[#faf9f6] text-[#18251f]">
      {/* Location selection overlay */}
      {locationOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071b15]/70 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setLocationOpen(false); }}>
        <motion.div initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div><span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f2e9] text-[#236746]"><MapPin size={21}/></span><h2 className="font-display text-2xl font-bold">Where should we deliver?</h2><p className="mt-1 text-sm text-slate-500">Choose your location to see what’s available near you.</p></div>
            <button onClick={() => setLocationOpen(false)} aria-label="Close location selector" className="rounded-full px-3 py-2 text-xl text-slate-400 hover:bg-slate-100">×</button>
          </div>
          <button onClick={requestLocation} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#cbd9ce] px-4 py-3 font-semibold text-[#236746] transition hover:bg-[#f2f8f2]"><LocateFixed size={17}/> Use my current location</button>
          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400"><span className="h-px flex-1 bg-slate-200"/>or enter it manually<span className="h-px flex-1 bg-slate-200"/></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Country<select value={country} onChange={(e) => { setCountry(e.target.value); setCity(''); }} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:border-[#28734d]"><option>Nigeria</option><option>Ghana</option></select></label>
            <label className="text-sm font-semibold">City<select value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal outline-none focus:border-[#28734d]">{cities[country].map((c) => <option key={c} value={c === 'Choose a city' ? '' : c}>{c}</option>)}</select></label>
          </div>
          <label className="mt-4 block text-sm font-semibold">Delivery address<input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, estate, landmark or building" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none placeholder:text-slate-400 focus:border-[#28734d]" /></label>
          {locationError && <p role="status" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{locationError}</p>}
          <button onClick={saveLocation} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#176b45] px-5 py-3.5 font-bold text-white transition hover:bg-[#105638]">Confirm location <ArrowRight size={17}/></button>
          <p className="mt-3 text-center text-xs text-slate-400">Your location is used to tailor delivery options. It isn’t assumed from your IP address.</p>
        </motion.div>
      </div>}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-28 h-[480px] w-[480px] rounded-full bg-[#e8f1df] blur-3xl" />
        <div className="pointer-events-none absolute right-[12%] top-24 hidden h-64 w-64 rounded-full border border-[#d5e2d2] lg:block" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 md:pb-24 md:pt-20 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce6d9] bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#286447] shadow-sm"><span className="h-2 w-2 rounded-full bg-[#3a9a60]"/> Good things, delivered</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .05 }} className="max-w-2xl font-display text-5xl font-bold leading-[1.02] tracking-[-.045em] text-[#17251d] sm:text-6xl lg:text-[4.6rem]">Your city. Your cravings. <span className="text-[#218153]">Your Sare.</span></motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .12 }} className="mt-6 max-w-xl text-base leading-7 text-[#647168] sm:text-lg">Meals, groceries, and everyday essentials from places around you — delivered without the runaround.</motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .18 }} className="mt-8 max-w-xl rounded-2xl border border-[#e1e7df] bg-white p-2 shadow-[0_16px_50px_rgba(20,53,35,.09)] sm:flex sm:items-center sm:gap-2">
              <button onClick={() => setLocationOpen(true)} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#f7faf6]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf4eb] text-[#21774d]"><MapPin size={19}/></span>
                <span className="min-w-0 flex-1"><span className="block text-xs font-medium text-slate-500">DELIVER TO</span><span className="block truncate text-sm font-bold text-[#26382d]">{location ? `${location.address}, ${location.city}` : 'Enter your delivery location'}</span></span><ChevronDown size={17} className="text-slate-400"/>
              </button>
              <button onClick={() => location ? go(ORDER) : setLocationOpen(true)} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#176b45] px-6 py-4 font-bold text-white transition hover:bg-[#105638] sm:mt-0 sm:w-auto">{location ? 'Explore nearby' : 'Set location'} <ArrowRight size={17}/></button>
            </motion.div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#718076]"><span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#218153]"/> Trusted local vendors</span><span className="flex items-center gap-1.5"><Zap size={14} className="text-[#218153]"/> Simple, reliable delivery</span></div>
            <div className="mt-9 flex flex-wrap gap-3"><button onClick={() => go(RIDER)} className="flex items-center gap-2 rounded-full border border-[#d9e2d8] px-4 py-2.5 text-sm font-semibold text-[#415448] transition hover:border-[#218153] hover:bg-white"><Bike size={16}/> Become a rider</button><button onClick={() => go(VENDOR)} className="flex items-center gap-2 rounded-full border border-[#d9e2d8] px-4 py-2.5 text-sm font-semibold text-[#415448] transition hover:border-[#218153] hover:bg-white"><Store size={16}/> Sell on Sare</button></div>
          </div>
          <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .12 }} className="relative mx-auto w-full max-w-[560px]">
            <div className="relative aspect-[1.02/1] overflow-hidden rounded-[2rem] bg-[#e7eee2] p-4 sm:p-6">
              <div className="absolute inset-0 opacity-60" style={{backgroundImage:'radial-gradient(#b7cdb7 1px, transparent 1px)',backgroundSize:'18px 18px'}}/>
              <div className="absolute left-[8%] top-[10%] rounded-2xl border border-white/70 bg-white/90 p-3 shadow-lg backdrop-blur"><div className="flex items-center gap-2 text-xs font-semibold text-[#2d6a47]"><span className="h-2 w-2 rounded-full bg-[#41a466]"/> Made for your neighbourhood</div></div>
              <div className="absolute left-[8%] top-[31%] flex h-28 w-28 rotate-[-7deg] items-center justify-center rounded-[2rem] bg-[#f6d5ad] text-6xl shadow-xl sm:h-36 sm:w-36 sm:text-7xl">🍲</div>
              <div className="absolute right-[8%] top-[24%] flex h-24 w-24 rotate-[8deg] items-center justify-center rounded-[1.8rem] bg-[#f5e7b4] text-5xl shadow-xl sm:h-32 sm:w-32 sm:text-6xl">🥑</div>
              <div className="absolute bottom-[15%] left-[28%] flex h-28 w-28 rotate-[5deg] items-center justify-center rounded-[2rem] bg-[#d1e7d5] text-6xl shadow-xl sm:h-36 sm:w-36 sm:text-7xl">🛍️</div>
              <div className="absolute bottom-[8%] right-[7%] rounded-2xl bg-white px-4 py-3 shadow-xl"><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5f3e7] text-[#24764b]"><Bike size={18}/></span><span><span className="block text-xs text-slate-500">The good stuff is</span><span className="block text-sm font-bold">on its way.</span></span></div></div>
              <div className="absolute bottom-[7%] left-[7%] rounded-full bg-[#176b45] px-4 py-2 text-xs font-semibold text-white shadow-lg"><MapPin size={13} className="mr-1 inline"/>{location ? location.city : 'Your neighbourhood'}</div>
            </div>
            <div className="absolute -bottom-4 left-8 hidden rounded-2xl border border-[#e4e9e0] bg-white px-4 py-3 shadow-lg sm:block"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e6] text-[#b85c2b]"><Timer size={19}/></span><span><span className="block text-sm font-bold">Less waiting</span><span className="block text-xs text-slate-500">More living</span></span></div></div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-[#e8ece5] bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#278052]">One app, more possibilities</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">What can we get for you?</h2></div><p className="max-w-sm text-sm leading-6 text-slate-500">Start with what you need. We’ll tailor the experience to your delivery area.</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map((c, i) => <motion.button key={c.name} onClick={() => location ? go(ORDER) : setLocationOpen(true)} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.35,delay:i*.06}} className="group rounded-2xl border border-[#e6ebe4] bg-[#fcfdfb] p-5 text-left transition hover:-translate-y-1 hover:border-[#b9d4bf] hover:shadow-lg"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.color}`}><c.icon size={22}/></span><span className="mt-5 flex items-center justify-between font-display text-xl font-bold">{c.name}<ArrowRight size={17} className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#218153]"/></span><span className="mt-1 block text-sm text-slate-500">{c.desc}</span></motion.button>)}</div>
        </div>
      </section>

      {/* Simple promise / trust */}
      <section className="py-16 sm:py-20"><div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#278052]">Built around you</p><h2 className="mt-3 max-w-lg font-display text-3xl font-bold tracking-tight sm:text-4xl">Your everyday errands, with fewer steps.</h2><p className="mt-4 max-w-lg leading-7 text-slate-600">From lunch plans to last-minute essentials, Sare brings nearby options into one simple experience. Start by choosing where you are — not where an app assumes you are.</p><button onClick={() => setLocationOpen(true)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#176b45] px-5 py-3 font-semibold text-white transition hover:bg-[#105638]">Choose your location <ArrowRight size={16}/></button></div><div className="grid gap-3 sm:grid-cols-2">{[{n:'01',title:'Set your location',body:'Tell us your city and delivery address to get relevant options.'},{n:'02',title:'Find what you need',body:'Explore food, groceries, shops, and more in your area.'},{n:'03',title:'Place your order',body:'Review your order and delivery details before confirming.'},{n:'04',title:'Follow the delivery',body:'Keep the next steps clear from checkout to doorstep.'}].map(x=><div key={x.n} className="rounded-2xl border border-[#e4eae2] bg-white p-5"><span className="font-mono text-xs font-bold text-[#278052]">{x.n}</span><h3 className="mt-3 font-display text-lg font-bold">{x.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{x.body}</p></div>)}</div></div></section>

      {/* Existing demo network and footer */}
      <section className="bg-[#10291f] py-16 text-[#f7f6f0]"><div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 md:grid-cols-2"><div><p className="font-mono text-[10px] tracking-[.18em] text-[#a6c4ac]">SARE NETWORK DEMO</p><h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">A better way to move local orders.</h2><p className="mt-4 max-w-lg leading-7 text-[#c0cec3]">Explore how Sare connects customers, vendors, and delivery riders. Live network figures shown here are demo simulations, not verified live service metrics.</p><p className="mt-3 max-w-lg text-sm leading-6 text-[#c0cec3]">For vendors: 5% per order (minimum ₦200), taken inside the payment split. Your share is paid by the payment processor straight to your bank on its settlement schedule.</p><div className="mt-7 flex flex-wrap gap-3"><button onClick={() => go(ORDER)} className="flex items-center gap-2 rounded-full bg-[#f0a66d] px-5 py-3 font-bold text-[#173126] hover:bg-[#f5bb8f]">Explore the demo <ArrowRight size={16}/></button><button onClick={() => go(OPS)} className="rounded-full border border-white/25 px-5 py-3 font-semibold hover:border-white/60">Network operations</button></div><div className="mt-6 flex gap-5 text-sm text-[#c0cec3]"><span>{activeRiders} simulated riders online</span><span>{live.length} simulated orders in motion</span></div></div><div className="panel relative aspect-square max-h-[420px] overflow-hidden border-white/10"><LagosMap riders={riders}/><div className="absolute left-3 top-3 rounded-xl border border-white/10 bg-[#10291f]/85 px-3 py-2 backdrop-blur"><p className="font-mono text-[10px] tracking-widest text-[#a6c4ac]">DEMO TICK</p><p className="font-display text-lg font-bold">{tick}</p></div></div></div></section>
    </div>
  );
}
