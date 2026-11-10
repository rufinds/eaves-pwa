const TIME_ZONE = 'Europe/Brussels';

const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: TIME_ZONE,
});

const longDateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: TIME_ZONE,
});

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: TIME_ZONE,
});

const hourFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  hourCycle: 'h23',
  timeZone: TIME_ZONE,
});

const yearFormatter = new Intl.DateTimeFormat('en-GB', { year: 'numeric', timeZone: TIME_ZONE });

function partValue(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? '';
}

function toDate(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "19:00" in Leuven time. */
export function formatTime(iso: string): string {
  const date = toDate(iso);
  return date === null ? '' : timeFormatter.format(date);
}

/** "Fri 6 Nov · 19:00" in Leuven time. */
export function formatEventStart(iso: string): string {
  const date = toDate(iso);
  if (date === null) return iso;
  return `${formatShortDay(iso)} · ${timeFormatter.format(date)}`;
}

/** "Fri 6 Nov" in Leuven time. */
export function formatShortDay(iso: string): string {
  const date = toDate(iso);
  if (date === null) return iso;
  const parts = shortDateFormatter.formatToParts(date);
  return `${partValue(parts, 'weekday')} ${partValue(parts, 'day')} ${partValue(parts, 'month')}`;
}

/** "Friday, 6 November", with the year only when it is not the current year. */
export function formatLongDay(iso: string, now: Date = new Date()): string {
  const date = toDate(iso);
  if (date === null) return iso;
  const parts = longDateFormatter.formatToParts(date);
  const base = `${partValue(parts, 'weekday')}, ${partValue(parts, 'day')} ${partValue(parts, 'month')}`;
  const sameYear = yearFormatter.format(date) === yearFormatter.format(now);
  return sameYear ? base : `${base} ${partValue(parts, 'year')}`;
}

/** "Good morning" / "Good afternoon" / "Good evening" in Leuven time. */
export function getGreeting(now: Date): string {
  const hour = Number(hourFormatter.format(now));
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** null stays null: an unknown price must not be shown as free. */
export function formatPrice(price: number | null): string | null {
  if (price === null) return null;
  return price === 0 ? 'Free' : `€${Math.round(price)}`;
}

/** Detail price: whole euros without decimals, otherwise two decimals (€7.50). */
export function formatPriceExact(price: number | null): string | null {
  if (price === null) return null;
  if (price === 0) return 'Free';
  return Number.isInteger(price) ? `€${price}` : `€${price.toFixed(2)}`;
}

/** "Het Depot, Leuven": venue name plus city, whichever parts exist. */
export function formatPlace(venueName: string | null, city: string | null): string {
  return [venueName, city].filter((part): part is string => part !== null && part !== '').join(', ');
}

const ACRONYMS = new Set(['edm', 'dj', 'rnb']);

/** "drum_and_bass" -> "Drum & Bass", "edm" -> "EDM", "club_night" -> "Club Night". */
export function humanize(value: string): string {
  return value
    .split('_')
    .filter((word) => word !== '')
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === 'and') return '&';
      if (ACRONYMS.has(lower)) return lower.toUpperCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

/** "Anna is going", "Anna + 1 other going", "Anna + 3 others going", "2 friends going". */
export function formatFriendsGoing(firstName: string | null, count: number): string {
  if (count <= 0) return '';
  if (firstName === null || firstName.trim() === '') return count === 1 ? '1 friend going' : `${count} friends going`;
  if (count === 1) return `${firstName} is going`;
  if (count === 2) return `${firstName} + 1 other going`;
  return `${firstName} + ${count - 1} others going`;
}