import { useState } from 'react';
import { SimProvider } from './lib/sim';
import Nav, { type View } from './components/Nav';
import Landing from './pages/Landing';
import Customer from './pages/Customer';
import Vendor from './pages/Vendor';
import Rider from './pages/Rider';
import Ops from './pages/Ops';
import Pricing from './pages/Pricing';

export default function App() {
  const [view, setView] = useState<View>('home');
  return (
    <SimProvider>
      <div className="min-h-screen flex flex-col">
        <Nav view={view} setView={setView} />
        <main className="flex-1">
          {view === 'home' && <Landing go={setView} />}
          {view === 'order' && <Customer />}
          {view === 'vendor' && <Vendor />}
          {view === 'rider' && <Rider />}
          {view === 'ops' && <Ops />}
          {view === 'pricing' && <Pricing />}
        </main>
      </div>
    </SimProvider>
  );
}
