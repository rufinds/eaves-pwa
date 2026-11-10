import type { Poi } from '../types/Extras';
import { readNumber, readString, toRecords } from '../utils/guards';
import { supabase } from './supabase';

const RADIUS_METERS = 800;

/** Places of interest (bars, food, shops, transport, ...) within walking distance of a point. */
export async function getNearbyPois(latitude: number, longitude: number): Promise<Poi[]> {
  const { data, error } = await supabase.rpc('pois_near_coordinates', {
    lat: latitude,
    lng: longitude,
    radius_m: RADIUS_METERS,
    poi_types: null,
  });
  if (error !== null) throw new Error(error.message);

  return toRecords(data).flatMap((row): Poi[] => {
    const id = readString(row, 'id');
    const name = readString(row, 'name');
    const distance = readNumber(row, 'distance_meters');
    if (id === null || name === null || distance === null) return [];
    return [{
      id,
      name,
      type: readString(row, 'poi_type') ?? 'other',
      address: readString(row, 'address_line_1'),
      description: readString(row, 'description'),
      distanceMeters: distance,
      latitude: readNumber(row, 'latitude'),
      longitude: readNumber(row, 'longitude'),
      mapsUrl: readString(row, 'google_maps_url'),
    }];
  });
}