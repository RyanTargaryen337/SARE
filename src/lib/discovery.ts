import { Apple, Coffee, HeartPulse, Pizza, Salad, Utensils, type LucideIcon } from 'lucide-react';
import { slugify } from './routes';

export interface Category {
  slug: string;
  /** Link text, phrased the way people search ("Rice near me"). */
  label: string;
  /** Page heading without the "near me" phrase, so a chosen city can be appended. */
  topic: string;
  icon: LucideIcon;
  description: string;
}

export const CATEGORIES: Category[] = [
  { slug: 'pasta', label: 'Pasta near me', topic: 'Pasta', icon: Utensils, description: 'Discover pasta dishes and nearby restaurants serving your favourites.' },
  { slug: 'rice', label: 'Rice near me', topic: 'Rice', icon: Utensils, description: 'Find jollof rice, fried rice, local rice dishes and more nearby.' },
  { slug: 'fast-food', label: 'Fast food near me', topic: 'Fast food', icon: Pizza, description: 'Explore quick bites, burgers, shawarma, pizza and convenient meals.' },
  { slug: 'asian-food', label: 'Asian food in my area', topic: 'Asian food', icon: Utensils, description: 'Explore Asian-inspired meals available in your delivery area.' },
  { slug: 'african-food', label: 'African food in my area', topic: 'African food', icon: Utensils, description: 'Find Nigerian and other African dishes from local kitchens.' },
  { slug: 'breakfast', label: 'Breakfast menu in my area', topic: 'Breakfast', icon: Coffee, description: 'Start the day with breakfast options from nearby vendors.' },
  { slug: 'fitfam', label: 'Fitfam stores in my area', topic: 'Fitfam stores', icon: HeartPulse, description: 'Find healthier meals, fresh ingredients and wellness essentials.' },
  { slug: 'american-food', label: 'American food in my area', topic: 'American food', icon: Pizza, description: 'Browse American-style favourites available around you.' },
  { slug: 'pastries', label: 'Pastries in my area', topic: 'Pastries', icon: Coffee, description: 'Discover cakes, pastries, bread and sweet treats nearby.' },
  { slug: 'salad', label: 'Salad near me', topic: 'Salad', icon: Salad, description: 'Find fresh salads and lighter meal options in your area.' },
  { slug: 'fruits', label: 'Fruits in my area', topic: 'Fruits', icon: Apple, description: 'Shop fresh fruits from local stores and markets.' },
  { slug: 'fine-dining', label: 'Fine dining close to me', topic: 'Fine dining', icon: Utensils, description: 'Explore elevated dining options and special-occasion meals nearby.' },
];

export const CITIES = ['Lagos', 'Abuja', 'Delta', 'Port Harcourt', 'Enugu', 'Kano', 'Ogun', 'Rivers', 'Abia'].map((name) => ({
  name,
  slug: slugify(name),
}));

export const findCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const findCity = (slug: string) => CITIES.find((c) => c.slug === slug);

export interface SavedLocation { country: string; city: string; address: string }
export const LOCATION_KEY = 'sare-delivery-location';

/** Storage can be blocked (private mode, embedded previews); callers fall back to no saved location. */
export function readSavedLocation(): SavedLocation | null {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    return raw ? (JSON.parse(raw) as SavedLocation) : null;
  } catch {
    return null;
  }
}

export function writeSavedLocation(loc: SavedLocation) {
  try { localStorage.setItem(LOCATION_KEY, JSON.stringify(loc)); } catch { /* in-memory selection still works */ }
}
