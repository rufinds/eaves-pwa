import type { Item } from '../types/Item';
import type { LineupSlot } from '../types/Social';
import { formatShortDay } from './eventFormat';

const TIME_ZONE = 'Europe/Brussels';
const HOUR_MS = 60 * 60 * 1000;
/** A night out belongs to the evening it started: 01:00 still counts as "last night". */
const NIGHT_CUTOFF_HOURS = 6;
/** Used when an event has no end time. */
const DEFAULT_DURATION_HOURS = 4;

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE });

/** YYYY-MM-DD of the night a moment belongs to, in Leuven time. */
export function nightKey(date: Date): string {
  return dayKeyFormatter.format(new Date(date.getTime() - NIGHT_CUTOFF_HOURS * HOUR_MS));
}

function endOf(item: Item): number {
  const start = new Date(item.startsAt).getTime();
  const end = item.endsAt === null ? Number.NaN : new Date(item.endsAt).getTime();
  return Number.isNaN(end) ? start + DEFAULT_DURATION_HOURS * HOUR_MS : end;
}

export function isLive(item: Item, now: Date): boolean {
  const start = new Date(item.startsAt).getTime();
  return start <= now.getTime() && now.getTime() <= endOf(item);
}

/** Live now, or starting during the current night. */
export function isTonight(item: Item, now: Date): boolean {
  if (isLive(item, now)) return true;
  return nightKey(new Date(item.startsAt)) === nightKey(now);
}

/** Splits events into "tonight" and "coming up". The two never overlap. */
export function splitTonight(items: Item[], now: Date): { tonight: Item[]; upcoming: Item[] } {
  const tonight: Item[] = [];
  const upcoming: Item[] = [];
  for (const item of items) {
    (isTonight(item, now) ? tonight : upcoming).push(item);
  }
  return { tonight, upcoming };
}

/** "Tonight" / "Tomorrow" (urgent) or a short date such as "Fri 6 Nov". */
export function getDayLabel(iso: string, now: Date): { label: string; urgent: boolean } {
  const key = nightKey(new Date(iso));
  if (key === nightKey(now)) return { label: 'Tonight', urgent: true };
  if (key === nightKey(new Date(now.getTime() + 24 * HOUR_MS))) return { label: 'Tomorrow', urgent: true };
  return { label: formatShortDay(iso), urgent: false };
}

export type SlotStatus = 'live' | 'past' | 'upcoming';

const DEFAULT_SLOT_HOURS = 1;

/** Live while a set is on; slots without a start time stay "upcoming". */
export function getSlotStatus(slot: LineupSlot, now: Date): SlotStatus {
  if (slot.startTime === null) return 'upcoming';
  const start = new Date(slot.startTime).getTime();
  const end = slot.endTime === null ? start + DEFAULT_SLOT_HOURS * HOUR_MS : new Date(slot.endTime).getTime();
  if (now.getTime() < start) return 'upcoming';
  return now.getTime() <= end ? 'live' : 'past';
}