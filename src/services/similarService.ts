import type { Item } from '../types/Item';
import { toRecords } from '../utils/guards';
import { VIEW_COLUMNS, toItemFromView } from './itemMapper';
import { supabase } from './supabase';

const SIMILAR_LIMIT = 6;
const SCORE_PER_GENRE = 3;
const SCORE_SAME_TYPE = 2;
const SCORE_SAME_CITY = 1.5;
const SCORE_SAME_VENUE = 1;
const SCORE_SAME_ORGANIZER = 0.5;

/** Events that resemble this one, scored like the Eaves API does (genres, type, city, venue, organizer). */
export async function getSimilarEvents(source: Item): Promise<Item[]> {
  const { data, error } = await supabase
    .from('mv_for_you_events')
    .select(VIEW_COLUMNS)
    .neq('id', source.id)
    .gt('end_datetime', new Date().toISOString());
  if (error !== null) throw new Error(error.message);

  const sourceGenres = new Set(source.genreKeys);

  return toRecords(data)
    .flatMap((row) => {
      const item = toItemFromView(row);
      if (item === null) return [];

      let score = item.genreKeys.filter((genre) => sourceGenres.has(genre)).length * SCORE_PER_GENRE;
      if (item.category === source.category) score += SCORE_SAME_TYPE;
      if (source.city !== null && item.city !== null && item.city.toLowerCase() === source.city.toLowerCase()) score += SCORE_SAME_CITY;
      if (source.venueId !== null && item.venueId === source.venueId) score += SCORE_SAME_VENUE;
      if (source.organizerId !== null && item.organizerId === source.organizerId) score += SCORE_SAME_ORGANIZER;
      return score > 0 ? [{ item, score }] : [];
    })
    .sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id))
    .slice(0, SIMILAR_LIMIT)
    .map((entry) => entry.item);
}