import type { ArtistItem } from '../types/Social';
import { readNumber, readString, readStringArray, toRecords, pair } from '../utils/guards';
import { humanize } from '../utils/eventFormat';
import { selectIn } from './queryHelpers';
import { supabase } from './supabase';

const FETCH_LIMIT = 100;
const DISPLAY_LIMIT = 10;

function rankingScore(artist: ArtistItem): number {
  return artist.followers * 0.4 + artist.rating * 20 * 0.35 + artist.performances * 0.25;
}

/** Earliest upcoming public show per artist, from the lineup of public scheduled events. */
async function getNextShows(artistIds: string[]): Promise<Map<string, string>> {
  const lineupRows = await selectIn('event_lineup', 'event_id, artist_user_id', 'artist_user_id', artistIds);
  const eventIds = [...new Set(lineupRows.flatMap((row) => readString(row, 'event_id') ?? []))];
  if (eventIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from('events')
    .select('id, start_datetime')
    .in('id', eventIds)
    .eq('is_private', false)
    .eq('status', 'scheduled')
    .gt('end_datetime', new Date().toISOString());
  if (error !== null) throw new Error(error.message);

  const startByEvent = new Map(toRecords(data).flatMap((row) => {
    const id = readString(row, 'id');
    const start = readString(row, 'start_datetime');
    return id === null || start === null ? [] : [pair(id, start)];
  }));

  const nextByArtist = new Map<string, string>();
  for (const row of lineupRows) {
    const artistId = readString(row, 'artist_user_id');
    const eventId = readString(row, 'event_id');
    const start = eventId === null ? undefined : startByEvent.get(eventId);
    if (artistId === null || start === undefined) continue;
    const current = nextByArtist.get(artistId);
    if (current === undefined || new Date(start) < new Date(current)) nextByArtist.set(artistId, start);
  }
  return nextByArtist;
}

/**
 * "Artists to watch": complete profiles only (photo, name, genre), artists with an
 * upcoming show first, each group ranked by followers, rating and performances.
 */
export async function getHomeArtists(): Promise<ArtistItem[]> {
  const { data, error } = await supabase
    .from('artist_profiles')
    .select('user_id, stage_name, genres, profile_picture_url, total_performances, average_rating, followers_count')
    .order('followers_count', { ascending: false })
    .limit(FETCH_LIMIT);
  if (error !== null) throw new Error(error.message);

  const complete = toRecords(data).flatMap((row): ArtistItem[] => {
    const id = readString(row, 'user_id');
    const name = readString(row, 'stage_name')?.trim() ?? '';
    const pictureUrl = readString(row, 'profile_picture_url');
    const genres = readStringArray(row, 'genres');
    if (id === null || name === '' || pictureUrl === null || genres.length === 0) return [];
    return [{
      id,
      name,
      pictureUrl,
      genres: genres.map(humanize),
      nextShow: null,
      followers: readNumber(row, 'followers_count') ?? 0,
      rating: readNumber(row, 'average_rating') ?? 0,
      performances: readNumber(row, 'total_performances') ?? 0,
    }];
  });

  const nextShows = await getNextShows(complete.map((artist) => artist.id));
  const withShows = complete.map((artist) => ({ ...artist, nextShow: nextShows.get(artist.id) ?? null }));
  const byScore = (a: ArtistItem, b: ArtistItem) => rankingScore(b) - rankingScore(a);

  return [
    ...withShows.filter((artist) => artist.nextShow !== null).sort(byScore),
    ...withShows.filter((artist) => artist.nextShow === null).sort(byScore),
  ].slice(0, DISPLAY_LIMIT);
}