import type { MyRsvp, RsvpStatus } from '../types/Social';
import { isRecord, readString, toRecords } from '../utils/guards';
import { toRsvpStatus } from './socialService';
import { supabase } from './supabase';

const RSVP_LIMIT = 500;

function toMyRsvp(row: unknown): MyRsvp | null {
  if (!isRecord(row)) return null;
  const id = readString(row, 'id');
  const eventId = readString(row, 'event_id');
  const status = toRsvpStatus(readString(row, 'rsvp_status'));
  return id === null || eventId === null || status === null ? null : { id, eventId, status };
}

/** All RSVPs of the user, used for the status badges on event cards. */
export async function getMyRsvps(userId: string): Promise<MyRsvp[]> {
  const { data, error } = await supabase
    .from('event_rsvps')
    .select('id, event_id, rsvp_status')
    .eq('user_id', userId)
    .limit(RSVP_LIMIT);

  if (error !== null) throw new Error(error.message);

  return toRecords(data).flatMap((row) => {
    const rsvp = toMyRsvp(row);
    return rsvp === null ? [] : [rsvp];
  });
}

export async function getMyRsvpForEvent(userId: string, eventId: string): Promise<MyRsvp | null> {
  const { data, error } = await supabase
    .from('event_rsvps')
    .select('id, event_id, rsvp_status')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .maybeSingle();

  if (error !== null) throw new Error(error.message);
  return toMyRsvp(data);
}

/** Creates or changes the RSVP (unique on user + event). RLS only allows the user's own rows. */
export async function setRsvp(userId: string, eventId: string, status: RsvpStatus): Promise<MyRsvp> {
  const { data, error } = await supabase
    .from('event_rsvps')
    .upsert({ user_id: userId, event_id: eventId, rsvp_status: status }, { onConflict: 'user_id,event_id' })
    .select('id, event_id, rsvp_status')
    .single();

  if (error !== null) throw new Error(error.message);
  const rsvp = toMyRsvp(data);
  if (rsvp === null) throw new Error('RSVP could not be saved');
  return rsvp;
}

export async function removeRsvp(rsvpId: string): Promise<void> {
  const { error } = await supabase.from('event_rsvps').delete().eq('id', rsvpId);
  if (error !== null) throw new Error(error.message);
}