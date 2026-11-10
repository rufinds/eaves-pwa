import { Linking, Share } from 'react-native';
import type { Item } from '../types/Item';
import { formatEventStart, formatPlace } from './eventFormat';

const DEFAULT_DURATION_MS = 4 * 60 * 60 * 1000;

/** Google Calendar format: 20261108T185300Z. */
function toCalendarDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function buildCalendarUrl(item: Item): string {
  const start = new Date(item.startsAt);
  const end = item.endsAt === null ? new Date(start.getTime() + DEFAULT_DURATION_MS) : new Date(item.endsAt);
  const location = [item.venueName, item.address, item.city].filter((part): part is string => part !== null && part !== '').join(', ');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: item.title,
    dates: `${toCalendarDate(start)}/${toCalendarDate(end)}`,
    details: item.description,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildDirectionsUrl(latitude: number | null, longitude: number | null, label: string): string {
  const destination = latitude !== null && longitude !== null ? `${latitude},${longitude}` : label;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function openCalendar(item: Item): void {
  void Linking.openURL(buildCalendarUrl(item));
}

export function openDirections(latitude: number | null, longitude: number | null, label: string): void {
  void Linking.openURL(buildDirectionsUrl(latitude, longitude, label));
}

/** Link to this event in the PWA, when running in a browser. */
function eventUrl(item: Item): string {
  return typeof window === 'undefined' ? '' : `${window.location.origin}/details/${item.id}`;
}

/** Native share sheet where the browser has one, otherwise the link is copied. */
export async function shareEvent(item: Item): Promise<void> {
  const url = eventUrl(item);
  const place = formatPlace(item.venueName, item.city);
  const message = `${item.title} · ${formatEventStart(item.startsAt)}${place !== '' ? ` · ${place}` : ''}`;
  try {
    await Share.share({ title: item.title, message: url === '' ? message : `${message}\n${url}`, url });
  } catch {
    if (url !== '' && typeof navigator !== 'undefined' && navigator.clipboard !== undefined) {
      await navigator.clipboard.writeText(url);
    }
  }
}

/** "30 m" below a kilometer, "1.2 km" above. */
export function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
}