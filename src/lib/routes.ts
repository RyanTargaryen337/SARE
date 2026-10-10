// src/lib/routes.ts
export const HOME = 'home'
export const ORDER = 'order'
export const VENDOR = 'vendor'
export const RIDER = 'rider'
export const OPS = 'ops'
export const PRICING = 'pricing'

export const page = (slug: string) => `page/${slug}`
export const near = (slug: string) => `near/${slug}`
export const city = (slug: string) => `city/${slug}`

export const NAV_ITEMS = [
  { id: HOME, label: 'Home' },
  { id: ORDER, label: 'Order Food' },
  { id: VENDOR, label: 'Vendor Hub' },
  { id: RIDER, label: 'Rider App' },
  { id: OPS, label: 'Network Ops' },
  { id: PRICING, label: 'Pricing' },
] as const

export type AppView = (typeof NAV_ITEMS)[number]['id']
/** Any route string: an app view, `page/<slug>`, `near/<slug>` or `city/<slug>`. */
export type Route = string
export type Navigate = (to: Route) => void

export type ParsedRoute =
  | { kind: 'view'; view: AppView }
  | { kind: 'page' | 'near' | 'city'; slug: string }

const VIEWS = new Set<string>(NAV_ITEMS.map((n) => n.id))

/** Unknown routes fall back to Home so a stale or mistyped link never shows a blank screen. */
export function parseRoute(route: Route): ParsedRoute {
  const [head, ...rest] = route.replace(/^#?\/?/, '').split('/')
  const slug = rest.join('/')
  if ((head === 'page' || head === 'near' || head === 'city') && slug) return { kind: head, slug }
  if (VIEWS.has(head)) return { kind: 'view', view: head as AppView }
  return { kind: 'view', view: HOME }
}

export const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
