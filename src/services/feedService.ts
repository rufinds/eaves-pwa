import type { Item } from '../types/Item';
import type { FollowedEntity, Friend } from '../types/Social';
import { readString, readStringArray, toRecords, pair } from '../utils/guards';
import { EVENT_COLUMNS, VIEW_COLUMNS, toItem, toItemFromView } from './itemMapper';
import { selectIn } from './queryHelpers';
import { getMyRsvps } from './rsvpService';
import { getFollows, getFriendIds, getProfiles, getUserGenres } from './socialService';
import { supabase } from './supabase';

const FOR_YOU_LIMIT = 10;
const FRIENDS_LIMIT = 5;
const FOLLOWING_LIMIT = 20;
/** Candidates further out than this are left out of the For You pool. */
const MAX_DAYS_AHEAD = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

const SCORE_FRIEND_RSVP = 40;
const SCORE_FOLLOWED = 30;
const SCORE_PER_GENRE = 20;
const SCORE_PER_GOING = 2;

export interface ForYouFeed {
  forYou: Item[];
  /** Events that friends attend, most friends first. */
  friendsEvents: Item[];
}

export interface FollowingItem {
  item: Item;
  via: FollowedEntity;
}

async function getGenresOf(table: 'artist_profiles' | 'organizer_profiles', userIds: string[]): Promise<string[]> {
  const rows = await selectIn(table, 'genres', 'user_id', userIds);
  return rows.flatMap((row) => readStringArray(row, 'genres'));
}

/** Friend ids that go or are interested, grouped by event. RLS applies the friends' privacy. */
async function getFriendRsvpsByEvent(friendIds: string[]): Promise<Map<string, string[]>> {
  const byEvent = new Map<string, string[]>();
  if (friendIds.length === 0) return byEvent;

  const { data, error } = await supabase
    .from('event_rsvps')
    .select('event_id, user_id')
    .in('user_id', friendIds)
    .in('rsvp_status', ['going', 'interested']);
  if (error !== null) throw new Error(error.message);

  for (const row of toRecords(data)) {
    const eventId = readString(row, 'event_id');
    const userId = readString(row, 'user_id');
    if (eventId === null || userId === null) continue;
    byEvent.set(eventId, [...(byEvent.get(eventId) ?? []), userId]);
  }
  return byEvent;
}

function friendsOf(eventId: string, byEvent: Map<string, string[]>, profiles: Map<string, Friend>): Friend[] {
  return (byEvent.get(eventId) ?? []).flatMap((id) => {
    const friend = profiles.get(id);
    return friend === undefined ? [] : [friend];
  });
}

/**
 * Personalised feed, ranked like the Eaves API does it:
 * friends' RSVPs (+40), events of followed venues/organizers (+30),
 * overlap with followed genres (+20 each) and popularity (+2 per going).
 */
export async function getForYou(userId: string): Promise<ForYouFeed> {
  const [follows, ownGenres, friendIds] = await Promise.all([
    getFollows(userId),
    getUserGenres(userId),
    getFriendIds(userId),
  ]);

  const followedGenres = new Set<string>(ownGenres);
  const [artistGenres, organizerGenres] = await Promise.all([
    getGenresOf('artist_profiles', follows.artistIds),
    getGenresOf('organizer_profiles', follows.organizerIds),
  ]);
  [...artistGenres, ...organizerGenres].forEach((genre) => followedGenres.add(genre));

  const orParts: string[] = [];
  if (follows.organizerIds.length > 0) orParts.push(`organizer_id.in.(${follows.organizerIds.join(',')})`);
  if (follows.venueIds.length > 0) orParts.push(`venue_id.in.(${follows.venueIds.join(',')})`);

  const [friendRsvps, followedRows, myRsvps, profiles] = await Promise.all([
    getFriendRsvpsByEvent(friendIds),
    orParts.length > 0
      ? supabase.from('mv_for_you_events').select('id').or(orParts.join(',')).then(({ data }) => toRecords(data))
      : Promise.resolve([]),
    getMyRsvps(userId),
    getProfiles(friendIds),
  ]);

  const followedEventIds = new Set(followedRows.flatMap((row) => readString(row, 'id') ?? []));
  const rsvpedEventIds = myRsvps.map((rsvp) => rsvp.eventId);

  const now = new Date();
  let query = supabase
    .from('mv_for_you_events')
    .select(VIEW_COLUMNS)
    .gt('end_datetime', now.toISOString())
    .lte('start_datetime', new Date(now.getTime() + MAX_DAYS_AHEAD * DAY_MS).toISOString())
    .order('start_datetime', { ascending: true });
  if (rsvpedEventIds.length > 0) query = query.not('id', 'in', `(${rsvpedEventIds.join(',')})`);

  const { data, error } = await query;
  if (error !== null) throw new Error(error.message);

  const candidates = toRecords(data).flatMap((row) => {
    const item = toItemFromView(row);
    return item === null ? [] : [{ ...item, friendsAttending: friendsOf(item.id, friendRsvps, profiles) }];
  });

  const scored = candidates.map((item) => {
    let score = 0;
    if (friendRsvps.has(item.id)) score += SCORE_FRIEND_RSVP;
    if (followedEventIds.has(item.id)) score += SCORE_FOLLOWED;
    score += item.genreKeys.filter((genre) => followedGenres.has(genre)).length * SCORE_PER_GENRE;
    score += item.goingCount * SCORE_PER_GOING;
    return { item, score };
  });

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      b.item.goingCount - a.item.goingCount ||
      new Date(a.item.startsAt).getTime() - new Date(b.item.startsAt).getTime(),
  );

  const friendsEvents = candidates
    .filter((item) => item.friendsAttending.length > 0)
    .sort((a, b) => b.friendsAttending.length - a.friendsAttending.length)
    .slice(0, FRIENDS_LIMIT);

  return { forYou: scored.slice(0, FOR_YOU_LIMIT).map((entry) => entry.item), friendsEvents };
}

/** Upcoming events of followed venues, artists (lineup) and organizers, with the reason they show up. */
export async function getFollowing(userId: string): Promise<FollowingItem[]> {
  const follows = await getFollows(userId);

  const lineupRows = await selectIn('event_lineup', 'event_id, artist_user_id', 'artist_user_id', follows.artistIds);
  const artistsByEvent = new Map<string, string>();
  for (const row of lineupRows) {
    const eventId = readString(row, 'event_id');
    const artistId = readString(row, 'artist_user_id');
    if (eventId !== null && artistId !== null && !artistsByEvent.has(eventId)) artistsByEvent.set(eventId, artistId);
  }

  const orParts: string[] = [];
  if (follows.venueIds.length > 0) orParts.push(`venue_id.in.(${follows.venueIds.join(',')})`);
  if (follows.organizerIds.length > 0) orParts.push(`organizer_id.in.(${follows.organizerIds.join(',')})`);
  if (artistsByEvent.size > 0) orParts.push(`id.in.(${[...artistsByEvent.keys()].join(',')})`);
  if (orParts.length === 0) return [];

  const [{ data, error }, artistRows, organizerRows] = await Promise.all([
    supabase
      .from('events')
      .select(EVENT_COLUMNS)
      .eq('is_private', false)
      .eq('status', 'scheduled')
      .gte('end_datetime', new Date().toISOString())
      .or(orParts.join(','))
      .order('start_datetime', { ascending: true })
      .limit(FOLLOWING_LIMIT),
    selectIn('artist_profiles', 'user_id, stage_name', 'user_id', follows.artistIds),
    selectIn('organizer_profiles', 'user_id, organization_name', 'user_id', follows.organizerIds),
  ]);
  if (error !== null) throw new Error(error.message);

  const artistNames = new Map(artistRows.flatMap((row) => {
    const id = readString(row, 'user_id');
    const name = readString(row, 'stage_name');
    return id === null || name === null ? [] : [pair(id, name)];
  }));
  const organizerNames = new Map(organizerRows.flatMap((row) => {
    const id = readString(row, 'user_id');
    const name = readString(row, 'organization_name');
    return id === null || name === null ? [] : [pair(id, name)];
  }));

  return toRecords(data).flatMap((row) => {
    const item = toItem(row);
    if (item === null) return [];

    // Priority: venue > artist > organizer, same as the app.
    let via: FollowedEntity | null = null;
    if (item.venueId !== null && follows.venueIds.includes(item.venueId) && item.venueName !== null) {
      via = { type: 'venue', id: item.venueId, name: item.venueName };
    }
    const artistId = artistsByEvent.get(item.id);
    const artistName = artistId === undefined ? undefined : artistNames.get(artistId);
    if (via === null && artistId !== undefined && artistName !== undefined) {
      via = { type: 'artist', id: artistId, name: artistName };
    }
    const organizerName = item.organizerId === null ? undefined : organizerNames.get(item.organizerId);
    if (via === null && item.organizerId !== null && organizerName !== undefined) {
      via = { type: 'organizer', id: item.organizerId, name: organizerName };
    }
    return via === null ? [] : [{ item, via }];
  });
}