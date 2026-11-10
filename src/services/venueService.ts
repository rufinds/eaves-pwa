import type { Venue } from '../types/Extras';
import { humanize } from '../utils/eventFormat';
import { isRecord, readNumber, readRelation, readString, readStringArray } from '../utils/guards';
import { supabase } from './supabase';

/** Venue details with the address of its location. */
export async function getVenue(venueId: string): Promise<Venue | null> {
  const { data, error } = await supabase
    .from('venues')
    .select('id, name, venue_type, image_url, genres, location:locations(city, address_line_1, latitude, longitude)')
    .eq('id', venueId)
    .maybeSingle();
  if (error !== null) throw new Error(error.message);
  if (!isRecord(data)) return null;

  const id = readString(data, 'id');
  const name = readString(data, 'name');
  if (id === null || name === null) return null;

  const location = readRelation(data, 'location');
  const type = readString(data, 'venue_type');
  return {
    id,
    name,
    type: type === null ? null : humanize(type),
    imageUrl: readString(data, 'image_url'),
    genres: readStringArray(data, 'genres').map(humanize),
    city: location === null ? null : readString(location, 'city'),
    address: location === null ? null : readString(location, 'address_line_1'),
    latitude: location === null ? null : readNumber(location, 'latitude'),
    longitude: location === null ? null : readNumber(location, 'longitude'),
  };
}