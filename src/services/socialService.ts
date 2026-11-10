import type { Follows, Friend, FriendRsvp, RsvpStatus } from '../types/Social';
import { isRecord, readNumber, readString, toRecords } from '../utils/guards';
import { supabase } from './supabase';

export function toRsvpStatus(value: string | null): RsvpStatus | null {
  return value === 'going' || value === 'interested' || value === 'not_going' ? value : null;
}

/** Ids of the accepted friends of a user. */
export async function getFriendIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('friendships')
    .select('requester_id, recipient_id')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

  if (error !== null) throw new Error(error.message);

  return toRecords(data).flatMap((row) => {
    const requester = readString(row, 'requester_id');
    const recipient = readString(row, 'recipient_id');
    const friendId = requester === userId ? recipient : requester;
    return friendId === null ? [] : [friendId];
  });
}

/** Public profile fields of users. Private columns (email, birth date) are not readable. */
export async function getProfiles(ids: string[]): Promise<Map<string, Friend>> {
  const profiles = new Map<string, Friend>();
  if (ids.length === 0) return profiles;

  const { data, error } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_picture_url')
    .in('id', ids);

  if (error !== null) throw new Error(error.message);

  for (const row of toRecords(data)) {
    const id = readString(row, 'id');
    if (id === null) continue;
    profiles.set(id, {
      id,
      firstName: readString(row, 'first_name'),
      lastName: readString(row, 'last_name'),
      pictureUrl: readString(row, 'profile_picture_url'),
    });
  }
  return profiles;
}

/** Genres the user picked in the profile. */
export async function getUserGenres(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from('users').select('genres').eq('id', userId).maybeSingle();
  if (error !== null) throw new Error(error.message);
  if (!isRecord(data) || !Array.isArray(data.genres)) return [];
  return data.genres.filter((genre): genre is string => typeof genre === 'string');
}

/** Followed artists, organizers and venues of a user. */
export async function getFollows(userId: string): Promise<Follows> {
  const { data, error } = await supabase
    .from('follows')
    .select('followable_id, followable_type')
    .eq('follower_id', userId)
    .in('followable_type', ['artist', 'organizer', 'venue']);

  if (error !== null) throw new Error(error.message);

  const follows: Follows = { artistIds: [], organizerIds: [], venueIds: [] };
  for (const row of toRecords(data)) {
    const id = readString(row, 'followable_id');
    const type = readString(row, 'followable_type');
    if (id === null) continue;
    if (type === 'artist') follows.artistIds.push(id);
    if (type === 'organizer') follows.organizerIds.push(id);
    if (type === 'venue') follows.venueIds.push(id);
  }
  return follows;
}

/** Friends who go or are interested in one event. RLS applies the friends' privacy settings. */
export async function getFriendsRsvpsForEvent(eventId: string, friendIds: string[]): Promise<FriendRsvp[]> {
  if (friendIds.length === 0) return [];

  const { data, error } = await supabase
    .from('event_rsvps')
    .select('user_id, rsvp_status')
    .eq('event_id', eventId)
    .in('user_id', friendIds)
    .in('rsvp_status', ['going', 'interested']);

  if (error !== null) throw new Error(error.message);

  const rows = toRecords(data);
  const profiles = await getProfiles(rows.flatMap((row) => readString(row, 'user_id') ?? []));

  return rows.flatMap((row) => {
    const userId = readString(row, 'user_id');
    const status = toRsvpStatus(readString(row, 'rsvp_status'));
    const friend = userId === null ? undefined : profiles.get(userId);
    return friend === undefined || status === null ? [] : [{ friend, status }];
  });
}

/** Going and interested counts of an event (event_statistics). */
export async function getEventStats(eventId: string): Promise<{ going: number; interested: number }> {
  const { data, error } = await supabase
    .from('event_statistics')
    .select('going_count, interested_count')
    .eq('event_id', eventId)
    .maybeSingle();

  if (error !== null) throw new Error(error.message);
  if (!isRecord(data)) return { going: 0, interested: 0 };
  return {
    going: readNumber(data, 'going_count') ?? 0,
    interested: readNumber(data, 'interested_count') ?? 0,
  };
}