import { create } from 'zustand';
import { getHomeArtists } from '../services/artistService';
import { getFollowing, getForYou, getFriendsEvents } from '../services/feedService';
import type { FollowingItem } from '../services/feedService';
import { getMyRsvps } from '../services/rsvpService';
import type { Item } from '../types/Item';
import type { ArtistItem, MyRsvp } from '../types/Social';

export type FeedSection = 'forYou' | 'friends' | 'following' | 'artists';
export type SectionStatus = 'idle' | 'loading' | 'ready' | 'error';

interface FeedState {
  forYou: Item[];
  friendsEvents: Item[];
  following: FollowingItem[];
  artists: ArtistItem[];
  /** The user's own RSVPs by event id, for the status badges on cards. */
  myRsvps: Record<string, MyRsvp>;
  status: Record<FeedSection, SectionStatus>;
  loadFeed: (userId: string) => Promise<void>;
  /** Keeps the badges in sync after an RSVP changed on the detail screen. */
  setMyRsvp: (eventId: string, rsvp: MyRsvp | null) => void;
}

export const useFeedStore = create<FeedState>((set) => {
  const setStatus = (section: FeedSection, value: SectionStatus) =>
    set((state) => ({ status: { ...state.status, [section]: value } }));

  /** Runs one section independently, so a failing section never blanks the others. */
  const runSection = async <T>(section: FeedSection, load: () => Promise<T>, apply: (data: T) => void) => {
    setStatus(section, 'loading');
    try {
      apply(await load());
      setStatus(section, 'ready');
    } catch {
      setStatus(section, 'error');
    }
  };

  return {
    forYou: [],
    friendsEvents: [],
    following: [],
    artists: [],
    myRsvps: {},
    status: { forYou: 'idle', friends: 'idle', following: 'idle', artists: 'idle' },
    loadFeed: async (userId) => {
      await Promise.all([
        runSection('forYou', () => getForYou(userId), (forYou) => set({ forYou })),
        runSection('friends', () => getFriendsEvents(userId), (friendsEvents) => set({ friendsEvents })),
        runSection('following', () => getFollowing(userId), (following) => set({ following })),
        runSection('artists', getHomeArtists, (artists) => set({ artists })),
        getMyRsvps(userId)
          .then((rsvps) => set({ myRsvps: Object.fromEntries(rsvps.map((rsvp) => [rsvp.eventId, rsvp])) }))
          .catch(() => undefined),
      ]);
    },
    setMyRsvp: (eventId, rsvp) =>
      set((state) => {
        const next = { ...state.myRsvps };
        if (rsvp === null) delete next[eventId];
        else next[eventId] = rsvp;
        return { myRsvps: next };
      }),
  };
});