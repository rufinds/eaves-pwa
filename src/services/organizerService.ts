import type { Item } from '../types/Item';
import type { OrganizerInfo } from '../types/Extras';
import { humanize } from '../utils/eventFormat';
import { isRecord, readBoolean, readNumber, readString, readStringArray } from '../utils/guards';
import { getProfiles } from './socialService';
import { supabase } from './supabase';

async function getAccountOrganizer(userId: string): Promise<OrganizerInfo | null> {
  const { data, error } = await supabase
    .from('organizer_profiles')
    .select('user_id, organization_name, profile_picture_url, genres, is_verified, total_events_organized, upcoming_events_count')
    .eq('user_id', userId)
    .maybeSingle();
  if (error !== null) throw new Error(error.message);

  const profiles = await getProfiles([userId]);
  const person = profiles.get(userId);
  const personName = [person?.firstName, person?.lastName].filter((part) => part !== null && part !== undefined && part !== '').join(' ');
  const profile = isRecord(data) ? data : null;
  const name = (profile === null ? null : readString(profile, 'organization_name')) ?? (personName !== '' ? personName : null);
  if (name === null) return null;

  return {
    kind: 'account',
    id: userId,
    name,
    pictureUrl: (profile === null ? null : readString(profile, 'profile_picture_url')) ?? person?.pictureUrl ?? null,
    genres: profile === null ? [] : readStringArray(profile, 'genres').map(humanize),
    isVerified: profile !== null && readBoolean(profile, 'is_verified'),
    eventsOrganized: profile === null ? 0 : readNumber(profile, 'total_events_organized') ?? 0,
    upcomingEvents: profile === null ? 0 : readNumber(profile, 'upcoming_events_count') ?? 0,
  };
}

async function getDirectoryOrganizer(directoryId: string): Promise<OrganizerInfo | null> {
  const { data, error } = await supabase
    .from('organizer_directory_profiles')
    .select('id, organization_name, image_url')
    .eq('id', directoryId)
    .maybeSingle();
  if (error !== null) throw new Error(error.message);
  if (!isRecord(data)) return null;
  const name = readString(data, 'organization_name');
  return name === null ? null : { kind: 'directory', id: directoryId, name, pictureUrl: readString(data, 'image_url') };
}

/** Same priority as the app: real account, then directory profile, then a plain name. */
export async function getOrganizer(item: Item): Promise<OrganizerInfo | null> {
  if (item.organizerId !== null) {
    const account = await getAccountOrganizer(item.organizerId);
    if (account !== null) return account;
  }
  if (item.organizerDirectoryId !== null) {
    const directory = await getDirectoryOrganizer(item.organizerDirectoryId);
    if (directory !== null) return directory;
  }
  const guestName = item.organizerDisplayName?.trim() ?? '';
  return guestName === '' ? null : { kind: 'guest', name: guestName };
}