import type { LineupSlot } from '../types/Social';
import { humanize } from '../utils/eventFormat';
import { readBoolean, readString, readStringArray, toRecords, pair } from '../utils/guards';
import { selectIn } from './queryHelpers';
import { supabase } from './supabase';

interface ProfileInfo {
  name: string | null;
  imageUrl: string | null;
  genres: string[];
}

function indexBy(
  rows: Record<string, unknown>[],
  idKey: string,
  toInfo: (row: Record<string, unknown>) => ProfileInfo,
): Map<string, ProfileInfo> {
  return new Map(rows.flatMap((row) => {
    const id = readString(row, idKey);
    return id === null ? [] : [pair(id, toInfo(row))];
  }));
}

/**
 * Lineup of an event. RLS only returns what the viewer may see: confirmed artists
 * and guest slots of public events. Names and photos come from the artist profile,
 * the directory profile or the guest name, in that order.
 */
export async function getLineup(eventId: string): Promise<LineupSlot[]> {
  const { data, error } = await supabase
    .from('event_lineup')
    .select('id, artist_user_id, stage_id, start_time, end_time, is_guest, guest_artist_name, guest_genres, artist_directory_profile_id')
    .eq('event_id', eventId)
    .order('start_time', { ascending: true, nullsFirst: false });
  if (error !== null) throw new Error(error.message);

  const rows = toRecords(data);
  const collect = (key: string) => [...new Set(rows.flatMap((row) => readString(row, key) ?? []))];

  const [artistRows, directoryRows, stageRows] = await Promise.all([
    selectIn('artist_profiles', 'user_id, stage_name, profile_picture_url, genres', 'user_id', collect('artist_user_id')),
    selectIn('artist_directory_profiles', 'id, name, image_url, genres', 'id', collect('artist_directory_profile_id')),
    selectIn('event_stages', 'id, name', 'id', collect('stage_id')),
  ]);

  const artists = indexBy(artistRows, 'user_id', (row) => ({
    name: readString(row, 'stage_name'),
    imageUrl: readString(row, 'profile_picture_url'),
    genres: readStringArray(row, 'genres'),
  }));
  const directory = indexBy(directoryRows, 'id', (row) => ({
    name: readString(row, 'name'),
    imageUrl: readString(row, 'image_url'),
    genres: readStringArray(row, 'genres'),
  }));
  const stages = new Map(stageRows.flatMap((row) => {
    const id = readString(row, 'id');
    const name = readString(row, 'name');
    return id === null || name === null ? [] : [pair(id, name)];
  }));

  return rows.flatMap((row): LineupSlot[] => {
    const id = readString(row, 'id');
    if (id === null) return [];

    const artistId = readString(row, 'artist_user_id');
    const directoryId = readString(row, 'artist_directory_profile_id');
    const stageId = readString(row, 'stage_id');
    const artist = artistId === null ? undefined : artists.get(artistId);
    const listed = directoryId === null ? undefined : directory.get(directoryId);
    const genres = artist?.genres ?? listed?.genres ?? readStringArray(row, 'guest_genres');

    return [{
      id,
      name: artist?.name ?? listed?.name ?? readString(row, 'guest_artist_name') ?? 'Unknown artist',
      imageUrl: artist?.imageUrl ?? listed?.imageUrl ?? null,
      genres: genres.map(humanize),
      startTime: readString(row, 'start_time'),
      endTime: readString(row, 'end_time'),
      isGuest: readBoolean(row, 'is_guest'),
      stageId,
      stageName: stageId === null ? null : stages.get(stageId) ?? null,
    }];
  });
}