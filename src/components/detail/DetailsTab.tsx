import { Linking, StyleSheet, View } from 'react-native';
import type { Item } from '../../types/Item';
import { useAuthStore } from '../../state/useAuthStore';
import { useEventExtrasStore } from '../../state/useEventExtrasStore';
import { useEventSocialStore } from '../../state/useEventSocialStore';
import { buildDirectionsUrl, openCalendar, openDirections, shareEvent } from '../../utils/eventActions';
import { formatPlace } from '../../utils/eventFormat';
import { SectionHeader } from '../SectionHeader';
import { Divider } from '../primitives/Divider';
import { Text } from '../primitives/Text';
import { EventInfoBlock } from './EventInfoBlock';
import { EventQuickActions } from './EventQuickActions';
import { NearbyPlaces } from './NearbyPlaces';
import { OrganizerSection } from './OrganizerSection';
import { RsvpActions } from './RsvpActions';
import { SimilarEvents } from './SimilarEvents';
import { SocialProof } from './SocialProof';
import { VenueCard } from './VenueCard';
import { spacing } from '../../theme/tokens';

interface DetailsTabProps {
  item: Item;
  onPressItem: (id: string) => void;
}

/** Everything about one event: info, social proof, RSVP, actions, about, venue, organizer, nearby and similar. */
export function DetailsTab({ item, onPressItem }: DetailsTabProps) {
  const userId = useAuthStore((state) => state.user?.id);
  const social = useEventSocialStore();
  const extras = useEventExtrasStore();
  const { venue, organizer, similar, pois, coordinates } = extras;

  const isPast = new Date(item.endsAt ?? item.startsAt).getTime() < Date.now();
  const placeLabel = formatPlace(item.venueName ?? venue?.name ?? null, item.city);
  const directionsUrl = buildDirectionsUrl(coordinates?.latitude ?? null, coordinates?.longitude ?? null, placeLabel);

  return (
    <View style={styles.container}>
      <EventInfoBlock item={item} />
      <SocialProof stats={social.stats} friendsRsvps={social.friendsRsvps} />

      <View style={styles.divider}>
        <Divider />
      </View>

      <RsvpActions
        status={social.myRsvp?.status ?? null}
        isSaving={social.isSaving}
        isPast={isPast}
        error={social.rsvpError}
        onToggle={(status) => {
          if (userId !== undefined) void social.toggleRsvp(userId, item.id, status);
        }}
      />
      <EventQuickActions
        onAddToCalendar={() => openCalendar(item)}
        onGetDirections={() => openDirections(coordinates?.latitude ?? null, coordinates?.longitude ?? null, placeLabel)}
        onShare={() => void shareEvent(item)}
      />

      <View style={styles.divider}>
        <Divider />
      </View>

      <View style={styles.section}>
        <SectionHeader title="About" />
        <Text tone="muted" size="lg">
          {item.description !== '' ? item.description : 'No description yet.'}
        </Text>
      </View>

      {venue !== null && (
        <View style={styles.section}>
          <SectionHeader title="Venue" />
          <VenueCard venue={venue} onPress={() => void Linking.openURL(directionsUrl)} />
        </View>
      )}

      {organizer !== null && (
        <View style={styles.section}>
          <SectionHeader title="Organized by" />
          <OrganizerSection organizer={organizer} />
        </View>
      )}

      {pois.length > 0 && (
        <View style={styles.section}>
          <NearbyPlaces pois={pois} />
        </View>
      )}

      {similar.length > 0 && (
        <View style={styles.section}>
          <SimilarEvents items={similar} onPressItem={onPressItem} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: spacing.xl },
  divider: { marginHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.xs },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.xl },
});