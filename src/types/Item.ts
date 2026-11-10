import type { Friend } from './Social';

/** An event as shown in the PWA. Mapped from a row of the `events` table. */
export interface Item {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  /** Human readable event type, e.g. "Club night". */
  category: string;
  /** ISO timestamp (UTC). */
  startsAt: string;
  endsAt: string | null;
  venueName: string | null;
  city: string | null;
  /** Street address (address_line_1), when known. */
  address: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  /** null means the price is unknown, 0 means free. */
  price: number | null;
  minAge: number | null;
  genres: string[];
  /** Raw genre values as stored in the database, used for matching. */
  genreKeys: string[];
  ticketUrl: string | null;
  status: string;
  venueId: string | null;
  organizerId: string | null;
  /** Unclaimed organizer directory profile, used when there is no organizer account. */
  organizerDirectoryId: string | null;
  /** Plain organizer name, used when there is no account or directory profile. */
  organizerDisplayName: string | null;
  goingCount: number;
  interestedCount: number;
  /** Friends of the current user who go or are interested. Filled for personalised lists. */
  friendsAttending: Friend[];
}