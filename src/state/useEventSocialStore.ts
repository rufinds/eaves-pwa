import { create } from 'zustand';
import { getLineup } from '../services/lineupService';
import { getMyRsvpForEvent, removeRsvp, setRsvp } from '../services/rsvpService';
import { getEventStats, getFriendIds, getFriendsRsvpsForEvent } from '../services/socialService';
import type { EventStats, FriendRsvp, LineupSlot, MyRsvp, RsvpStatus } from '../types/Social';
import { useFeedStore } from './useFeedStore';

interface EventSocialState {
  eventId: string | null;
  lineup: LineupSlot[];
  friendsRsvps: FriendRsvp[];
  stats: EventStats;
  myRsvp: MyRsvp | null;
  isLoading: boolean;
  isSaving: boolean;
  rsvpError: string | null;
  load: (eventId: string, userId: string) => Promise<void>;
  /** Tapping the current status removes the RSVP, tapping another one switches to it. */
  toggleRsvp: (userId: string, eventId: string, status: RsvpStatus) => Promise<void>;
}

const EMPTY_STATS: EventStats = { going: 0, interested: 0 };

function adjustStats(stats: EventStats, previous: RsvpStatus | null, next: RsvpStatus | null): EventStats {
  let { going, interested } = stats;
  if (previous === 'going') going = Math.max(0, going - 1);
  if (previous === 'interested') interested = Math.max(0, interested - 1);
  if (next === 'going') going += 1;
  if (next === 'interested') interested += 1;
  return { going, interested };
}

/** Falls back to an empty value when one source fails, so the rest of the screen still works. */
const orFallback = <T>(promise: Promise<T>, fallback: T): Promise<T> => promise.catch(() => fallback);

export const useEventSocialStore = create<EventSocialState>((set, get) => ({
  eventId: null,
  lineup: [],
  friendsRsvps: [],
  stats: EMPTY_STATS,
  myRsvp: null,
  isLoading: false,
  isSaving: false,
  rsvpError: null,
  load: async (eventId, userId) => {
    set({
      eventId,
      lineup: [],
      friendsRsvps: [],
      stats: EMPTY_STATS,
      myRsvp: null,
      isLoading: true,
      rsvpError: null,
    });
    const friendsRsvps = orFallback(
      getFriendIds(userId).then((friendIds) => getFriendsRsvpsForEvent(eventId, friendIds)),
      [],
    );
    const [lineup, friends, stats, myRsvp] = await Promise.all([
      orFallback(getLineup(eventId), []),
      friendsRsvps,
      orFallback(getEventStats(eventId), EMPTY_STATS),
      orFallback(getMyRsvpForEvent(userId, eventId), null),
    ]);
    // Ignore a slow response for an event the user has already left.
    if (get().eventId !== eventId) return;
    set({ lineup, friendsRsvps: friends, stats, myRsvp, isLoading: false });
  },
  toggleRsvp: async (userId, eventId, status) => {
    const { myRsvp: previous, stats } = get();
    const willRemove = previous !== null && previous.status === status;
    const optimistic: MyRsvp | null = willRemove ? null : { id: previous?.id ?? 'pending', eventId, status };

    set({
      myRsvp: optimistic,
      stats: adjustStats(stats, previous?.status ?? null, optimistic?.status ?? null),
      isSaving: true,
      rsvpError: null,
    });

    try {
      let saved: MyRsvp | null = null;
      if (willRemove && previous !== null) await removeRsvp(previous.id);
      else saved = await setRsvp(userId, eventId, status);

      set({ myRsvp: saved, isSaving: false });
      useFeedStore.getState().setMyRsvp(eventId, saved);
      // Refresh the real counts; a failure here keeps the optimistic numbers.
      const fresh = await orFallback(getEventStats(eventId), null);
      if (fresh !== null && get().eventId === eventId) set({ stats: fresh });
    } catch (error) {
      set({
        myRsvp: previous,
        stats,
        isSaving: false,
        rsvpError: error instanceof Error ? error.message : 'Could not update your RSVP',
      });
    }
  },
}));