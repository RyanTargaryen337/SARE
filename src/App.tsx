import { useCallback } from 'react';
import { SimProvider } from './lib/sim';
import { HOME, parseRoute } from './lib/routes';
import { useRoute } from './lib/useRoute';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Landing, { CHOOSE_LOCATION_EVENT } from './pages/Landing';
import Customer from './pages/Customer';
import Vendor from './pages/Vendor';
import Rider from './pages/Rider';
import Ops from './pages/Ops';
import Pricing from './pages/Pricing';
import SitePage from './pages/SitePage';

export default function App() {
  const [route, go] = useRoute();
  const parsed = parseRoute(route);
  const view = parsed.kind === 'view' ? parsed.view : null;

  // The location picker lives on Home; from any other page, go Home first, then open it.
  const chooseLocation = useCallback(() => {
    if (view !== HOME) go(HOME);
    window.setTimeout(() => window.dispatchEvent(new Event(CHOOSE_LOCATION_EVENT)), view === HOME ? 0 : 80);
  }, [view, go]);

  return (
    <SimProvider>
      <div className="min-h-screen flex flex-col">
        <Nav active={view} go={go} />
        <main className="flex-1">
          {view === 'home' && <Landing go={go} />}
          {view === 'order' && <Customer />}
          {view === 'vendor' && <Vendor />}
          {view === 'rider' && <Rider />}
          {view === 'ops' && <Ops />}
          {view === 'pricing' && <Pricing />}
          {parsed.kind !== 'view' && <SitePage key={route} kind={parsed.kind} slug={parsed.slug} go={go} onChooseLocation={chooseLocation} />}
        </main>
        <Footer go={go} onChooseLocation={chooseLocation} />
      </div>
    </SimProvider>
  );
}
