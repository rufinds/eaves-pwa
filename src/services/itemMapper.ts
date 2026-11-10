import type { Item } from '../types/Item';
import { humanize } from '../utils/eventFormat';
import { isRecord, readNumber, readRelation, readString, readStringArray } from '../utils/guards';

/** Columns (and embedded relations) selected from the `events` table. */
export const EVENT_COLUMNS = [
  'id',
  'title',
  'description',
  'start_datetime',
  'end_datetime',
  'event_type',
  'price',
  'min_age',
  'genres',
  'cover_image_url',
  'ticket_url',
  'status',
  'venue_id',
  'organizer_id',
  'venue:venues(name)',
  'location:locations(city,address_line_1,postal_code)',
].join(',');

/** Columns selected from the `mv_for_you_events` materialized view (flattened). */
export const VIEW_COLUMNS = [
  'id',
  'title',
  'description',
  'start_datetime',
  'end_datetime',
  'event_type',
  'genres',
  'status',
  'cover_image_url',
  'price',
  'min_age',
  'ticket_url',
  'organizer_id',
  'venue_id',
  'venue_name',
  'city',
  'address_line_1',
  'going_count',
  'interested_count',
].join(',');

interface RequiredFields {
  id: string;
  title: string;
  startsAt: string;
}

function readRequired(row: Record<string, unknown>): RequiredFields | null {
  const id = readString(row, 'id');
  const title = readString(row, 'title');
  const startsAt = readString(row, 'start_datetime');
  if (id === null || title === null || startsAt === null) return null;
  return { id, title, startsAt };
}

function readCommon(row: Record<string, unknown>, required: RequiredFields) {
  return {
    ...required,
    description: readString(row, 'description') ?? '',
    imageUrl: readString(row, 'cover_image_url'),
    category: humanize(readString(row, 'event_type') ?? 'other'),
    endsAt: readString(row, 'end_datetime'),
    price: readNumber(row, 'price'),
    minAge: readNumber(row, 'min_age'),
    genres: readStringArray(row, 'genres').map(humanize),
    genreKeys: readStringArray(row, 'genres'),
    ticketUrl: readString(row, 'ticket_url'),
    status: readString(row, 'status') ?? 'scheduled',
    venueId: readString(row, 'venue_id'),
    organizerId: readString(row, 'organizer_id'),
    friendsAttending: [],
  };
}

/** Maps one row of `events` (with embedded venue and location) to an Item. */
export function toItem(row: unknown): Item | null {
  if (!isRecord(row)) return null;
  const required = readRequired(row);
  if (required === null) return null;

  const venue = readRelation(row, 'venue');
  const location = readRelation(row, 'location');

  return {
    ...readCommon(row, required),
    venueName: venue === null ? null : readString(venue, 'name'),
    city: location === null ? null : readString(location, 'city'),
    address: location === null ? null : readString(location, 'address_line_1'),
    postalCode: location === null ? null : readString(location, 'postal_code'),
    goingCount: 0,
    interestedCount: 0,
  };
}

/** Maps one row of `mv_for_you_events` to an Item. */
export function toItemFromView(row: unknown): Item | null {
  if (!isRecord(row)) return null;
  const required = readRequired(row);
  if (required === null) return null;

  return {
    ...readCommon(row, required),
    venueName: readString(row, 'venue_name'),
    city: readString(row, 'city'),
    address: readString(row, 'address_line_1'),
    postalCode: null,
    goingCount: readNumber(row, 'going_count') ?? 0,
    interestedCount: readNumber(row, 'interested_count') ?? 0,
  };
}