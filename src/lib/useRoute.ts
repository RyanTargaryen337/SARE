import { useCallback, useEffect, useState } from 'react';
import { HOME, type Navigate, type Route } from './routes';

const fromHash = (): Route => window.location.hash.replace(/^#\/?/, '') || HOME;

/**
 * Route state mirrored into `location.hash` (e.g. `#/page/about`), so pages can be
 * linked, shared and reached with the browser back button. Hash routing works on any
 * static host without rewrite rules. `mailto:` and `http(s):` targets leave the app.
 */
export function useRoute(): [Route, Navigate] {
  const [route, setRoute] = useState<Route>(fromHash);

  useEffect(() => {
    const onHash = () => setRoute(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = useCallback<Navigate>((to) => {
    if (/^(mailto:|tel:|https?:)/.test(to)) {
      window.location.href = to;
      return;
    }
    if (`#/${to}` !== window.location.hash) window.location.hash = `/${to}`;
    setRoute(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return [route, go];
}
