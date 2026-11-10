/** RSVP states stored in event_rsvps.rsvp_status. */
export type RsvpStatus = 'going' | 'interested' | 'not_going';

export interface MyRsvp {
  id: string;
  eventId: string;
  status: RsvpStatus;
}

export interface Friend {
  id: string;
  firstName: string | null;
  lastName: string | null;
  pictureUrl: string | null;
}

export interface FriendRsvp {
  friend: Friend;
  status: RsvpStatus;
}

export interface EventStats {
  going: number;
  interested: number;
}

export type FollowableType = 'artist' | 'organizer' | 'venue';

/** The followed venue, artist or organizer that caused an event to show up in "From following". */
export interface FollowedEntity {
  type: FollowableType;
  id: string;
  name: string;
}

export interface FollowedItemRef {
  eventId: string;
  via: FollowedEntity;
}

export interface Follows {
  artistIds: string[];
  organizerIds: string[];
  venueIds: string[];
}

export interface ArtistItem {
  id: string;
  name: string;
  pictureUrl: string | null;
  genres: string[];
  /** ISO timestamp of the next public show, if any. */
  nextShow: string | null;
  followers: number;
  rating: number;
  performances: number;
}

export interface LineupSlot {
  id: string;
  name: string;
  imageUrl: string | null;
  genres: string[];
  startTime: string | null;
  endTime: string | null;
  isGuest: boolean;
  stageId: string | null;
  stageName: string | null;
}