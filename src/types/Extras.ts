export interface Venue {
  id: string;
  name: string;
  type: string | null;
  imageUrl: string | null;
  genres: string[];
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

/** Who organizes an event: an account, an unclaimed directory profile or just a name. */
export type OrganizerInfo =
  | {
      kind: 'account';
      id: string;
      name: string;
      pictureUrl: string | null;
      genres: string[];
      isVerified: boolean;
      eventsOrganized: number;
      upcomingEvents: number;
    }
  | { kind: 'directory'; id: string; name: string; pictureUrl: string | null }
  | { kind: 'guest'; name: string };

export interface Poi {
  id: string;
  name: string;
  type: string;
  address: string | null;
  description: string | null;
  distanceMeters: number;
  latitude: number | null;
  longitude: number | null;
  mapsUrl: string | null;
}