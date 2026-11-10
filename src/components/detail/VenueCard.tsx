import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Venue } from '../../types/Extras';
import { GenreChips } from '../GenreChips';
import { Card } from '../primitives/Card';
import { CoverImage } from '../primitives/CoverImage';
import { Icon } from '../primitives/Icon';
import { Tag } from '../primitives/Tag';
import { colors, fontSize, spacing } from '../../theme/tokens';

const IMAGE_HEIGHT = 180;

interface VenueCardProps {
  venue: Venue;
  /** Opens the venue in maps. */
  onPress?: () => void;
}

/** Venue with a hero photo, its type, genres and location. */
export function VenueCard({ venue, onPress }: VenueCardProps) {
  const location = [venue.city, venue.address].filter((part): part is string => part !== null && part !== '').join(' · ');

  return (
    <Card onPress={onPress} testID="venue-card">
      <CoverImage
        uri={venue.imageUrl}
        fallbackLabel={venue.name}
        height={IMAGE_HEIGHT}
        fade
        bottom={venue.type !== null ? <Tag variant="type" size="xs" label={venue.type} /> : undefined}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{venue.name}</Text>
        <GenreChips genres={venue.genres} />
        {location !== '' && (
          <Pressable style={styles.location} onPress={onPress} disabled={onPress === undefined}>
            <Icon name="location-outline" size={13} color={colors.textMuted} />
            <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
          </Pressable>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: 6, backgroundColor: colors.surface },
  name: { fontSize: fontSize.xl, lineHeight: 24, fontWeight: '700', color: colors.text },
  location: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  locationText: { flex: 1, fontSize: fontSize.sm, color: colors.textMuted },
});