import { create } from 'zustand';
import { getNearbyPois } from '../services/poiService';
import { getOrganizer } from '../services/organizerService';
import { getSimilarEvents } from '../services/similarService';
import { getVenue } from '../services/venueService';
import type { Item } from '../types/Item';
import type { OrganizerInfo, Poi, Venue } from '../types/Extras';

interface EventExtrasState {
  eventId: string | null;
  venue: Venue | null;
  organizer: OrganizerInfo | null;
  similar: Item[];
  pois: Poi[];
  /** Coordinates used for directions and nearby places: the event's own, else the venue's. */
  coordinates: { latitude: number; longitude: number } | null;
  load: (item: Item) => Promise<void>;
}

/** Falls back to an empty value when one source fails, so the rest of the screen still works. */
const orFallback = <T>(promise: Promise<T>, fallback: T): Promise<T> => promise.catch(() => fallback);

export const useEventExtrasStore = create<EventExtrasState>((set, get) => ({
  eventId: null,
  venue: null,
  organizer: null,
  similar: [],
  pois: [],
  coordinates: null,
  load: async (item) => {
    set({ eventId: item.id, venue: null, organizer: null, similar: [], pois: [], coordinates: null });

    const [venue, organizer, similar] = await Promise.all([
      item.venueId === null ? Promise.resolve(null) : orFallback(getVenue(item.venueId), null),
      orFallback(getOrganizer(item), null),
      orFallback(getSimilarEvents(item), []),
    ]);
    if (get().eventId !== item.id) return;

    const latitude = item.latitude ?? venue?.latitude ?? null;
    const longitude = item.longitude ?? venue?.longitude ?? null;
    const coordinates = latitude !== null && longitude !== null ? { latitude, longitude } : null;
    set({ venue, organizer, similar, coordinates });

    if (coordinates === null) return;
    const pois = await orFallback(getNearbyPois(coordinates.latitude, coordinates.longitude), []);
    if (get().eventId === item.id) set({ pois });
  },
}));